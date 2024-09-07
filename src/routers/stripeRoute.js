const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

// Define routes
router.post('/payment', stripeController.payment);
router.get('/payment-options', stripeController.stripePayment);

module.exports = router;
