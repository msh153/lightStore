require('dotenv').config();
const mongoose = require("mongoose");

const drugSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
});

const Drug = mongoose.model('Drug', drugSchema);

module.exports = Drug;
