// User Unit Test
//

// MODULE DEPENDENCIES
// -------------------

var app = require('../app')
  , should = require('should')
  , User = require('../app/models/user')
  , userService = require('../app/apis/userService')
  , request = require('supertest')
  , fakeUser
  ;

// TESTS


describe('user functionality:', function () {

  beforeEach(function (done) {
    fakeUser = {
      first: 'Fake',
      last: 'User',
      email: 'TestUser@test.com',
      password: 'TestPassword',
      gender: 'male'
    };
    User.remove(done);
  });

  /**
   * User Registration
   */
  describe('user registration:', function () {
  	describe('when correct details are used', function() {

	    it('should register when all details are correct', function (done) {
	      userService.register(fakeUser, function (err, user){
      		should.not.exist(err);
          should.exist(user);
      		User.find({}, function(err, users) {
            users.length.should.equal(1);
            done();
          });
	      });
	    });

	    it('should register when all details are correct', function (done) {
	      request(app)
        .post('/signup')
        .send(fakeUser)
        .end(function(err, res){
          res.should.have.status(200);
          User.find({}, function(err, users) {
            users.length.should.equal(1);
            done();
          });
        });
	    });

			it('should callback with an error if user already exists', function (done) {
	      userService.register(fakeUser, function (err, user) {
	        should.not.exist(err);
	        should.exist(user);
	        userService.register(fakeUser, function (err, user) {
	          should.exist(err);
	          done();
	        });
	      });
	    });

	    it('should create a cryptedPassword', function (done) {
	      userService.register(fakeUser, function (err, user) {
	        should.exist(user.auth.hashed_password);
	        done();
	      });
	    });

	    it('should create an activationKey', function (done) {
	      userService.register(fakeUser, function(err, user) {
	        should.exist(user.auth.activationKey);
	        done();
	      });
	    });

	    it('should not be active', function (done) {
	      userService.register(fakeUser, function(err, user) {
	        user.active.should.not.be.ok;
	        done();
	      });
	    });
	  });

    describe('when incorrect credentials are used', function () {

      it('should callback with an error if first is missing', function (done) {
        delete fakeUser.first;
        userService.register(fakeUser, function(err, user) {
          should.exist(err);
          should.not.exist(user);
          done();
        });
      });

      it('should callback with an error if if first is empty', function (done) {
        fakeUser.first = '';
        userService.register(fakeUser, function(err, user) {
          should.exist(err);
          should.not.exist(user);
          done();
        });
      });

      it('should callback with an error if last is missing', function (done) {
        delete fakeUser.last;
        userService.register(fakeUser, function(err, user) {
          should.exist(err);
          should.not.exist(user);
          done();
        });
      });

      it('should callback with an error if if last is empty', function (done) {
        fakeUser.last = '';
        userService.register(fakeUser, function(err, user) {
          should.exist(err);
          should.not.exist(user);
          done();
        });
      });

      it('should callback with an error if email is missing', function (done) {
        delete fakeUser.email;
        userService.register(fakeUser, function(err, user) {
          should.exist(err);
          should.not.exist(user);
          done();
        });
      });

      it('should callback with an error if if email is empty', function (done) {
        fakeUser.email = '';
        userService.register(fakeUser, function(err, user) {
          should.exist(err);
          should.not.exist(user);
          done();
        });
      });

      it('should callback with an error if if email is not a valid email', function (done) {
        fakeUser.email = 'testtest.com';
        userService.register(fakeUser, function(err, user) {
          should.exist(err);
          should.not.exist(user);
          done();
        });
      });

      it('should callback with an error if the password is missing', function (done) {
        delete fakeUser.password;
        userService.register(fakeUser, function(err, user) {
          should.exist(err);
          should.not.exist(user);
          done();
        });
      });

      it('should callback with an error if the password is empty', function (done) {
        fakeUser.password = '';
        userService.register(fakeUser, function(err, user) {
          should.exist(err);
          should.not.exist(user);
          done();
        });
      });

      it('should callback with an error if the password is longer than 20', function (done) {
        fakeUser.password = 'areallyverylongpasswordthatshouldntbeused';
        userService.register(fakeUser, function(err, user) {
          should.exist(err);
          should.not.exist(user);
          done();
        });
      });

      it('should callback with an error if the password is longer than 3', function (done) {
        fakeUser.password = 'are';
        userService.register(fakeUser, function(err, user) {
          should.exist(err);
          should.not.exist(user);
          done();
        });
      });

      it('should callback with an error if the gender is missing', function (done) {
        fakeUser.gender = '';
        userService.register(fakeUser, function(err, user) {
          should.exist(err);
          should.not.exist(user);
          done();
        });
      });

      it('should callback with an error if the gender is empty', function (done) {
        delete fakeUser.gender;
        userService.register(fakeUser, function(err, user) {
          should.exist(err);
          should.not.exist(user);
          done();
        });
      });
    });
  });


  /**
   * User Activation
   */
  describe('user activation:',function(){
    it('should pass with valid code', function (done){
      userService.register(fakeUser, function (err, user) {
        userService.activate(user.auth.activationKey, function (err, user){
          should.not.exist(err);
          should.exist(user);
          done();
        });
      });
    });
    it('should pass with valid code - url', function (done){
      userService.register(fakeUser, function (err, user) {
        request(app)
          .get('/user/activate/'+user.auth.activationKey)
          .end(function(err, res){
            res.should.have.status(302);
            User.findOne({"name.first": fakeUser.first}, function(err, user){
              user.active.should.be.ok;
              should.not.exist(user.auth.activationKey);
              done();
            })
          });
      });
    })
    it('should fail on invalid code', function (done){
      userService.register(fakeUser, function (err, user) {
        userService.activate('invalid key', function (err, user){
          should.not.exist(user);
          should.exist(err);
          User.findOne({"name.first": fakeUser.first}, function(err, user){
            user.active.should.not.be.ok;
            should.exist(user.auth.activationKey);
            done();
          })
        })
      });
    });
    it('should fail on invalid code- url', function (done){
      userService.register(fakeUser, function (err, user) {
        request(app)
          .get('/user/activate/1234'+user.auth.activationKey)
          .end(function(err, res){
            res.should.have.status(302);
            User.findOne({"name.first": fakeUser.first}, function(err, user){
              user.active.should.not.be.ok;
              should.exist(user.auth.activationKey);
              done();
            })
          });
      });
    });
    it('should resend activation code if email is correct', function (done){
      userService.register(fakeUser, function (err, user) {
        userService.resendActivationLink(user.email, function(err, user){
          should.not.exist(err);
          should.exist(user);
          done();
        });
      });
    });
    it('should error if email is not registered', function (done){
      userService.register(fakeUser, function (err, user) {
        userService.resendActivationLink('other@test.com', function(err, user){
          should.not.exist(user);
          should.exist(err);
          done();
        });
      });
    });
    it('should error if user is active', function (done){
      userService.register(fakeUser, function (err, user) {
        userService.activate(user.auth.activationKey, function(err, user){
          userService.resendActivationLink(user.email, function(err, user){
            should.not.exist(user);
            should.exist(err);
            done();
          });
        });
      });
    });
  })

  /**
   * User Login
   * TODO: Validate that these work. Not convinced
   */
  describe('user login:', function(){
    it('should reject if no email', function (done){
      delete fakeUser.email;
      request(app)
        .post('/login')
        .send(fakeUser)
        .end(function(err, res){
          res.should.have.status(302);
          res.header['location'].should.include('/login')
          done();
        });
    });
    it('should reject if no password', function (done){
      delete fakeUser.password;
      request(app)
        .post('/login')
        .send(fakeUser)
        .end(function(err, res){
          res.header['location'].should.include('/login')
          done();
        });
    });
    it('should reject if user doesn\'t exist', function (done){
      request(app)
        .post('/login')
        .send(fakeUser)
        .end(function(err, res){
          res.header['location'].should.include('/login')
          done();
        });
    });
    it("should reject if user isn't active", function (done){
      userService.register(fakeUser, function(err, user) {
          request(app)
            .post('/login')
            .send(fakeUser)
            .end(function(err, res){
              res.header['location'].should.include('/login')
              done();
            });
        });
    });
    it('should log in if the user is active', function(done){
      userService.register(fakeUser, function(err, user) {
        userService.activate(user.auth.activationKey, function(err, user){
          request(app)
            .get('./logout');
          request(app)
            .post('/login')
            .send({email: fakeUser.email, password: fakeUser.password})
            .end(function(err, res){
              res.header['location'].should.not.include('/login')
              done();
            });
        });
      });
    });
  });
  // 
  // /////////////////////////////////////////////////

  /**
   * UserService Helper Methods
   * 
   */
  describe('.findUserByEmail', function () {

    it('should callback with a user', function (done) {
      userService.register(fakeUser, function (err, user) {
        userService.findUserByEmail(fakeUser.email, function (err, user) {
          should.not.exist(err);
          should.exist(user);
          done();
        });
      });
    });

    it('should callback with nothing if user does not exist', function (done) {
      userService.findUserByEmail(fakeUser.email, function (err, user) {
        should.not.exist(user);
        done();
      });
    });
  });

  describe('.findUserById', function () {

    it('should callback with a user', function (done) {
      userService.register(fakeUser, function (err, user) {
        userService.findUserById(user.id, function (err, user) {
          should.not.exist(err);
          should.exist(user);
          done();
        });
      });
    });

    it('should callback with nothing if user does not exist', function (done) {
      userService.findUserById('fake', function (err, user) {
        should.not.exist(user);
        done();
      });
    });
  });


});