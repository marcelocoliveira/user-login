
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , RedisStore = require("connect-redis")(express)
  , config = require('./').config;

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.cookieParser());

  // Configure session to use Redis as store
  app.use(express.session({ 
    store: new RedisStore({
      host:config.redis.host, 
      port:config.redis.port, 
      ttl: config.redis.ttl
    }), 
    secret:config.redis.secret 
  }));

  //Configure dynamic helpers
  app.use(function (req, res, next) { 
    res.locals({
        title: config.appName
      // , token: req.session._csrf
      // , flash: req.session.flash
      // , isAuthenticated: req.isAuthenticated
      // , get user() {
      //   return req.user;
      // }
    });
    //TODO: investigate should the messages use these instead
    // app.locals.errors = {};
    // app.locals.message = {};
    next()
  })

  app.use(app.router);

  //TODO: add caching
  app.use(express.static(__dirname + '/public'));
  
  // Since this is the last non-error-handling
  // middleware use()d, we assume 404, as nothing else
  // responded.
  // $ curl http://localhost:3000/notfound
  // $ curl http://localhost:3000/notfound -H "Accept: application/json"
  // $ curl http://localhost:3000/notfound -H "Accept: text/plain"
  app.use(function(req, res, next){
    res.status(404);
    
    // respond with html page
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

  // error-handling middleware, take the same form
  // as regular middleware, however they require an
  // arity of 4, aka the signature (err, req, res, next).
  // when connect has an error, it will invoke ONLY error-handling
  // middleware.

  // If we were to next() here any remaining non-error-handling
  // middleware would then be executed, or if we next(err) to
  // continue passing the error, only error-handling middleware
  // would remain being executed, however here
  // we simply respond with an error page.

  app.use(function(err, req, res, next){
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || 500);
    res.render('500', { error: err });
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
