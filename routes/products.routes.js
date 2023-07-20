const express = require('express');

const productsController = require('../controllers/products.controllers');

const router = express.Router();

router.get('/products', productsController.getAllProducts);

router.get('/products/:id', productsController.getProductDetails);

module.exports = router;