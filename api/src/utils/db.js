const dotenv = require("dotenv");  //require dotenv package
dotenv.config(); 

const mongoose = require("mongoose");

const { db_url } = require("..");

console.log(db_url);
mongoose.connect(db_url)

module.exports = mongoose.connection
