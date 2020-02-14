// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//set up middlewares
app.set('view engine', 'ejs');
app.use(bodyParser.encodedurl({encoded:true}));

//routing
app.get("/", function(req,res){
  res.send("hello");
});

app.listen(3000,function(){
  console.log("Server started on port 3000");
});
