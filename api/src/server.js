const express = require("express");
const bodyParser = require('body-parser')
const connection = require("./utils/db.js");
const { User } = require("./models/user");
const Shop = require('./models/shop');
const Drug = require('./models/drug');
const { port, host } = require("./index.js");
require('dotenv').config();
const mongoose = require("mongoose");

const app = express();
const cors = require("cors");
app.use(cors());

const DataInitialization = mongoose.model('DataInitialization',  new mongoose.Schema({
    initialized: Boolean
  }));

const drugsData = [
    { name: 'Paracetamol', price: 5, image: 'paracetamol.jpg' },
    { name: 'Aspirin', price: 3, image: 'aspirin.jpg' },
    { name: 'Ibuprofen', price: 7, image: 'ibuprofen.jpg' },
    { name: 'Cough Syrup', price: 8, image: 'cough_syrup.jpg' },
    { name: 'Antibiotics', price: 15, image: 'antibiotics.jpg' }
];

app.get('/', (req,res) => {
    res.send("Server is working correctly")
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/addUser', async (req,res) => {
    try{
        const user = new User({name: req.body.userName, age: req.body.userAge});
        await user.save();
    } catch(e){
        res.send(e.message);
    }    
});

app.post('/deleteUser', async (req,res) => {
    try{
        await User.deleteOne({ _id: req.body._id });
    } catch(e){
        res.send(e.message);
    }    
});

app.use(async (req, res, next) => {
    try {
      const dataInitialization = await DataInitialization.findOne();
  
    if (!dataInitialization || !dataInitialization.initialized) {
        const drugsCount = await Drug.countDocuments();
        const shopsCount = await Shop.countDocuments();

        if (drugsCount === 0 && shopsCount === 0) {
        // Create drugs
        const drugs = await Drug.insertMany(drugsData);

        const shop = new Shop({
            name: 'Shop A',
            products: drugs.map(drug => drug._id)
        });

        // Save shop
        await shop.save();

        // Create shop 2
        const shop2 = new Shop({
            name: 'Shop B',
            products: [drugs[0]._id, drugs[2]._id]
        });
        await shop2.save();
    
        // Set data initialization flag to true
        if (!dataInitialization) {
            await DataInitialization.create({ initialized: true });
        } else {
            await DataInitialization.updateOne({}, { initialized: true });
        }
        }
      }
      next();
    } catch (error) {
      res.status(500).send(error.message);
    }
});
  
app.get('/getDrugs', async (req, res) => {
    try {
      const shopId = req.query.shopvalue;
      let drugs;
      if (shopId) {
        // Find the shop by ID
        const shop = await Shop.findById(shopId);
        if (!shop) {
          return res.status(404).json({ message: 'Shop not found' });
        }
  
        // Retrieve drugs available in the shop
        drugs = await Drug.find({ _id: { $in: shop.products } });
      } else {
        // If no shop ID is provided, return all drugs
        drugs = await Drug.find();
      }
  
      res.json(drugs);
    } catch (e) {
      res.status(500).send(e.message);
    }
});

app.get('/getShopIds', async (req, res) => {
    try {
        //const shopIds = await Shop.find().select('name _id');
        const shopIds = await Shop.find().distinct('_id');
        res.json(shopIds);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', startServer);

function startServer() {
    app.listen(port, () =>{
        console.log("Running on http://%s:%s", host, port)
    })
}
