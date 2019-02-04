var db = require("../models");
var bcrypt = require("bcrypt-nodejs");

module.exports = function(app, passport) {
  // Load index page

  // app.get("*",function(req,res){
  //   var a = bcrypt.genSaltSync(3);
  //   var b = bcrypt.genSaltSync(10);
  //   var c = bcrypt.genSaltSync(16);
  //   var h1 = bcrypt.hashSync("password", a);
  //   var h2 = bcrypt.hashSync("password", b);
  //   var h3 = bcrypt.hashSync("password", c);
  //   console.log(`SALT: ${a} HASH: ${h1}`);
  //   console.log(`SALT: ${b} HASH: ${h2}`);
  //   console.log(`SALT: ${c} HASH: ${h3}`);
  //   console.log(bcrypt.compareSync(h1, h1));
  // });

  app.get("/", function(req, res) {
    if (req.isAuthenticated()) {
      res.render("index", { user: req.user });
    } else {
      res.render("index");
    }
  });

  app.get("/login", function(req, res) {
    console.log("authenticated: " + req.isAuthenticated());
    if (req.isAuthenticated() && req.user) {
      res.redirect("/");
    } else {
      res.render("index");
    }
  });

  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  app.post("/signup", function(req, res) {
    console.log("Sign up");

    var hash = bcrypt.hashSync(req.body.password);

    db.User.findOne({
      where: {
        username: req.body.username
      }
    }).then(function(userdb) {
      if (userdb) {
        console.log("username already taken");
        res.json();
      } else {
        console.log("CREATING");
        db.User.create({
          username: req.body.username,
          password: hash
        })
          .then(function(user) {
            req.user = user;
            console.log("created");
            res.json(user);
          })
          .catch(function(err) {
            console.log("err creating " + err);
          });
      }
    });
  });
  app.get("/logout", function(req, res) {
    req.session.destroy(function(err) {
      console.log(err);
      req.logout();
      res.clearCookie("sid");
      res.redirect("/");
    });
  });
  app.get("/profile", function(req, res) {
    if (req.user && req.isAuthenticated()) {
      res.render("profile", { user: req.user });
    } else {
      res.redirect("/");
    }
  });
  // Load User page and pass in an User by id
  app.get("/users/:id", function(req, res) {
    console.log("finding specific user");
    if (req.isAuthenticated()) {
      db.User.findOne({
        where: { id: req.params.id }
      }).then(function(dbUser) {
        db.Blog.findAll({
          where: { uid: dbUser.id }
        }).then(function(blogs) {
          res.render("profile", {
            user: dbUser,
            blogs: blogs
          });
        });
      });
    } else {
      res.redirect("/");
    }
  });
  app.get("/users", function(req, res) {
    if (req.isAuthenticated()) {
      db.User.findAll({}).then(function(users) {
        res.render("users", { user: req.user, users: users });
      });
    } else {
      res.redirect("/");
    }
  });
  app.get("/blogs", function(req, res) {
    if (req.isAuthenticated()) {
      db.Blog.findAll({}).then(function(blogs) {
        res.render("blogs", { user: req.user, blogs: blogs });
      });
    } else {
      res.redirect("/");
    }
  });
  app.get("/blogs/:id", function(req, res) {
    db.Blog.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(blog) {
      db.User.findOne({
        where: {
          id: blog.uid
        }
      }).then(function(user) {
        res.render("blog", { user: req.user, blog: blog, author: user });
      });
    });
  });
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
