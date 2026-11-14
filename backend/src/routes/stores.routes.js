const express = require('express');
const router = express.Router();
const storesController = require('../controllers/stores.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/', storesController.getAllStores);
router.get('/:id', storesController.getStoreById);
router.post('/:id/reviews', requireAuth, storesController.addStoreReview);

module.exports = router;

