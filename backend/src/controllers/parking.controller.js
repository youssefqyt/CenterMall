const { getStore, updateStore } = require('../config/db');

function getParkingStatus(req, res) {
  const store = getStore();
  return res.json({
    success: true,
    parking: store.parking
  });
}

function reserveSpot(req, res) {
  const { level, vehiclePlate } = req.body;
  const user = req.user;

  if (!vehiclePlate) {
    return res.status(400).json({ success: false, message: 'Vehicle plate number is required.' });
  }

  const store = getStore();
  const selectedLevel = store.parking.levels.find(l => l.id === (level || 'P1')) || store.parking.levels[0];

  if (selectedLevel.available <= 0) {
    return res.status(400).json({ success: false, message: 'No available parking spaces on this level.' });
  }

  const reservation = {
    id: `park-${Date.now()}`,
    userId: user.id,
    vehiclePlate: vehiclePlate.toUpperCase(),
    level: selectedLevel.name,
    spotNumber: `${selectedLevel.id}-${Math.floor(Math.random() * 80 + 10)}`,
    reservedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
    status: 'ACTIVE'
  };

  updateStore(state => {
    state.parking.availableSpaces = Math.max(0, state.parking.availableSpaces - 1);
    state.parking.occupiedSpaces += 1;
    const lvl = state.parking.levels.find(l => l.id === selectedLevel.id);
    if (lvl) lvl.available = Math.max(0, lvl.available - 1);

    if (!state.parkingReservations) state.parkingReservations = [];
    state.parkingReservations.push(reservation);
  });

  return res.status(201).json({
    success: true,
    message: 'Parking spot reserved successfully! Display this pass at the entrance gate.',
    reservation
  });
}

module.exports = {
  getParkingStatus,
  reserveSpot
};

