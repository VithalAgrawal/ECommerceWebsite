const express = require('express');
const csrf = require('csurf');

const path = require('path');


const db = require('./data/database');

const expressSession = require('express-session');

const errorHandlerMiddleware = require('./middlewares/error-handler');

const checkAuthStatusMiddleware = require('./middlewares/check-auth');

const createSessionConfig = require('./config/session');

const addCsrfTokenMiddleware = require('./middlewares/csrf-token');

const cartMiddleware = require('./middlewares/cart');

const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');

const protectRoutesMiddleware = require('./middlewares/protect-routes');

const notFoundMiddleware = require('./middlewares/not-found');

const authRoutes = require('./routes/auth.routes');
const baseRoutes = require('./routes/base.routes');
const productRoutes = require('./routes/products.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets', express.static('product-data'));


app.use(express.urlencoded({extended: false}));

app.use(express.json());

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(csrf()); //generates tokens and checks incoming tokens for validity

app.use(addCsrfTokenMiddleware); //distributes generated tokens to all middlewares/route handler fns and views

app.use(checkAuthStatusMiddleware);

app.use(baseRoutes); //registering a middleware triggered for all incoming requests
app.use(authRoutes); //registering a middleware triggered for all incoming requests
app.use(productRoutes); //registering a middleware triggered for all incoming requests
app.use('/cart', cartRoutes); //registering a middleware triggered for all incoming requests with /cart prefix
// app.use(protectRoutesMiddleware); //registering a middleware to protect routes requiring authentication and authorization
app.use('/orders', protectRoutesMiddleware, ordersRoutes); //registering a middleware triggered for all incoming requests with /orders prefix
app.use('/admin', protectRoutesMiddleware, adminRoutes); //registering a middleware triggered for all incoming requests with /admin prefix

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
.then(function(){
    app.listen(3000);
})
.catch(function(error){
    console.log('Failed to connect to the Database!');
    console.log(error);
});

