const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Products = require('../models/products');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                order: result.map(data => {
                    return {
                        id: data._id,
                        product: data.product,
                        quantity: data.quantity
                    }
                })
            })
        })
        .catch(err =>
            console.log(err)
        );
});

router.post('/', (req, res, next) => {
    Products.findById(req.body.productId)
    .then(product=>{
        if(!product){
return res.status(404).json({
    message:"Product not found"
});
        }else{
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        }
       
    })
    .then(result => {
        console.log(result);
        res.status(200).json({
            message:"Order stored successfully",
            createdOrder:{
                id:result._id,
                product:result.product,
                quantity:result.quantity
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            message: "Product not found",
            error:err
        });
    });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    Order.findById(id)
    .exec()
    .then(result=>{
        if (result){
            res.status(200).json({
                message: 'Order detail',
                searchedOrder:{
                id: id,
                product:result.product,
                quantity:result.quantity
                }
            });
        }else{
            res.status(404).json({
                message: 'Order detail not available',
            });
        }
       
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
    /*if (id === '123') {
        res.status(200).json({
            message: 'Order detail',
            id: id,
            product:res.product,
            quantity:res.quantity
        });
    } else {
        res.status(200).json({
            message: 'Order id missed',
        });
    }*/

});
router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    Order.deleteOne({ _id: id })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message:'Order deleted successfully'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
module.exports = router;