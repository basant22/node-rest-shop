const express = require("express");
const app = express();
const morgan = require('morgan');
const productRoute = require('./api/routes/products');
const orderRoute = require('./api/routes/order');
const userRoute = require('./api/routes/user');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//mongoose.connect('mongodb+srv://gauravupadhyaybui:'+ process.env.MONGO_ATLAS_PW+'@node-shop.kdr4l.mongodb.net/?retryWrites=true&w=majority&appName=Node-Shop',{
useMongoClient: true
//});
mongoose.connect('mongodb+srv://gauravupadhyaybui:MNPpBlGre0ixGEzk@node-shop.kdr4l.mongodb.net/?retryWrites=true&w=majority&appName=Node-Shop');
//Routes which handel service here below
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header",
        "Origin , X-Requested-Width, Content-Type, Accept,Authorization");
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Method', 'GET,POST,PATCH,DELETE,PUT');
        return res.status(200).json({});
    }
    next();
});
app.use('/products', productRoute);
app.use('/order', orderRoute);
app.use('/user', userRoute);
app.use('/uploads',express.static('uploads'));
app.use((req, res, next) => {
    const error = new Error("Not Found");
    //  error.status(404);
    error.status = 404;
    next(error);
});
mongoose.Promise = global.Promise;
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;