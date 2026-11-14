const { getStore, updateStore } = require('../config/db');

function getAllMovies(req, res) {
  const store = getStore();
  return res.json({
    success: true,
    movies: store.movies || []
  });
}

function bookTickets(req, res) {
  const { movieId, showtime, ticketsCount, seats } = req.body;
  const user = req.user;

  if (!movieId || !showtime || !ticketsCount) {
    return res.status(400).json({ success: false, message: 'Movie, showtime, and ticket count are required.' });
  }

  const store = getStore();
  const movie = (store.movies || []).find(m => m.id === movieId);
  if (!movie) {
    return res.status(404).json({ success: false, message: 'Movie not found.' });
  }

  const totalPrice = Number((movie.price * ticketsCount).toFixed(2));
  const booking = {
    id: `book-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    movieId: movie.id,
    movieTitle: movie.title,
    hall: movie.hall,
    showtime,
    ticketsCount: Number(ticketsCount),
    seats: seats || ['E12', 'E13'],
    totalPrice,
    status: 'CONFIRMED',
    qrCode: `TKT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    createdAt: new Date().toISOString()
  };

  updateStore(state => {
    if (!state.bookings) state.bookings = [];
    state.bookings.push(booking);

    // Reward loyalty points
    const u = state.users.find(usr => usr.id === user.id);
    if (u) {
      u.loyaltyPoints = (u.loyaltyPoints || 0) + Math.floor(totalPrice * 10);
    }
  });

  return res.status(201).json({
    success: true,
    message: 'Cinema tickets booked successfully!',
    booking
  });
}

function getUserBookings(req, res) {
  const store = getStore();
  const userBookings = (store.bookings || []).filter(b => b.userId === req.user.id);
  return res.json({
    success: true,
    bookings: userBookings
  });
}

module.exports = {
  getAllMovies,
  bookTickets,
  getUserBookings
};

