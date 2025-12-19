const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/preview', orderController.getOrderPreview);
router.post('/preview', orderController.postOrderPreview);
router.get('/my-orders', orderController.getMyOrders);

module.exports = router;