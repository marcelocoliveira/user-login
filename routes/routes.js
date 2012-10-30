//load routes

var home = require('./homeRoute');

module.exports = function (app) {
	app.get('/', home.index);
	app.get('/failftw', home.failftw);

}