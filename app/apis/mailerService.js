
var nodemailer = require('nodemailer')
  , emailTemplates = require('email-templates')
  , path = require('path')
  , templatesDir = path.resolve(__dirname, '../views/', 'emailTemplates')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , logger = require("./loggerService.js").logger;

// Create a transport object
if (typeof(config.amazon)!=='undefined'){
  // Create an Amazon SES transport object
  var transport = nodemailer.createTransport("SES", {
    AWSAccessKeyID: config.amazon.AWSAccessKeyID,
    AWSSecretKey: config.amazon.AWSSecretKey,
    ServiceUrl: "https://email.us-east-1.amazonaws.com" // optional
  });
}
else{
  var transport = nodemailer.createTransport("SMTP", {
    service: config.smtp.service, 
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass
    }
  });
}

/**
 * Send a single email 
 * @param  {object}   options  options.template = required email template - need a folder in views/emailTemplates
 *                             options.from = from email address "First Last <email>"
 *                             options.subject = subject line
 * @param  {object}   data     data to be populated in the email e.g data.email, data.name
 * @param  {Function} callback needs variables err and template. Either error out or pass through to the template generation
 * @return {blank}             No return function
 */
exports.sendMail = function(options, data, callback){
  emailTemplates(templatesDir, function(err, template) {
    if (err) {
      callback(err)
    } else {
      // Send a single email
      template(options.template, data, function(err, html, text) {
        if (err) {
          logger.error('unable to send activation mail to user : ' + data.email+'. Error: '+err);    
        } else {
          transport.sendMail({
            from: options.from,
            to: data.email,
            subject: options.subject,
            html: html,
            // generateTextFromHTML: true,
            text: text
          }, function(err, responseStatus) {
            if (err) {
              logger.error('unable to send activation mail to user : ' + data.email+'. Error: '+err);
              callback(err, responseStatus);
            } else {
              callback(null, responseStatus)
            }
          });
        }
      });
    }
  });
}