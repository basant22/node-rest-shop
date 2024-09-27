const Products = require('../models/products');
const mongoose = require('mongoose');
const multer = require('multer');
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
const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 5 } });

exports.products_get_all = (req, res, next) => {
    Products.find()
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log(doc);
            const response = {
                count: doc.length,
                products: doc.map(data => {
                    return {
                        id: data._id,
                        name: data.name,
                        price: data.price,
                        productImage: data.productImage,
                        request: {
                            type: "Get Request",
                            url: 'http://localhost:3000/products/' + data._id
                        }
                    }
                })
            }
            if (doc.length > 0) {
                res.status(200).json(response);
            } else {
                res.status(200).json({
                    message: 'No entry found'
                });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
}
exports.products_create_post = (req, res, next) => {
    // upload.single('productImage'),
    console.log("file=", req.file.path);
    const product = new Products({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                id: result._id,
                name: result.name,
                price: result.price,
                productImage: req.file.path,
                request: {
                    type: "Get Request",
                    url: 'http://localhost:3000/products/' + result._id
                }
            });
        })
        .catch(err => console.log(err));
}
exports.product_get_by_productId = (req, res, next) => {
    const id = req.params.productId
    Products.findById(id)
        .select('_id name price productImage')
        .exec()
        .then(doc => {
            console.log('from the db', doc);
            if (doc) {
                const myProd = {
                    id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage
                }
                res.status(200).json({
                    product: myProd,
                    request: {
                        type: "Get Request",
                        url: 'http://localhost:3000/products/'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'no valid entry founded for provided Id'
                });
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });
}
exports.product_patch_productId = (req, res, next) => {
    const id = req.params.productId;

    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Products.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.product_delete_byId = (req, res, next) => {
    const id = req.params.productId
    Products.deleteOne({ _id: id })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product deleted successfully'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}