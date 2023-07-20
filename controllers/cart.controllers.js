const Product = require('../models/product.model');

async function getCart(req, res){
    res.render('customer/cart/cart');
}

async function addCartItem(req, res, next){
    let product;
    try{
        product = await Product.findById(req.body.productId);
    } catch(err){
        next(err);
        return;
    }
    const cart = res.locals.cart;
    cart.addItem(product);
    req.session.cart = cart;

    res.status(201).json({
        message: 'Item added to cart successfully!',
        newTotalItems: cart.totalQuantity,
        // newTotalPrice: cart.totalPrice
    });
}

function updateCartItem(req, res, next){
    const productId = req.body.productId;
    const newQuantity = +req.body.quantity;
    const cart = res.locals.cart;

    const updatedItemData = cart.updateItem(productId, newQuantity);

    req.session.cart = cart;

    res.status(200).json({
        message: 'Item updated successfully!',
        updateCartData: {
            newTotalQuantiy: cart.totalQuantity,
            newTotalPrice: cart.totalPrice,
            updatedItemPrice: updatedItemData.updatedItemPrice,
        },
    });
}

module.exports = {
    addCartItem: addCartItem,
    getCart: getCart,
    updateCartItem: updateCartItem
};