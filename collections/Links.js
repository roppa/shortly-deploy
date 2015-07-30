var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

Links = new Schema({
  visits : { type : Number, default : 0 },
  code: String,
  url: String,
  base_url: String,
  createdDate: { type: Date, default: Date.now }
});

Links.pre('save', true, function (next, done) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
  done();
});

module.exports = Links;