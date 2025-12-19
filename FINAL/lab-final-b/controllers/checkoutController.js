const checkoutController = {
    getCheckout: (req, res) => {
        res.redirect('/order/preview');
    },

    postCheckout: (req, res) => {
        res.redirect('/order/preview');
    }
};

module.exports = checkoutController;
