var path = require('path');
var mongoose = require('mongoose');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var connectionString;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var db;

if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI;
} else {
  connectionString = "mongodb://localhost/shortly";
}

mongoose.connect(connectionString);

db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  console.log("Connected to database");
});

/****************************************************************
* Schemas
****************************************************************/

/* Users */

db.Users = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: String
});

db.Users.pre('save', true, function (next, done) {

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

db.Users.methods.comparePassword = function (attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(err, isMatch);
  });
};

/* Links */

db.Links = new Schema({
  visits : { type : Number, default : 0 },
  code: String,
  url: String,
  base_url: String,
  createdDate: { type: Date, default: Date.now }
});

db.Links.pre('save', true, function (next, done) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
  done();
});

/****************************************************************
* Models
****************************************************************/

db.User = db.model('User', db.Users);
db.Link = db.model('Link', db.Links);

module.exports = db;