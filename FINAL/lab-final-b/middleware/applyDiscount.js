const applyDiscount = (req, res, next) => {
    const coupon = req.body.coupon;
    if (coupon === 'SAVE10') {
        req.discountApplied = true;
        req.discountRate = 0.1;
    } else {
        req.discountApplied = false;
        req.discountRate = 0;
    }
    next();
};

module.exports = applyDiscount;