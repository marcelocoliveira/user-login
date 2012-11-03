var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , cryptographicService = require("../apis/cryptographicService.js")
  ;

var roleSchema = new Schema({ 
	name:'String',
	group: 'ObjectId'
});

// var exports = module.exports = mongoose.model('Role', roleSchema);

var UserSchema = new Schema({ 
	email: { type: String, required: true, index: { unique: true } }, 
	name: {
		first:{ type: String }, 
		last:{ type: String }
	},
	auth: { 
		hashed_password: {type: String },
		activationKey: { type: String }
	}, 
  // dob: { type: String },
  gender: { type: String, required: true, default: 'unknown', enum: ['unknown', 'male', 'female'] },
	active:{ type: Boolean, default: false },
	roles:[roleSchema]
});

/**
 * Virtuals
 */

/**
 * .id
 *
 * The documents _id property in hex string format
 *
 * @api public
 */
UserSchema
	.virtual('id')
	.get(function () {
	  return this._id.toHexString();
	});

/**
 * .name
 *
 * The full name of the user
 *
 * @api public
 */
UserSchema
	.virtual('fullname')
	.get(function () {
	  return this.name.first +" "+this.name.last;
	});

/**
 * .password
 *
 * Virtual property used to create and update cryptedPassword
 *
 * @api public
 */
UserSchema
	.virtual('password')
	.get(function () {
	  return this.auth.hashed_password;
	})
	.set(function (value) {
	  this._password = value;
	});

/**
 * Instance Methods
 */



/**
 * Pre Validate
 */
UserSchema.pre('validate', function (next) {
  var user = this;

  // only hash the password if it has been set
  if (!user._password) {
    next();
    return;
  };
  // Encrypt the password with bcrypt
  cryptographicService.cryptPassword(user._password, function(err, hash) {
    if (err) return next(err);
    user.auth.hashed_password = hash;
    next();
  });
});

module.exports = mongoose.model('User', UserSchema);