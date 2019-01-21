var db = require("../models");

module.exports = function(app, passport) {
  // Load index page
  app.get("/", function(req, res) {
    if (req.user) {
      res.render("index", { user: req.user });
    } else {
      res.render("index");
    }
  });

  app.get("/login", function(req, res) {
    res.render("login");
  });

  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  app.get("/signup", function(req, res) {
    res.render("signup");
  });
  app.post("/signup", function(req, res) {
    console.log(req);
    db.User.create({
      username: req.body.username,
      password: req.body.password
    })
      .then(function(user) {
        console.log("created");
        res.render("profile", { user: user });
      })
      .catch(function(err) {
        console.log("err creating " + err);
      });
  });
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Load User page and pass in an User by id
  app.get("/User/:id", function(req, res) {
    db.User.findOne({ where: { id: req.params.id } }).then(function(dbUser) {
      res.render("User", {
        User: dbUser
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
