const checkoutController = {
    getCheckout: (req, res) => {
        const cartItems = req.session?.cart || [];
        const promoDiscount = 0;
        const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) - promoDiscount;
        res.render('checkout', {
            title: 'Checkout - BeJet',
            page: 'checkout',
            cartItems,
            promoDiscount,
            total
        });
    },

    postCheckout: (req, res) => {
        // Store form data in session
        req.session.checkoutData = req.body;
        res.redirect('/order/preview');
    }
};

module.exports = checkoutController;
