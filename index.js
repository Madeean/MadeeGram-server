const express = require("express");
var path = require("path");
var cors = require("cors");
const multer = require("multer");
const os = require("os");
const fs = require("fs");
var cookieParser = require("cookie-parser");
const Db = require("./database/db");
const bodyParser = require("body-parser");


var authenticationRoute = require("./app/authentication/authenticationRoute")
var postRoute = require("./app/post/postRoute")

const app = express();
app.use(cors());

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.json({
    limit: "500mb",
  })
);

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(express.json())


app.use("/",authenticationRoute)
app.use('/post',postRoute)

module.exports = app;
