// jshint esversion:6

//modules
const express = require("express");
const bodyParser = require("body-parser");

//custom module
const date = require(__dirname + "/date.js");

//set up middlewares
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//variables
//const arrays can still be pushed
const items = [];
const workItems = [];

//routing
app.get("/", function(req,res){
  let day = date.getDate();

  res.render("list",{listTitle:day, newListItems:items});
});

app.post("/",function(req,res){

  if(req.body.list == "Work"){
    workItems.push(req.body.newItem);
    res.redirect("/work");
  }else{
    items.push(req.body.newItem);
    res.redirect("/");
  }

});

app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work", newListItems: workItems});
});

app.get("/about",function(req,res){
  res.render("about");
});

app.listen(3000,function(){
  console.log("Server started on port 3000");
});
