//jshint esversion:6

// Modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

// Middlewares
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


// Mongoose set up
mongoose.connect("mongodb://localhost:27017/toDoListDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item cannot be empty."]
  },
});

const Item = mongoose.model("item", itemSchema);

// Global data
const item1 = new Item({
  name: "Welcome to the app!"
});

const item2 = new Item({
  name: "Hit the + button to add an item."
});

const item3 = new Item({
  name: "<---- Hit this to delete the item."
});

const defaultItems = [item1, item2, item3];

const listSchema = mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = mongoose.model("list", listSchema);

//Routing
app.get("/", function(req, res) {

  Item.find({}, function(err, items) {
    if (items.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Sucessfully added default items.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today",newListItems: items});
    }
  });
});

app.post("/", function(req, res) {

  const itemContent = req.body.newItem;
  const list = req.body.list;

  const newItem = new Item({
    name: itemContent
  });

  if(list === "Today"){
    newItem.save();
    res.redirect("/");
  } else{
    List.findOne({name:list},function(err,foundList){
      foundList.items.push(newItem);
      foundList.save();
    });

    res.redirect("/" + list);
  }

});

app.post("/delete", function(req, res) {
  const idToRemove = req.body.checkbox;
  const list = req.body.list;
  if(list === "Today"){

  Item.findByIdAndRemove(idToRemove, {
    useFindAndModify: false
  }, function(err) {
    if (err) {
      console.log(err);
    } else console.log("Deleted item.");
    });

    res.redirect("/");
  }else{
    List.findOneAndUpdate({name:list},
      {$pull: // we will pull
        {items: // from items
          {_id: idToRemove}}}, // items with this id
      {useFindAndModify:false},
      function(err,results){
        if(!err){
          res.redirect("/"+list);
        }
    });
  }
});

app.get("/:listType", function(req, res) {
  const customListName = _.capitalize(req.params.listType);

  List.findOne({ name: customListName }, function(err, list) {
    if (!err) {
      if (list) {
        res.render("list", { listTitle: customListName, newListItems: list.items });
      } else {
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName);
      }
    } else console.log(err);
  });

});

app.get("/info/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
