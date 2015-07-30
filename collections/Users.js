var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Users = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: String
});

Users.pre('save', true, function (next, done) {

  if (!this.isModified('password')) {
    next();
    done();
  }

  bcrypt.hash(this.password, null, null, function(err, hash) {
      if (err) {
        next(err);
        return done();
      }
      this.password = hash;
      next();
      done();
    }.bind(this));

});

Users.methods.comparePassword = function (attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(err, isMatch);
  });
};

module.exports = Users;