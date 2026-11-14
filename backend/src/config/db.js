const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const seedData = require('../data/seedData');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

let pool = null;
let usePostgres = false;
let dbState = null;

// Initialize data directory & state
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function initializeState() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbState = JSON.parse(content);
      console.log('✅ Loaded database from file storage');
    } catch (err) {
      console.error('Error reading db.json, re-seeding:', err.message);
      dbState = JSON.parse(JSON.stringify(seedData));
      persistState();
    }
  } else {
    console.log('🌱 Seeding initial Center MALL dataset...');
    dbState = JSON.parse(JSON.stringify(seedData));
    // Additional dynamic structures
    dbState.users = [
      {
        id: "usr-demo",
        name: "Youssef Demo",
        email: "youssef@centermall.com",
        phone: "+216 20 123 456",
        role: "user",
        // pre-hashed password for "password123"
        passwordHash: "$2b$10$wN1Qe47dZf84pZqPskM7quf2qF1u80k85n89r0h6mY/yIeZ6uGj8a",
        loyaltyPoints: 1250,
        membershipTier: "Gold VIP",
        bookmarks: ["store-1", "store-2", "store-5"],
        createdAt: new Date().toISOString()
      }
    ];
    dbState.orders = [];
    dbState.bookings = [];
    persistState();
  }
}

function persistState() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database state:', err.message);
  }
}

async function connectDb() {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    try {
      pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 2000,
      });
      const client = await pool.connect();
      client.release();
      usePostgres = true;
      console.log('🐘 Connected to PostgreSQL database');
    } catch (err) {
      console.log('ℹ️  PostgreSQL not active (' + err.message + '). Falling back smoothly to persistent local JSON store.');
      usePostgres = false;
    }
  } else {
    console.log('ℹ️  No DATABASE_URL configured. Running with persistent local JSON store.');
  }

  initializeState();
}

function getStore() {
  if (!dbState) {
    initializeState();
  }
  return dbState;
}

function updateStore(updater) {
  if (!dbState) initializeState();
  updater(dbState);
  persistState();
  return dbState;
}

module.exports = {
  connectDb,
  getStore,
  updateStore,
  isPostgres: () => usePostgres,
  getPool: () => pool
};

