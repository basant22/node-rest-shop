require('dotenv').config();

const NewProduct = require('./api/models/newproducts');
const mongoose = require('mongoose');
const ProductJson = require('./products.json');
mongoose.connect(process.env.MONGODB_URL);
const start = async() => {
try{

   await NewProduct.create(ProductJson);
   console.log("success");
   
}catch (error){
   console.log();
    
}
};
start();