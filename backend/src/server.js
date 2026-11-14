require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');

const { connectDb } = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth.routes');
const storesRoutes = require('./routes/stores.routes');
const productsRoutes = require('./routes/products.routes');
const dealsRoutes = require('./routes/deals.routes');
const eventsRoutes = require('./routes/events.routes');
const cinemaRoutes = require('./routes/cinema.routes');
const parkingRoutes = require('./routes/parking.routes');
const ordersRoutes = require('./routes/orders.routes');
const mallRoutes = require('./routes/mall.routes');

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to live Mall updates: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter for API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// Welcome / health check
app.get('/', (req, res) => {
  res.json({
    name: 'Center MALL API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      auth: '/api/auth [register, login, me, profile, bookmark]',
      mall: '/api/mall [info, floors, amenities, categories]',
      stores: '/api/stores [list, detail, reviews]',
      products: '/api/products [list, detail]',
      deals: '/api/deals',
      events: '/api/events [list, rsvp]',
      cinema: '/api/cinema [movies, book, my-bookings]',
      parking: '/api/parking [status, reserve]',
      orders: '/api/orders [create, list, detail]'
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/mall', mallRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/cinema', cinemaRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/orders', ordersRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDb();
  server.listen(PORT, () => {
    console.log(`🚀 Center MALL Backend Server is running on http://localhost:${PORT}`);
  });
}

start();

module.exports = { app, server };

