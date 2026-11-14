# Center MALL 🛍️🏢

Center MALL is a full-stack shopping mall platform comprising a Node.js/Express backend API and a modern Expo/React Native mobile application.

---

## 📁 Project Architecture

```
Center MALL/
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── config/           # Database configuration (PostgreSQL & JSON store fallback)
│   │   ├── controllers/      # Auth, Mall, Stores, Products, Cinema, Parking, Orders
│   │   ├── data/             # Initial seed dataset (shops, IMAX, deals, amenities)
│   │   ├── middleware/       # JWT Authentication & role verification
│   │   ├── routes/           # API routes under /api/*
│   │   └── server.js         # Express + Socket.io main server
│   ├── .env.example          # Environment variables template
│   └── package.json
│
├── mobile/                   # Expo / React Native Mobile Application
│   ├── src/
│   │   ├── api/              # Axios client with fallback dataset
│   │   ├── context/          # AuthContext (VIP membership) & CartContext
│   │   ├── navigation/       # Bottom tabs & stack navigators
│   │   ├── screens/          # Home, Stores, Cinema, Food Court, Services, Cart, Profile
│   │   └── theme/            # Color palette & styling
│   ├── App.js                # Main application root
│   ├── app.json              # Expo configuration
│   └── package.json
│
├── package.json              # Monorepo root scripts
├── start-all.js              # One-click launcher for backend & mobile
└── README.md
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Root
npm install

# Backend
cd backend
npm install

# Mobile
cd ../mobile
npm install
```

### 2. Configure Backend Environment

Copy `.env.example` to `.env` in `backend/`:

```bash
cd backend
cp .env.example .env
```

### 3. Launch Both Services Together

From the project root:

```bash
npm start
```

Or start individually:

- **Backend only**: `npm run backend` (runs on `http://localhost:5000`)
- **Mobile Expo only**: `npm run mobile` (runs on `http://localhost:8081`)

---

## 🌟 Key Features

### Backend API
- **Store Directory & Floor Guides**: Filter shops by floor (Ground, F1, F2, F3) or category.
- **Cinema & Multiplex**: IMAX Laser & 4DX movie schedules, seat booking & QR passes.
- **Dining & Food Court**: In-mall restaurant menus, food ordering to tables or takeaway.
- **Smart Parking**: Real-time spot counters for P1 & P2 with spot reservations.
- **Auth & VIP Club**: JWT authentication, Gold VIP tiers, and loyalty points.
- **Real-Time Updates**: Socket.io notifications for order progress.

### Mobile App
- **Interactive Mall Home**: Hero sales banner, flash deals, featured shops, upcoming events.
- **Shop Catalog & Reviews**: Detailed shop profiles with products and customer ratings.
- **Cinema Booking**: Browse now playing movies, select showtimes, and book tickets.
- **Food Court Ordering**: Order food directly to your table or pickup counter.
- **Services & Live Parking**: Real-time parking availability and floor directory map.
- **VIP Member Card**: Digital barcode pass and rewards tracking.
