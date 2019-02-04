var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt-nodejs");
var db = require("../models");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(function(username, password, done) {
      db.User.findOne({
        where: {
          username: username
        }
      })
        .then(function(user) {
          console.log("logging in...");
          if (user) {
            console.log("user found");
            if (bcrypt.compareSync(password, user.password)) {
              console.log("password matches");
              done(null, user);
            } else {
              console.log("password does not match.");
              done(null, null);
            }
          } else {
            console.log("no user found");
            done(null, null);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    })
  );

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize User into and deserialize User out of the session.  The
  // typical implementation of this is as simple as supplying the user ID when
  // serializing, and querying the user record by ID from the database when
  // deserializing.
  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    db.User.findOne({
      where: {
        id: id
      }
    })
      .then(function(user) {
        cb(null, user);
      })
      .catch(function(err) {
        console.log(err);
      });
  });
};
