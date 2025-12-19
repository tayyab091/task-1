const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

router.get('/', productsController.getProducts);
router.post('/add-to-cart', productsController.addToCart);

module.exports = router;
