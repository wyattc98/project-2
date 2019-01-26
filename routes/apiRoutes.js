var db = require("../models");

//, passport(function param taken out of module.exports)

module.exports = function(app) {
  // Get all Blogs
  app.get("/api/Blogs", function(req, res) {
    if (req.isAuthenticated()) {
      db.Blog.findAll({
        where: {
          uid: req.user.id
        }
      }).then(function(dbBlogs) {
        res.json(dbBlogs);
      });
    } else {
      res.redirect("/");
    }
  });

  //Get route for a single post
  app.get("/api/Blogs/:id", function(req, res) {
    db.Blog.findOne({
      where: {
        uid: req.user.id,
        id: req.params.id
      },
      include: [db.User]
    }).then(function(dbBlog) {
      res.json(dbBlog);
    });
  });

  // Create a new Blog
  app.post("/api/Blogs", function(req, res) {
    if (req.user && req.isAuthenticated() && req.session) {
      var newBlog = {
        title: req.body.title,
        text: req.body.text,
        uid: req.user.id
      };
      db.Blog.create(newBlog).then(function(dbBlog) {
        res.json(dbBlog);
      });
    } else {
      console.log("unauthorized attempt");
      res.end();
    }
  });

  // Delete an Blog by id
  app.delete("/api/Blogs/:id", function(req, res) {
    if (req.user && req.isAuthenticated() && req.session) {
      db.Blog.destroy({ where: { id: req.params.id } }).then(function(dbBlog) {
        res.json(dbBlog);
      });
    } else {
      console.log("unauthorized attempt to destroy blog");
      res.redirect("/");
    }
  });

  //PUT route for updating posts
  app.put("/api/Blogs", function(req, res) {
    db.Blog.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(function(dbBlog) {
      res.json(dbBlog);
    });
  });
};
