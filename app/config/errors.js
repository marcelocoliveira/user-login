var errors = {
  'BadRequest': {
    'name': 'Bad Request',
    'status': 400
  },
  'Unauthorized': {
    'name': 'Unauthorized',
    'status': 401
  },
  'Forbidden' : {
    'name': 'Forbidden',
    'status': 403
  },
  'NotFound': {
    'name': 'Not Found',
    'status': 404
  },
  'Conflict': {
    'name': 'Conflict',
    'status': 409
  },
  'InternalServerError': {
    'name': 'Internal Server Error',
    'status': 500
  }
}

var defineError = function (options) {

  var fn = function (msg) {
    msg = msg || options.msg;
    var self = new Error(msg);
    self.type = options.type;
    self.name = options.name;
    self.status = options.status;
    self.__proto__ = fn.prototype;
    return self;
  }
  fn.prototype.__proto__ = Error.prototype;

  // // add error type to the exports
  exports[options.type] = fn;

};

/**
 * Load errors 
 */
exports.loadErrors = function(){
	for (var error in errors) {
	  defineError({
	    type: error,
	    name: errors[error].name,
	    status: errors[error].status,
      msg: errors[error].name
	  });
	}
};