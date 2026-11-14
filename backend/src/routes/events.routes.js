const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/', eventsController.getAllEvents);
router.post('/:id/rsvp', requireAuth, eventsController.rsvpEvent);

module.exports = router;

