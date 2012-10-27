var app = require('../app')
  , should = require('should')
  , request = require('supertest')
  , routes = require('../routes');

describe('routes', function(){
  it('should serve static files', function(done){
    request(app)
      .get('/coverage.html')
      .expect(200, done);
  })
  it('should fail on bad routes', function(done){
    request(app)
      .get('/bad')
      .expect(404, done);
  });

  // test the index route
  describe('#index', function() {
    it('should return index', function(done) {
      request(app)
        .get('/')
        .end(function(err, res){
          res.should.have.status(200);
          done();
        });
    });
  });
  // test the fail route
  describe('#failftw', function() {
    it('should return 500', function(done) {
      request(app)
        .get('/failftw')
        .end(function(err, res){
          res.should.have.status(500);
          done();
        });
    });
  });
});