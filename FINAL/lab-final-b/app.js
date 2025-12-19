require('dotenv').config({ silent: true });
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const connectDB = require('./config/database');

const indexRoutes = require('./routes/index');
const checkoutRoutes = require('./routes/checkout');
const productsRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/order');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(session({
    secret: process.env.SESSION_SECRET || 'bejet-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// Set locals for user
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.use('/', indexRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/products', productsRoutes);
app.use('/admin', adminRoutes);
app.use('/order', orderRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
    res.status(404).render('error', { 
        title: '404 - Page Not Found',
        message: 'The page you are looking for does not exist.',
        layout: false
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});