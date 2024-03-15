require('dotenv').config();
const mongoose = require("mongoose");

const userScheme = {
    name: String,
    age: Number
};

const User = mongoose.model('User', userScheme);

module.exports.User = User;
