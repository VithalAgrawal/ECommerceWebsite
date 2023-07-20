const Product = require('../models/product.model');


async function getAllProducts(req, res, next){
    let products;
    try{
        products = await Product.findAll();
        res.render('customer/products/all-products', {products: products});
    } catch(err){
        next(err);
    }
}

async function getProductDetails(req, res, next){
    let product;
    try{
        product = await Product.findById(req.params.id);
        res.render('customer/products/product-details', {product: product});
    } catch(err){
        next(err);
    }
}

module.exports = {
    getAllProducts: getAllProducts,
    getProductDetails: getProductDetails,
};