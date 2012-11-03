//load routes
var userRoute = require('../app/routes/userRoute');

function getLayout(req) {
	if (req.isAuthenticated() && req.user) { 
 		return 'layoutAuthenticated'; 
 	}
 	else { 
 		return 'layout'; 
 	}
}

module.exports = function (app, passport) {

	//home routes
	app.get('/', function (req, res){

		var test = getLayout(req);

		// if(test === 'layoutAuthenticated'){
		// 		res.render('index', { title: 'Home'} );
		// } else {
		// 	users.login
		// }
		res.render('index', { title: 'Home'} );
	})

	app.get('/failftw', function (req, res){
		throw new Error('Fail Whale');
	});

	//user routes
	app.get('/signup', userRoute.signup);
  app.post('/signup', userRoute.register);
  app.get('/signup/resendActivation', userRoute.resendActivation);
  app.post('/signup/resendActivation', userRoute.resendActivationLink);
  app.get('/user/activate/:activationKey', userRoute.activate)

  app.get('/login', userRoute.login);
  app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));
  app.get('/logout', userRoute.logout);
  



  // app.get('/logout', userRoute.logout);
  // app.get('/users/:username', userRoute.show);
}