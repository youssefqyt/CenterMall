const express = require('express');
const router = express.Router();
const mallController = require('../controllers/mall.controller');

router.get('/info', mallController.getMallInfo);
router.get('/floors', mallController.getFloors);
router.get('/amenities', mallController.getAmenities);
router.get('/categories', mallController.getCategories);

module.exports = router;

