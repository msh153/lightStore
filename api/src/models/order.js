require('dotenv').config();
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  products: {
    type: Object,
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
