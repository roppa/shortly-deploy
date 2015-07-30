var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var db = require('../app/config');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  db.Link.find({}, function (err, links) {
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new db.Link({ url: uri, base_url: req.headers.origin })
    .save(function(err, link) {
      if (err) {
        return res.send(404);
      }
      return res.send(200, link);
    });

};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  // fetch user and test password verification
  db.User.findOne({ username: username }, function(err, user) {
    if (err) {
      return res.send(404);
    }
    if (!user) {
      new db.User({ username : username, password : password })
        .save(function(err) {
          if (err) {
            console.log(err);
            return res.send(404);
          }
          util.createSession(req, res, this);
        });
    } else {
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          return res.redirect('/login');
        }
        if (isMatch) {
          util.createSession(req, res, user);
        } else {
          return res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {

  var username = req.body.username;
  var password = req.body.password;

  db.User.findOne({ username : username }, function(err, user) {
    if (err) throw err;
    if (user) {
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          console.log(err);
          return res.redirect('/login');
        }
        if (isMatch) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    } else{
      new db.User({ username : username, password : password })
        .save(function(err, user) {
          if (err) {
            console.log(err);
            return res.redirect('/login');
          }
          util.createSession(req, res, user);
        });
    }
  });
};

exports.navToLink = function(req, res) {
  db.Link.findOne({ code: req.params[0] }, function (err, link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      link.save(function(err) {
        if (err) {
          console.log(err);
        }
        return res.redirect(link.get('url'));
      });
    }
  });
};