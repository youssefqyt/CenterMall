const express = require('express');
const router = express.Router();
const cinemaController = require('../controllers/cinema.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/', cinemaController.getAllMovies);
router.post('/book', requireAuth, cinemaController.bookTickets);
router.get('/my-bookings', requireAuth, cinemaController.getUserBookings);

module.exports = router;

