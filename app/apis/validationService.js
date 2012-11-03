exports.validator = function (){
	var Validator = require('validator').Validator;

	Validator.prototype.error = function (msg) {
	    this._errors.push(msg);
	    return this;
	}

	Validator.prototype.getErrors = function () {
		var errors = this._errors;
		this._errors = [];
	  return errors;
	}

	var validator = new Validator();	
	return validator;
}
