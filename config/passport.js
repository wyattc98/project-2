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
          if (!user || !bcrypt.compareSync(password, user.password)) {
            console.log(user);
            console.log("uh oh no user or bad pass");
            return done(null, false, {
              message: "Incorrect username or password."
            });
          } else {
            console.log("EXPECTED");
            db.Blog.findAll({
              where: {
                uid: user.id
              }
            })
              .then(function(blogs) {
                user.blogs = blogs;
                return done(null, user);
              })
              .catch(function(err) {
                console.log("trouble getting blogs");
                console.log(err);
                return done(null, user);
              });
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
    console.log("DESERIALIZING");
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
