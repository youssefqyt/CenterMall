const express = require('express');
const router = express.Router();
const dealsController = require('../controllers/deals.controller');

router.get('/', dealsController.getAllDeals);

module.exports = router;

