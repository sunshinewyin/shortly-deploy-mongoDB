var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/configMDB');

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
  db.LinkMDB.find(function(err, links) {
    if(err) return console.error(err);
    res.send(200, links);
    console.log(links);
  })
  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  db.LinkMDB
  .find({url: uri})
  .exec(function(err, links) {
    if(links.length > 0) {
      res.send(200, links[0]);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var newLink = new db.LinkMDB({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        db.LinkMDB.create(newLink,function(err, newLink) {
          if(err) console.log(err);
          else {
            res.send(200, newLink);
          }
        });
      });
    }
  });
  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.send(200, found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }

  //       var link = new Link({
  //         url: uri,
  //         title: title,
  //         base_url: req.headers.origin
  //       });

  //       link.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.send(200, newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var savedPassword = '';


  db.UserMDB
    .find({ username: username })
    .exec(function(err, user) {

      if (user.length === 0) {
        res.redirect('/login');
      } else {
        savedPassword = user[0].password;
      }

      bcrypt.compare(password, savedPassword, function(err, isMatch){
        if (err) {
          console.log(err);
        } else {
          if(isMatch) {
            util.createSession(req,res,user[0]);
          } else {
            res.redirect('/login');
          }
        }
      });
    });

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.UserMDB
    .find({ username: username })
    .exec(function(err, user) {
      console.log("UUUUUUUUUUUUUUUUUU ",user);
      if (user.length === 0) {

        bcrypt.genSalt(10, function(err, salt) {
          if(err) return err;

          bcrypt.hash(password, salt, null, function(err, hash){
            if (err) return err;

            var newUser = new db.UserMDB({
              username: username,
              password: hash
            });
            db.UserMDB.create(newUser, function(err, newUser) {
              if(err) console.log(err);
              else {
                util.createSession(req, res, newUser);
              }
            });
          })
        });

      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    })
};

exports.navToLink = function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.set({ visits: link.get('visits') + 1 })
        .save()
        .then(function() {
          return res.redirect(link.get('url'));
        });
    }
  });
};
