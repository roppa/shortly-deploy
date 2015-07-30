var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var Users = new db.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: String
});

Users.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

});

Users.methods.comparePassword = function (attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

Users.methods.hashPassword = function () {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    });
};

var User = db.model('User', Users);

module.exports = User;
