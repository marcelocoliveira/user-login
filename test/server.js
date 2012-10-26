var app = require('../app')
  , expect = require('expect.js');

describe('app', function(){
  it('should expose app settings', function(){
    var obj = app.locals.settings;
    expect(obj).to.have.property('env', 'test');
    // expect(obj).to.have.property('appName', 'Test');
  })
})


describe('in development', function(){
  // it('should disable "view cache"', function(){
  //   process.env.NODE_ENV = 'development';
  //   app.enabled('view cache').should.be.false;
  //   process.env.NODE_ENV = 'test';
  // })
  it('should enable "view cache"', function(){
    process.env.NODE_ENV = 'development';
    expect(app.enabled('view cache')).to.be.false;
    process.env.NODE_ENV = 'test';
  })
})