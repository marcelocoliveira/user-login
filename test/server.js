var app = require('../app')
  , should = require('should')
  , express = require('express')
  , RedisStore = require("connect-redis")(express);

describe('app', function(){
  it('should expose app settings', function(){
    var obj = app.locals.settings;
    obj.should.have.property('env', 'test');
    // expect(obj).to.have.property('appName', 'Test');
  });
});

describe('sessions', function(){
  var store = new RedisStore;
  // before(function(done){
  //   store.client.on('connect', function(){
  //     done();
  //   });
  //   // console.log(config.redis.port);
  // });
  it('should be able to store sessions', function(){
    // var store = new RedisStore;
    // store.client.on('connect', function(){
    // #set()
    store.set('123', { cookie: { maxAge: 2000 }, name: 'tj' }, function(err, ok){
      should.not.exist(err);
      should.exist(ok);
    });
  });
  it('should be able to retrieve sessions', function(){
    store.get('123', function(err, data){
      should.not.exist(err);
      // console.log(data);
      // data.should.equal({ cookie: { maxAge: 2000 }, name: 'tj' })
      data.should.be.a('object').and.have.property('name', 'tj');
      data.cookie.should.be.a('object').and.have.property('maxAge', 2000 );
    });
  })
  after(function(done){
    store.set('123', { cookie: { maxAge: 2000 }, name: 'tj' }, function(){
      store.destroy('123', function(){
        store.client.end();
        done(); 
      });
    });
  });
});

describe('in development', function(){
  it('should enable "view cache"', function(){
    process.env.NODE_ENV = 'development';
    app.enabled('view cache').should.be.false;
    process.env.NODE_ENV = 'test';
  })
})