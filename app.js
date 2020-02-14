// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//set up middlewares
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//variables
let items = [];
let workItems = [];

//routing
app.get("/", function(req,res){
  let options = {
    weekday:'long',
    day:'numeric',
    month:'long'};
  let date = new Date().toLocaleDateString("en-AU", options);

  res.render("list",{listTitle:date, newListItems:items});
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
