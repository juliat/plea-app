// server.js
// a very simple node server using the express module
var express = require("express");
var app = express();
var subdir = "/www";
app.use("/", express.static(__dirname + subdir));
app.get("/", function(req, res) { res.render("subdir + "/" + chart.html");});
app.listen(8080);
