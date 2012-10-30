Node.JS User Login Boilerplate 
==============================

** Work in progress, trying to learn. Will get there eventually ***

This is a boilerplate express application which creates a bare application which contains the most common user authentication features. Examples include:
 - sign up with facebook, google or manual
 - email activation of account (manual sign up)
 - forgot password email
 - edit profile
 - admin panel for managing users

 The boilerplate application requires REDIS for sessions and mongoDB for the user information.

 Influenced from many different github repo's and online tutorial. 

DEPENDENCIES:

Core :
------
- Express

User Interface :
----------------
- Jade (views / templates)
- Stylus
- connect-flash (will try to remove)

Communication / Network :
-------------------------
- Nodemailer (mail sender)
	- SMTP or AMAZON SES

Log :
-----
- Winston (logger)
- Loggly - optional logging to loggly
- Airbrake (there is an issue with the npm module - need to manually clone)

Security :
----------
- Passport.JS (authentication)
- Passport.JS local (link between Passport.JS and MongoDB)
- BCrypt (hash password)

Test / Quality : 
-----------------
- Mocha (integration/unit tests)
- should (assertions framework) 
- jscoverage (code coverage)

Database :
----------
- Redis (Session Store)
- MongoDB (Datas)
- Mongoose (ODM)
- Connect-redis (Redis client)

Utilities :
-----------
- UUID js
- Moment js (Date and time formatting)

