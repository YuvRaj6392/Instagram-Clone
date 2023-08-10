//mongoose helps in communication with the database
const mongoose = require("mongoose");
const db = {};
db.mongoose = mongoose;
db.url = require("../dbConfig/dbConfig").url;
db.users = require("./user.model")(mongoose);
db.posts= require("./post.model")(mongoose);
module.exports = db;
