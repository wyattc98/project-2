// Get references to page elements
var $blogTitle = $("#blog-title");
var $blogContent = $("#blog-content");
var $submitBtn = $("#submit");
var $blogList = $("#blog-list");

var loginUsername = $("#loginUsername");
var loginPassword = $("#loginPassword");

var createUsername = $("#createUsername");
var createPassword = $("#createPassword");
var createPassword2 = $("#createPassword2");

var signUpBtn = $("#createSubmit");
var loginBtn = $("#loginSubmit");

// The API object contains methods for each kind of request we'll make
var API = {
  saveBlog: function(blog) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/blogs",
      data: JSON.stringify(blog)
    });
  },
  getBlogs: function() {
    return $.ajax({
      url: "api/blogs",
      type: "GET"
    });
  },
  deleteBlog: function(id) {
    return $.ajax({
      url: "api/blogs/" + id,
      type: "DELETE"
    });
  },
  signUp: function(user) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/signup",
      data: JSON.stringify(user)
    });
  },
  logIn: function(user) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/login",
      data: JSON.stringify(user)
    });
  }
};

// refreshBlogs gets new Blogs from the db and repopulates the list
var refreshBlogs = function() {
  API.getBlogs().then(function(data) {
    console.log(typeof data);

    if (typeof data === "object") {
      var $blogs = data.map(function(blog) {
        var $a = $("<a>")
          .text(blog.title)
          .attr("href", "/blogs/" + blog.id);
        var $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": blog.id
          })
          .append($a);

        var $button = $("<button>")
          .addClass("btn btn-danger float-right delete")
          .text("ｘ");

        $li.append($button);

        return $li;
      });
      $blogList.empty();
      $blogList.append($blogs);
    }
  });
};

// handleFormSubmit is called whenever we submit a new blog
// Save the new blog to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var blog = {
    title: $blogTitle.val().trim(),
    text: $blogContent.val().trim()
  };

  if (!(blog.title && blog.text)) {
    alert("You must enter an blog title and text!");
    return;
  }

  API.saveBlog(blog).then(function() {
    refreshBlogs();
  });

  $blogTitle.val("");
  $blogContent.val("");
};

// handleDeleteBtnClick is called when an blog's delete button is clicked
// Remove the blog from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteBlog(idToDelete).then(function() {
    refreshBlogs();
  });
};

var handleSignUpSubmit = function(e) {
  e.preventDefault();

  if (createPassword.val().trim() !== createPassword2.val().trim()) {
    alert("Passwords do not match!");
    return;
  }

  var user = {
    username: createUsername.val().trim(),
    password: createPassword.val().trim()
  };

  if (!(user.username && user.password)) {
    alert("You must enter a username and password!");
    return;
  }

  API.signUp(user)
    .then(function(user2) {
      console.log(user2);
      if (user2) {
        console.log("signed up");
        console.log(user);
        loginUsername.val(user.username);
        loginPassword.val(user.password);
        handleLoginSubmit(e);
      } else {
        alert("Username already taken");
      }
    })
    .catch(function() {
      alert("Username already taken");
    });
};

var handleLoginSubmit = function(e) {
  e.preventDefault();

  var user = {
    username: loginUsername.val().trim(),
    password: loginPassword.val().trim()
  };

  if (!(user.username && user.password)) {
    alert("You must enter a username and password!");
    return;
  }
  API.logIn(user)
    .then(function() {
      console.log("logged in!");
      window.location.reload(true);
    })
    .catch(function(err) {
      alert("Error logging in. " + err);
    });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$blogList.on("click", ".delete", handleDeleteBtnClick);
signUpBtn.on("click", handleSignUpSubmit);
loginBtn.on("click", handleLoginSubmit);
refreshBlogs();
