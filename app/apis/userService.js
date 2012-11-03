
var User = require('../models/user.js')
  , uuid = require("uuid-js")
  , logger = require("./loggerService.js").logger
  , flashMessages = require("../config/appFlashMessages")
  , env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , mailService = require('./mailerService.js')
  , cryptographicService = require("./cryptographicService.js")
  , validatorService = require('../apis/validationService.js').validator()
  , sanitize = require('validator').sanitize
  ;


exports.register = function (form, callback) {
  var user = {
    email: form.email,
    first: form.first, 
    last: form.last,
    // dob: form.dob,
    gender: form.gender,
    password: form.password
  };

  validateUser(user, function(fail, errors){
    if(fail){
      logger.info('Registration form failed with '+errors)
      callback(errors, null)
    }
    else {
      exports.findUserByEmail(user.email, function(err, existingUser) {
        if (existingUser !== null) {
          logger.info('registerUser - User:' + user.email + ' already exists');
          if (existingUser.active){
            callback('The entered email address is already registered. Please <a href="/login">Login</a>', null);
          }
          else {
            callback('The entered email address already exists. <a href="/signup/resendActivation">Resend activation</a>', null);
          }
        }
        else{
          // create a new user ready to save.
          var newUser = new User();
          // add properties from the spec
          newUser.name.first = sanitize(user.first.trim()).xss();
          newUser.name.last = sanitize(user.last.trim()).xss();
          newUser.email = sanitize(user.email.toLowerCase().trim()).xss();;
          // newUser.dob = user.dob;
          newUser.gender = sanitize(user.gender.trim()).xss();
          newUser.password = sanitize(user.password.trim()).xss();
          newUser.auth.activationKey = uuid.create(4);
          // newUser.passwordConfirm = spec.passwordConfirm;
          // Save the new user and pass the callback.
          newUser.save(function(err){
            if(err){
              logger.error(err);
              throw new Error(err);
              callback('Failed to save user');
            }
            else {
              var options = {
                template: 'invite',
                from: config.appName + ' <' + config.email.registration + '>',
                subject: 'Thank you for registering for ' + config.appName
              };

              var data = {
                email: newUser.email,
                name: newUser.name.first,
                appName: config.appName,
                activationLink: config.domain+"/user/activate/" + newUser.auth.activationKey
              };

              mailService.sendMail(options, data, function(err, response){
                //TODO: what should happen if this email fails???
                if(err){
                  logger.error('activation mail failed with '+err);
                  throw new Error(err);
                }
              });
              callback(err, newUser);

            } 
          });
        }
      });
    }
  })
};


var validateUser = function(user, callback){
    validatorService.check(user.first, 'First Name is required').notEmpty();
    validatorService.check(user.last, 'Last Name is required').notEmpty();
    // validatorService.check(user.dob, 'Date of Birth is required').notEmpty();
    validatorService.check(user.email, 'Email is required').notEmpty();
    validatorService.check(user.email, 'Valid email required').isEmail();
    validatorService.check(user.password, 'Password is required').notEmpty();
    validatorService.check(user.password, 'Password must be between 6 and 20 characters').len(6, 20);
    validatorService.check(user.gender, 'Gender is required').notEmpty();
    // validatorService.check(user.dob, 'Please share your time travel secrets - or else enter a date of birth in the past').isBefore()
    // validatorService.check(user.first, 'First Name should only contain letters').isAlpha();
    // validatorService.check(user.last, 'Last Name should only contain letters').isAlpha();
    // validatorService.check(user.password, 'Password should only contain numbers and letters').isAlphanumeric();
    // validatorService.check(user.gender, 'Gender should either be male or female').isAlpha();
    
    var errors = validatorService.getErrors();
    var fail = errors.length ? true : false;
    callback(fail, errors);

};

exports.findUserByEmail = function(email, callback) {
  var sanitizedEmail = sanitize(email.toLowerCase().trim()).xss();
  User.findOne({email: sanitizedEmail}, function(err, user) {
    if (err || !user) { 
      callback(err, null); }
    else { 
      callback(null, user); 
    }
  });
}

var exists = function(email, callback) {
  exports.findUserByEmail(email, function(err, user) {
    if (err || !user) { callback(err, false, false); }
    else callback(err, true, user.active)
  });
}
// exports.findUserByEmail = findUserByEmail;

//authenticate
exports.authenticate = function(email, password, callback) {
  exports.findUserByEmail(email, function(err, user) {
    if (err){
      callback(err);
    }
    else if (!user) { 
      logger.info('Authenticate - could not find user'); 
      callback(null, null, 'The email and/or password are incorrect'); 
    }
    else {
      if (!user.active) {
        logger.info('validatePassword - User ' + user.email + ' is not active');
        callback(null, null, 'User is not active. <a href="/signup/resendActivation">Resend Activation</a>');
      }
      else {
        console.log("Password: "+password)
        console.log("User Password: "+user.password)
        cryptographicService.comparePassword(password, user.password, function(err, isPasswordMatch){
          if (!isPasswordMatch) { 
            logger.info('validatePassword - Password does not match for user : ' + user.email); 
            callback(null, null, 'The email and/or password are incorrect. <a href="/login/forgotPassword">Resend Activation</a>'); 
          }
          else { 
            callback(null, user);
          }
        });
      }
    }
  });
}

exports.activate = function(activationKey, callback) {
  User.findOne({ "auth.activationKey": activationKey }, function (err, user) {
    if (err || !user) { 
      logger.error('activateUser - key: ' + activationKey + '. Error: ' + err);
      callback('Cannot find user for selected activation key - did you try type in in? Click on the link in your email again or request a new one', null);
    }
    else {
      User.findOneAndUpdate({_id: user.id}, { $set: { active:true }, $unset: { "auth.activationKey": 1} }, { new:true, upsert:false }, function(err, user) {
        if (err) {
          throw new Error('failed to update user on activation')
        }
        else {
          callback(null, user);
        }
      });
    }
  });
}




exports.findUserById = function(id, callback) {
  User.findOne({_id: id}, function(err, user) {
    if (err || !user) { 
      callback('User could not be found', null); }
    else { callback(null, user); }
  });
}


exports.resendActivationLink = function(email, callback) {
  exports.findUserByEmail(email, function(err, user) {
    if (!user) { 
      logger.info('resend activation link requested for non registered user');
      callback('The email address entered is not registered. Please <a href="/signup">Sign Up</a>', null); 
    }
    else if (user.active) {
      logger.info('resend activation link requested for active user');
      callback('The user is already active. Please <a href="/login">Login</a>');
    }
    else if(typeof(user.auth.activationKey)==='undefined'){
      logger.error('user does not have an activation key: '+user.id);
      throw new Error('Activation Key was not generated for user'+user.id);
      callback(err);
    }
    else{
      var options = {
        template: 'invite',
        from: config.appName + ' <' + config.email.registration + '>',
        subject: 'Activation Key for ' + config.appName
      };

      var data = {
        email: user.email,
        name: user.name.first,
        appName: config.appName,
        activationLink: config.domain+"/user/activate/" + user.auth.activationKey
      };

      mailService.sendMail(options, data, function(err, response){
        //TODO: what should happen if this email fails???
        if(err){
          logger.error('resend activation mail failed with '+err);
          throw new Error(err);
        }
      });
      callback(err, user);
    }
  });
}

exports.logout = function(callback) {
  callback(true);
}


// exports.changePassword = function(login, actualPassword, newPassword, confirmPassword, callback) {
//   if (newPassword != confirmPassword) {
//     callback(errors.CHANGE_PASSWORD_CONFIRMATION_DOES_NOT_MATCH, null);
//   }
//   else
//   {
//     this.validatePassword(login, actualPassword, function(err, user) {
//       if (err == errors.INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH) {
//         callback(errors.INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH, null);
//       }
//       else {
//         userService.findUserByEmail(login, function(err, user) {
//           cryptographicService.cryptPassword(newPassword, function(err2, hash) {
//             User.update({email:login}, {$set: {password:hash}}, function(err3) {
//                 logger.info('changePassword - User:' + login.toLowerCase() + ' \'s password is now changed');
//                 userService.findUserByEmail(login, function(err, user) {
//                   callback(err || err2 || err3, user);
//                 });
//             });
//           });
//         }); 
//       }
//     });
//   }
// }





// exports.desactivateUser = function(activationKey, callback) {
//   UserActivation.findOne({activationKey: activationKey}, function(err, userActivation) {
//     if (err || !userActivation) { callback(err); }
//     else {
//         User.findOneAndUpdate({_id: userActivation.user_id}, { $set: { active:false } }, { new:true, upsert:false }, function(err, user) {
//           if (err || !user) callback(err);
//           else callback(null, user);
//       });
//     }
//   });
// }

// exports.findUsersWithActivationKeys = function(callback) {
//   var result = [];
//   UserActivation.find({}, function(err, userActivations) {
//     async.forEach(userActivations, function(userActivation, callback) {
//       User.findOne({_id:userActivation.user_id}, function(err, user) {
//       result.push({user: user, userActivation: userActivation});
//       callback(null);
//     });
//     }, function(err) {
//       callback(null, result);
//     });
//   });
// }

// exports.findActivationKeyByUserId = function(userId, callback) {
//   UserActivation.findOne({user_id: userId}, function(err, activationKey) {
//     callback(err, activationKey);
//   });
// }

// 