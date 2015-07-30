var path = require('path');
var mongoose = require('mongoose');
var path = require('path');

var connectionString;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Users = require(__dirname + '/../collections/Users');
var Links = require(__dirname + '/../collections/Links');

if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI;
} else {
  connectionString = "mongodb://localhost/shortly";
}

mongoose.connect(connectionString);

db = mongoose.connection;

db.Users = Users;
db.Links = Links;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  console.log("Connected to database");
});

/****************************************************************
* Models
****************************************************************/

db.User = db.model('User', db.Users);
db.Link = db.model('Link', db.Links);

module.exports = db;