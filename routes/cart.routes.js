const express = require('express');

const router = express.Router();

const cartController = require('../controllers/cart.controllers');

router.get('/', cartController.getCart);

router.post('/items', cartController.addCartItem);

router.patch('/items', cartController.updateCartItem); // update cart item quantity

module.exports = router;