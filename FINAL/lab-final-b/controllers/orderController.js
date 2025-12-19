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
                console.log('Order saved successfully:', order._id);
                req.session.cart = [];
                req.session.userEmail = checkoutData.email; // Store email for future orders
                delete req.session.checkoutData;
                req.session.save(() => {
                    res.redirect('/success?orderId=' + order._id);
                });
            }).catch(err => {
                console.error('Error saving order:', err);
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
        if (req.discountApplied) {
            discount = total * req.discountRate;
            total -= discount;
        }
        res.render('order-preview', {
            title: 'Order Preview - BeJet',
            page: 'order-preview',
            cartItems,
            total,
            discount,
            coupon,
            email: req.session.userEmail || (req.session.checkoutData?.email || ''),
            checkoutData: req.session.checkoutData || {}
        });
    },

    getMyOrders: async (req, res) => {
        try {
            let orders = [];
            const email = req.session.userEmail || req.query.email;
            console.log('Looking for orders with email:', email);
            if (email) {
                orders = await Order.find({ email }).sort({ createdAt: -1 });
                console.log('Found orders:', orders.length);
            }
            res.render('my-orders', {
                title: 'My Orders - BeJet',
                page: 'my-orders',
                orders,
                email: email || ''
            });
        } catch (err) {
            console.error('Error in getMyOrders:', err);
            res.status(500).render('error', { message: 'Error fetching orders', layout: false });
        }
    }
};

module.exports = orderController;