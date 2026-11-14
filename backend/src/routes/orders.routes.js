const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.post('/', requireAuth, ordersController.createOrder);
router.get('/', requireAuth, ordersController.getUserOrders);
router.get('/:id', requireAuth, ordersController.getOrderById);

module.exports = router;

