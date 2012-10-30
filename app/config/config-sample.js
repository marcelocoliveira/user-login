module.exports = {
	development: {
		//some app defaults
		  appName: 'Test'
		, domain: 'www.test.com'
		, email: {
					registration: 'no_reply@test.com'
				, info: 'info@test.com'
			}
		,	node: {
					host: 'localhost'
				, port: '3000'
			}
			//loggly is a cloud service to make handling log files easier
			//particularly across multiple servers
			// logging will work locally unless you want to uncomment
		// ,	loggly: {
		// 			subdomain: "REPLACE WITH LOGGLY SUBDOMAIN"
		// 	  , inputToken: "REPLACE WITH LOGGLY INPUT TOKEN"
		// 	  , auth: {
		// 		      username: "REPLACE WITH LOGGLY USERNAME"
		// 		    , password: "REPLACE WITH LOGGLY PASSWORD"
		// 	    }
		// 	  , json: true
		// 	}
			//airbrake is a cloud service for tracking errors
		,	airbrake: {
				apiKey: "REPLACE WITH AIRBRAKE API KEY"
			}
			//the main application database
		,	mongodb: {
					host: 'localhost'
				,	port: '27017'
				,	user: ''
				,	password: ''
				,	database: 'users',
			}
			//Redis settings
		,	redis: {
					host: 'REPLACE WITH REDIS HOST'
				,	port: 'REPLACE WITH REDIS PORT'
				,	db: 'REPLACE WITH REDIS DB OR BLANK'
				,	pass: 'REPLACE WITH REDIS PASS OR BLANK'
				,	ttl: 60 * 60 * 24 * 60
				,	secret: 'REPLACE WITH SECRET'
			}
			//EMAIL
			//for testing email, can leave as is or move to amazon SES / sendgrid
		,	smtp: { 
					service: "Gmail" 
				,	user: "REPLACE WITH USERNAME"
				,	pass: "REPLACE WITH PASSWORD"
			}
			//for use in the mail api - if your system needs a good mail handler
		,	amazon: {
					AWSAccessKeyID: 'REPLACE WITH AWSAccessKeyID'
				,	AWSSecretKey: 'REPLACE WITH AWSSecretKey'
				,	ServiceUrl: 'REPLACE WITH YOUR AWS Service URL'
			}
		}
	,	test: {

		}
	,	production: {

		}
}