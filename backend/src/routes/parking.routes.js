const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parking.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/', parkingController.getParkingStatus);
router.post('/reserve', requireAuth, parkingController.reserveSpot);

module.exports = router;

