const successController = {
    getSuccess: (req, res) => {
        res.render('success', {
            title: 'Booking Confirmed - BeJet',
            page: 'success',
            layout: false
        });
    }
};

module.exports = successController;
