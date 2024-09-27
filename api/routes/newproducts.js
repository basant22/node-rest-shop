const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const NewProductController = require('../controller/newproducts') ;

router.get('/',NewProductController.newproducts_get_all);
module.exports = router;