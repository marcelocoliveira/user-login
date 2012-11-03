module.exports = {
		config: require('./config/config')
	, logger: require('./apis/loggerService').logger
	, loggerStream: require('./apis/loggerService').loggerStream
	, errors: require('./config/errors')
	, passport: require('./config/passport')

}