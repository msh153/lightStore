require('dotenv').config();
const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: String,
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drug'
    }]
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
