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
    console.log("GETTING " + req.session.id);
    res.render("index", { user: req.user });
  });

  app.get("/login", function(req, res) {
    console.log("authenticated: " + req.isAuthenticated());
    if (req.isAuthenticated() && req.user) {
      res.redirect("/");
    } else {
      res.render("login");
    }
  });

  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  app.get("/signup", function(req, res) {
    if (req.isAuthenticated() && req.user) {
      res.redirect("/");
    } else {
      res.render("signup");
    }
  });

  app.post("/signup", function(req, res) {
    console.log("Sign up");
    console.log("hashed");
    var hash = bcrypt.hashSync(req.body.password);
    console.log(hash);
    db.User.findOne({
      where: {
        id: req.body.id,
        username: req.body.username
      }
    }).then(function(userdb) {
      if (userdb) {
        console.log("username already taken");
        res.redirect("signup");
      } else {
        console.log("CREATING");
        db.User.create({
          username: req.body.username,
          password: hash
        })
          .then(function(user) {
            req.user = user;
            console.log("created");
            res.redirect("login");
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
      res.redirect("login");
    }
  });
  // Load User page and pass in an User by id
  app.get("/users/:id", function(req, res) {
    console.log("finding specific user");
    db.User.findOne({
      where: { id: req.params.id }
    }).then(function(dbUser) {
      res.render("profile", {
        user: dbUser
      });
    });
  });
  app.get("/users", function(req, res) {
    db.User.findAll({}).then(function(users) {
      res.render("users", { users: users });
    });
  });
  app.get("/blogs", function(req, res) {
    db.Blog.findAll({}).then(function(blogs) {
      res.render("blogs", { blogs: blogs });
    });
  });
  app.get("/blogs/:id", function(req, res) {
    db.Blog.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(blog) {
      res.render("blog", { blog: blog });
    });
  });
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    console.log("*", req.path);
    res.render("404");
  });
};
