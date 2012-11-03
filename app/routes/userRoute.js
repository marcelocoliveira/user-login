var User = require('../models/user.js');
var userService = require('../apis/userService.js');
// var errors = require('../apis/errors.js');

exports.signup = function(req, res) {
  req.session.formData = {};
  res.render('users/signup', { title: 'Signup', message: req.flash('register-error') });
}

exports.login = function(req, res) {
  res.render('users/login', {title: 'Login', message: req.flash('error') });
}

exports.register = function(req, res) {
  userService.register(req.body, function(err, user) 
  {
    if (err) {
      if(typeof(err)=="string"){
        req.flash('register-error',err);
      }
      else {
        for (var i = 0; i <= err.length - 1; i++) {
          req.flash('register-error',err[i]);
        };
      }
      req.session.formData = req.body;
      res.redirect('/signup');
    }
    else { 
      res.render('users/registerSuccess', { title: 'Registration Successful!'});
    } 
  });
}

exports.activate = function(req, res) {
  userService.activate(req.params.activationKey, function(err, user){
    console.log(req.params.activationKey)
    if (err) { 
      req.flash('error', err);
      res.redirect('/signup/resendActivation');
    }
    else {
      req.login(user, function(err){
        res.redirect('/');
      });
    }
  });
}

exports.resendActivation = function(req, res) {
  res.render('users/resendActivation', {title: 'Resend Activation Link', message: req.flash('error') });
}

exports.resendActivationLink = function(req, res) {
  userService.resendActivationLink(req.body.email, function(err, user) {
    if (err) { 
      req.flash('error', err);
      res.redirect('/signup/resendActivation');
    }
    else {
      res.render('users/activationResent', {title : 'Activation Link has been resent'});
    }
  });
}


// logout
exports.logout = function (req, res) {
  userService.logout(function(req, res){
    req.logout()
    res.redirect('/')
  });
}


// exports.activateUser = function(req, res) {
//   register.activateUser(req.body.activationKey, req.body.password, function(err, user) {
//     if (err) { 
//       logger.info('activateUser - Unable to activate user using activation key:' + req.body.activationKey);
//       res.render('greetings', { error : err}); 
//     }
//     else { res.render('greetings', {user : user}); }
//   });
// }

// exports.desactivateUser = function(req, res) {
//   register.desactivateUser(req.params.activationKey, function(err, user) {
//     if (err) { 
//       logger.error('desactivateUser - Failed to desactivate user: ' + user.email);
//       res.render('error',{ error : { message :'We cannot desactivate this user at this time' }});
//     }
//     else res.redirect('/users');
//   });
// }

// exports.listUsers = function(req, res) {
//   register.findUsersWithActivationKeys(function (err, usersWithUserActivations)
//   {
//     if (err) {
//       res.render('error',{ error : { message :'Sorry, we cannot list users at this time'}});
//     }
//     else res.render('users', {usersWithUserActivations: usersWithUserActivations});
//   });
// }


