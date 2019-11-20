//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "In this blog, I will be documenting my journey in the producing field, and sharing some content or music that i really like.";
const aboutContent = "I am a Hip-Hop / Trap producer and DJ. In my free time, I love to explore sounds and music, and most importantly, to integrate what I have found or what I have created to produce a song. I have a passion in producing my ideas and creations, and my goal is to show the world how I feel through music.";
const contactContent = "If you want to work with me, or ask me any questions related to music, I will be more than happy to answer you. Contact me via the links down below.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-glen:test123@cluster0-cuzuo.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {startingContent: homeStartingContent, newPosts: posts});
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutStartingContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactStartingContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});


app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.newPostTitle,
    content: req.body.newPostBody
  });

  post.save(function(err){
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });

  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully!!");
});
