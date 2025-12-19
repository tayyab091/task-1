const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const applyDiscount = require('../middleware/applyDiscount');

router.get('/preview', orderController.getOrderPreview);
router.post('/preview', applyDiscount, orderController.postOrderPreview);
router.get('/my-orders', orderController.getMyOrders);

module.exports = router;