const Order = require('../models/Order');

const orderController = {
    getOrderPreview: (req, res) => {
        if (req.method === 'POST') {
            // Handle confirmation
            const cartItems = req.session?.cart || [];
            if (!cartItems.length) {
                return res.redirect('/products');
            }
            const checkoutData = req.body;
            if (!checkoutData.email) {
                return res.redirect('/order/preview');
            }
            let total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
            let discount = 0;
            const coupon = req.body.coupon;
            if (req.discountApplied) {
                discount = total * req.discountRate;
                total -= discount;
            }
            const order = new Order({
                user: req.session.user ? req.session.user._id : null,
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
            return;
        }
        const cartItems = req.session?.cart || [];
        if (!cartItems.length) {
            return res.redirect('/products');
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
            email: req.session.user ? req.session.user.email : (req.session.checkoutData?.email || ''),
            checkoutData: req.session.checkoutData || {}
        });
    },

    getMyOrders: async (req, res) => {
        try {
            let orders = [];
            if (req.session.user) {
                orders = await Order.find({ user: req.session.user._id }).sort({ createdAt: -1 });
            } else {
                const email = req.query.email;
                if (email) {
                    orders = await Order.find({ email }).sort({ createdAt: -1 });
                }
            }
            res.render('my-orders', {
                title: 'My Orders - BeJet',
                page: 'my-orders',
                orders,
                email: req.query.email || ''
            });
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { message: 'Error fetching orders', layout: false });
        }
    }
};

module.exports = orderController;