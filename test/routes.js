var app = require('../app')
  , should = require('should')
  , request = require('supertest')
  ;

describe('routes:', function(){
  /*
   * System routes
   */
  it('should serve static files', function(done){
    request(app)
      .get('/img/404.jpeg')
      .expect(200, done);
  })
  it('should fail on bad routes', function(done){
    request(app)
      .get('/bad')
      .expect(404, done);
  });

  // test the index route
  it('should return index', function(done) {
    request(app)
      .get('/')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
  // test the fail route
  it('should return 500', function(done) {
    request(app)
      .get('/failftw')
      .end(function(err, res){
        res.should.have.status(500);
        done();
      });
  });

  /*
   * User routes
   */
  
  // access the register page
  describe('user routes:', function(){
    describe('user login:', function(){
      it('should display the user login page', function(done){
        request(app)
          .get('/login')
          .end(function(err, res){
            res.should.have.status(200);
            done();
          })
      });
    });
    
    // failing due to formData variable - requested assistance
    // it('should display the user register page', function(done){
    //   request(app)
    //     .get('/signup')
    //     .expect(200, done);
    // });
  });
});