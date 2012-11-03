
var LocalStrategy = require("passport-local").Strategy;
var userService = require("../apis/userService");

exports.boot = function (passport, config) {
	passport.serializeUser(function(user, done) {
	  done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
	  userService.findUserById(id, function (err, user) {
	    done(err, user);
	  });
	});

	passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
	  function(email, password, done) {
      userService.authenticate(email, password, function(err, user, msg) {
        if (!user) {
          return done(null, false, { message: msg }); 
        }
        else {
          return done(null, user)
        }
      });
	  }
	));

// // use facebook strategy
//   passport.use(new FacebookStrategy({
//         clientID: config.facebook.clientID
//       , clientSecret: config.facebook.clientSecret
//       , callbackURL: config.facebook.callbackURL
//     },
//     function(accessToken, refreshToken, profile, done) {
//       userService.findUserByProvider(provider, profile, function (err, user) {
			   //   done(err, user);
			   // });
//     }
//   ))

//   // use google strategy
//   passport.use(new GoogleStrategy({
//       consumerKey: config.google.clientID,
//       consumerSecret: config.google.clientSecret,
//       callbackURL: config.google.callbackURL
//     },
//     function(accessToken, refreshToken, profile, done) {
//       // validate user exists by provider id, email or create new
//       userExistsByProvider('google', profile, done);
//     }
//   ));
};