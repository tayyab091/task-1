const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const applyDiscount = require('../middleware/applyDiscount');

router.get('/preview', applyDiscount, orderController.getOrderPreview);
router.post('/preview', applyDiscount, orderController.getOrderPreview);
router.get('/my-orders', orderController.getMyOrders);

module.exports = router;