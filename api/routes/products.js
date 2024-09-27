const express = require('express');
const router = express.Router();
const Products = require('../models/products');
const mongoose = require('mongoose');
const multer = require('multer');
const authCheck = require('../middleware/auth-check');
const ProductController = require('../controller/product');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
//const upload = multer({dest:'uploads/'});
const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 5 } });
router.get('/', ProductController.products_get_all);

router.post('/', authCheck, upload.single('productImage'), ProductController.products_create_post);

router.get('/:productId', ProductController.product_get_by_productId);

router.patch('/:productId', authCheck, ProductController.product_patch_productId);

router.delete('/:productId', authCheck, ProductController.product_delete_byId);

module.exports = router;