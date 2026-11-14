const { getStore, updateStore } = require('../config/db');

function getAllEvents(req, res) {
  const store = getStore();
  return res.json({
    success: true,
    events: store.events || []
  });
}

function rsvpEvent(req, res) {
  const { id } = req.params;
  const store = getStore();
  const event = (store.events || []).find(e => e.id === id);

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found.' });
  }

  updateStore(state => {
    const ev = state.events.find(e => e.id === id);
    if (ev) {
      ev.attendees = (ev.attendees || 0) + 1;
    }
  });

  return res.json({
    success: true,
    message: 'You have registered for this event! A pass has been added to your profile.',
    event
  });
}

module.exports = {
  getAllEvents,
  rsvpEvent
};

