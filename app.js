const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
const mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/wikidb';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req,res){
  //console.log(req.params);
  Article.find(function(err, articles){
    console.log(articles);
    if(articles.length > 0){
      const jsonArticles = JSON.stringify(articles);
      res.send(jsonArticles);
    }
    else{
      res.send("no article found in wikidb");
    }
  });
})

.post(function(req,res){
  const jsonObj = req.body;
  Article.create(jsonObj, function(err) {
    if(!err){
      res.send('article created successfully!');
    }
    else{
      //console.log("Error is" + err);
      res.send(err);
    }

  });

})

.delete(function(req,res){

  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all the articles in wikiDB.");
    } else {
      res.send(err);
    }
  });

});

//-------------------Specific Article--------------------

app.route("/articles/:articleId")
.get(function(req,res){
  const id = req.params.articleId;
  console.log(id);
  Article.findOne({_id: id}, function(err,article){
    console.log(article);
    if(!err){
      const jsonArticle = JSON.stringify(article);
      res.send(jsonArticle);
    }
    else{
      res.send("article not found in wikidb");
    }
  })
})

.put(function(req,res){
  const id = req.params.articleId;
  console.log("id ", id);
  console.log("title ", req.query.title);
  console.log("content ",req.body.content);
  Article.updateOne(
    {_id: id},
    {
      title: req.query.title,
      content: req.body.content,
      overwrite: true
    },
  function(err){
    if (!err){
      res.send("article updated successfully");
    }
    else{
      res.send(err);
    }
  })
})
.patch()
.delete(function(req,res){
  const id = req.params.articleId;
  console.log("id ", id);
  Article.deleteOne({_id: id}, function(err) {
    console.log(err);
    if (!err){
      res.send("article deleted successfully");
    }
    else {
      res.send(err);
    }
    // console.log(res);
  })
});


app.listen(port, function() {
  console.log("Server has started on port " + port);
});
