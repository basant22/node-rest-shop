const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const Order = require('../models/order');
//const Products = require('../models/products');
const authCheck = require('../middleware/auth-check');

const OrderController = require('../controller/order') ;

router.get('/', authCheck,OrderController.order_get_all);

router.post('/', authCheck, OrderController.order_create);

router.get('/:orderId', authCheck,OrderController.order_by_Id );

router.delete('/:orderId', authCheck, OrderController.order_delete);

module.exports = router;