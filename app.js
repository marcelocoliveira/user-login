
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , RedisStore = require("connect-redis")(express)
  , env = process.env.NODE_ENV || 'development'
  , config = require('./').config[env]
  , loggerStream = require('./').loggerStream
  , logger = require('./').logger
  , airbrake = require('airbrake').createClient(config.airbrake.apiKey)
  , errors = require('./').errors
  , passport = require("passport")
  , flash = require("connect-flash")
  ;

var mongodbURI = 'mongodb://'+config.mongodb.user + ':'+ config.mongodb.password+'@'+config.mongodb.host+':'+config.mongodb.port +'/'+config.mongodb.database;
mongoose.connect(mongodbURI);

// bootstrap passport config
require('./').passport.boot(passport, config)

var app = module.exports = express();

app.configure(function(){
  app.set('port', config.node.port);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());

  //use winston to pass messages to loggly
  app.use(express.logger({stream:loggerStream}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.cookieParser());

  // Configure session to use Redis as store
  app.use(express.session({ 
    store: new RedisStore({
      host:config.redis.host, 
      port:config.redis.port, 
      db:config.redis.db,
      pass:config.redis.pass,
      ttl: config.redis.ttl
    }), 
    secret:config.redis.secret 
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  //Configure dynamic helpers
  app.use(function (req, res, next) { 
    res.locals({
        appName: config.appName
      , token: req.session._csrf
      , formData: req.session.formData
      , flash: req.session.flash
      , isAuthenticated: req.isAuthenticated
      // , get user() {
      //   return req.user;
      // }
    });
    //TODO: investigate should the messages use these instead
    // app.locals.errors = {};
    // app.locals.message = {};
    next()
  })

  //csrf protection
  if(env !== "test"){
    app.use(express.csrf());
  }

  app.use(app.router);

  //Placed after the router so that there will not be a conflict if 
  //a files is uploaded with the same name as a system route
  app.use(express.compress());
  // staticCache has been deprecated.
  // TODO: investigate varnish / nginx for caching
  // app.use(express.staticCache());
  app.use(express.static(__dirname + '/public', {maxAge: 86400000}));
  
  //bootstrap error messages
  errors.loadErrors();

  // 404 if request has not been handled
  app.use(function (req, res, next) {
    next(new errors.NotFound());
  });

  // log errors to the airbrake application
  app.use(airbrake.expressHandler());

  // add error handler to the app
  app.use(function (err, req, res, next) {
    if(errors.hasOwnProperty(err.type)){
      res.status(err.status);

      // respond with html page
      if (req.accepts('html')) {
        res.render('errors/' + err.status, { title: err.status, error: err.name, url: config.domain + req.url });
        return;
      }
      // respond with json
     if (req.accepts('json')) {
        res.send({ error: err.name })
        return;
      }

      // default to plain-text. send()
      res.type('txt').send(err.name);
    } 
    else {
      // 500 for all other errors
      var publicError = new errors.InternalServerError();
      res.status(publicError.status);
      // respond with html page
      if(env === 'development'){
        res.render('errors/' + publicError.status, { title: publicError.status, error: err });
      }
      else {
        res.render('errors/' + publicError.status, { title: publicError.status });
      }
    };
  });
});

// Bootstrap routes
require('./routes/routes')(app, passport)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on "+config.node.host + ":" + app.get('port'));
});
