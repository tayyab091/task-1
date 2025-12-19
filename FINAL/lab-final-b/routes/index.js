const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const successController = require('../controllers/successController');

router.get('/', indexController.getHome);
router.get('/success', successController.getSuccess);

module.exports = router;
