const stripe = require('stripe')('sk_test_51NEll0SFBDNLBhOnya6wMHpdsB7ZvMOTXAOAyr9kaw7p3kgU0Q7kJHnFHr0PjNpMxEQd5d0jRrWUrTdCO3hG7Z4K00GM22UhvB');

const session = require('express-session');
//Alternative way to import stripe:
// const stripe = require('stripe');
// const stripeObj = stripe('sk_test_51NEll0SFBDNLBhOnya6wMHpdsB7ZvMOTXAOAyr9kaw7p3kgU0Q7kJHnFHr0PjNpMxEQd5d0jRrWUrTdCO3hG7Z4K00GM22UhvB');

const Order = require('../models/order.model');
const User = require('../models/user.model');



async function getOrders(req, res) {
    try {
        const orders = await Order.findAllForUser(res.locals.uid);
        res.render('customer/orders/all-orders', {
            orders: orders,
        });
    } catch (error) {
        next(error);
    }
}

async function addOrder(req, res, next) {
    const cart = res.locals.cart;

    let userDocument;
    try {
        userDocument = await User.findById(res.locals.uid);
    } catch (error) {
        return next(error);
    }

    const session = await stripe.checkout.sessions.create({
        line_items: cart.items.map(function(item){
            return {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price_data:{
                    currency: 'INR',
                    product_data: {
                        name: item.product.title,
                    },
                    unit_amount_decimal: +item.product.price.toFixed(2) * 100,
                },
                quantity: item.quantity,
              }
        }),
        mode: 'payment',
        success_url: `http://localhost:3000/orders/success`,
        cancel_url: `http://localhost:3000/orders/failure`,
      });
      res.redirect(303, session.url);


    // res.redirect('/orders');
}

async function getSuccess(req, res, next){
    const cart = res.locals.cart;

    let userDocument;
    try {
        userDocument = await User.findById(res.locals.uid);
    } catch (error) {
        return next(error);
    }

    const order = new Order(cart, userDocument);

    try {
        await order.save();
    } catch (error) {
        return next(error);
    }

    // console.log(req.session);
    
    //set locals cart to null
    res.locals.cart.totalQuantity = 0;
    req.session.cart = null; //clearing/resetting the cart after placing order
    // console.log(req.session);


    // try{
    //     await req.session.save();
    // } catch(error){
    //     return next(error);
    // }

    res.render('customer/orders/success');
}

function getFailure(req, res){
    res.render('customer/orders/failure');
}

module.exports = {
    addOrder: addOrder,
    getOrders: getOrders,
    getSuccess: getSuccess,
    getFailure: getFailure,
}