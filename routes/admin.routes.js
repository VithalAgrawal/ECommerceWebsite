
const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin.controllers');
const imageUploadMiddleware = require('../middlewares/image-upload');

router.get('/products', adminController.getProducts); // /admin/products

router.get('/products/new', adminController.getNewProduct); // /admin/products/new

router.post('/products', imageUploadMiddleware, adminController.createNewProduct); // /admin/products/new

router.get('/products/:id', adminController.getUpdateProduct); 

router.post('/products/:id', imageUploadMiddleware, adminController.updateProduct);

// router.post('/products/:id/delete', adminController.deleteProduct);

router.delete('/products/:id', adminController.deleteProduct);

router.get('/orders', adminController.getOrders);

router.patch('/orders/:id', adminController.updateOrder);

module.exports = router;