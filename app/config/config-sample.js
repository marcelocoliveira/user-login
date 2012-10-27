module.exports = {
	appName: process.env.APP_NAME || 'Test',
	email: {
		registration: 'no_reply@test.com',
		info: 'info@test.com'
	},
	node: {
		host: process.env.NODE_HOST || 'localhost',
		port: process.env.NODE_PORT || '8888'
	},
	loggly: {
		subdomain: "your-subdomain",
    inputToken: "really-long-token-you-got-from-loggly",
    auth: {
      username: "your-username",
      password: "your-password"
    },
    json: true
	},
	mongodb: {
		host: process.env.MONGODB_HOST || 'localhost',
		port: process.env.MONGODB_PORT || '27017',
		user: process.env.MONGODB_USER || '',
		password: process.env.MONGODB_PASSWORD || '',
		database: process.env.MONGODB_DATABASE || 'users',
	},
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: process.env.REDIS_PORT || '6379',
		ttl: process.env.REDIS_TTL || 60 * 60 * 24 * 60, // = 60 days (in seconds)
		secret: process.env.SECRET || 'SECRET GOES HERE'
	},
	smtp: { //for testing email, change to amazon later
		service: "Gmail", // use well known service
		user: "ENTER USER",
		pass: "ENTER PASSWORD"
	},
	amazon: {
		AWSAccessKeyID: process.env.AWSAccessKeyID || 'REPLACE WITH AWSAccessKeyID',
		AWSSecretKey: process.env.AWSSecretKey || 'REPLACE WITH AWSSecretKey',
		ServiceUrl: process.env.AWSSecretKey || 'REPLACE WITH YOUR AWS Service URL'
	}
}