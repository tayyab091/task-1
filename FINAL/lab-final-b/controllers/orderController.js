const Order = require('../models/Order');

const orderController = {
    getOrderPreview: (req, res) => {
        const cartItems = req.session?.cart || [];
        if (!cartItems.length) {
            return res.redirect('/checkout');
        }
        let total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        let discount = 0;
        const coupon = req.query.coupon || req.body.coupon;
        if (coupon === 'SAVE10') {
            discount = total * 0.1;
            total -= discount;
        }
        res.render('order-preview', {
            title: 'Order Preview - BeJet',
            page: 'order-preview',
            cartItems,
            total,
            discount,
            coupon,
            email: req.session.checkoutData?.email || ''
        });
    },

    postOrderPreview: (req, res) => {
        const cartItems = req.session?.cart || [];
        if (!cartItems.length) {
            return res.redirect('/checkout');
        }
        const checkoutData = req.session.checkoutData;
        if (!checkoutData) {
            return res.redirect('/checkout');
        }
        let total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        let discount = 0;
        const coupon = req.body.coupon;
        if (coupon === 'SAVE10') {
            discount = total * 0.1;
            total -= discount;
        }
        const order = new Order({
            email: checkoutData.email,
            items: cartItems.map(item => ({
                product: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1
            })),
            total,
            discount
        });
        order.save().then(() => {
            req.session.cart = [];
            delete req.session.checkoutData;
            res.redirect('/success?orderId=' + order._id);
        }).catch(err => {
            console.error(err);
            res.status(500).render('error', { message: 'Error placing order', layout: false });
        });
    },

    getMyOrders: (req, res) => {
        const email = req.query.email;
        if (!email) {
            return res.render('my-orders', {
                title: 'My Orders - BeJet',
                page: 'my-orders',
                orders: null
            });
        }
        Order.find({ email }).sort({ createdAt: -1 }).then(orders => {
            res.render('my-orders', {
                title: 'My Orders - BeJet',
                page: 'my-orders',
                orders
            });
        }).catch(err => {
            console.error(err);
            res.status(500).render('error', { message: 'Error fetching orders', layout: false });
        });
    }
};

module.exports = orderController;