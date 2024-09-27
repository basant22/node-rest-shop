const { query } = require('express');
const Products = require('../models/newproducts');
const mongoose = require('mongoose');

exports.newproducts_get_all = async (req, res, next) => {
    const { company, name, feature, sort , select} = req.query;
    const queryObjects = {};
    if (company) {
        queryObjects.company = company;
    }
    if (feature) {
        queryObjects.feature = feature;
    }
    if (name) {
        queryObjects.name = { $regex: name, $options: 'i' };
    }
    let product = Products.find(queryObjects);
    if (sort) {
        let sortParam = sort.split(",").join(" ");
        product = product.sort(sortParam)
    }
    if (select) {
        let selectParam = select.split(",").join(" ");
        product = product.select(selectParam)
    }
    let page = Number(req.query.page) || 1;
    let limit  = Number(req.query.limit) || 3;
    let skip = (page - 1)*limit;
    product = product.skip(skip).limit(limit);
    console.log(queryObjects);

    const Data = await product;
    res.status(200).json({
        "Data": Data,
        "message": "Product get succesfully",
        "error": false
    });
}