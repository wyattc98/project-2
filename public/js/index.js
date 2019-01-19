// Get references to page elements
var $blogText = $("#blog-text");
var $blogDescription = $("#blog-description");
var $submitBtn = $("#submit");
var $blogList = $("#blog-list");

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
  }
};

// refreshBlogs gets new Blogs from the db and repopulates the list
var refreshBlogs = function() {
  API.getBlogs().then(function(data) {
    var $blogs = data.map(function(blog) {
      var $a = $("<a>")
        .text(blog.text)
        .attr("href", "/blog/" + blog.id);

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
  });
};

// handleFormSubmit is called whenever we submit a new blog
// Save the new blog to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var blog = {
    title: $blogText.val().trim(),
    text: $blogDescription.val().trim()
  };

  if (!(blog.title && blog.text)) {
    alert("You must enter an blog text and description!");
    return;
  }

  API.saveBlog(blog).then(function() {
    refreshBlogs();
  });

  $blogText.val("");
  $blogDescription.val("");
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

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$blogList.on("click", ".delete", handleDeleteBtnClick);
