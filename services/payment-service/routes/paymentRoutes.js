// services/photographer-service/routes/photographerRoutes.js
const express = require('express');

const {handlePayment} = require('../controllers/paymentController')

const router = express.Router();

router.post('/handlepayment', handlePayment);



module.exports = router;
