const Order = require('../models/Order');

const successController = {
    getSuccess: async (req, res) => {
        const orderId = req.query.orderId;
        let order = null;
        if (orderId) {
            try {
                order = await Order.findById(orderId);
            } catch (err) {
                console.error(err);
            }
        }
        res.render('success', {
            title: 'Booking Confirmed - BeJet',
            page: 'success',
            layout: false,
            order
        });
    }
};

module.exports = successController;
