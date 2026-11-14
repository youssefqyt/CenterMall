const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getStore, updateStore } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth.middleware');

async function register(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const store = getStore();
    const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      passwordHash,
      role: 'user',
      loyaltyPoints: 100, // Sign up bonus
      membershipTier: 'Silver Member',
      bookmarks: [],
      createdAt: new Date().toISOString()
    };

    updateStore(state => {
      state.users.push(newUser);
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully! Welcome to Center MALL.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        loyaltyPoints: newUser.loyaltyPoints,
        membershipTier: newUser.membershipTier,
        bookmarks: newUser.bookmarks
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const store = getStore();
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        loyaltyPoints: user.loyaltyPoints || 0,
        membershipTier: user.membershipTier || 'Member',
        bookmarks: user.bookmarks || []
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

function getMe(req, res) {
  const store = getStore();
  const user = store.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      loyaltyPoints: user.loyaltyPoints || 0,
      membershipTier: user.membershipTier || 'Member',
      bookmarks: user.bookmarks || []
    }
  });
}

function updateProfile(req, res) {
  const { name, phone } = req.body;
  const store = getStore();
  const userIndex = store.users.findIndex(u => u.id === req.user.id);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  updateStore(state => {
    if (name) state.users[userIndex].name = name.trim();
    if (phone !== undefined) state.users[userIndex].phone = phone.trim();
  });

  return res.json({
    success: true,
    message: 'Profile updated successfully.',
    user: {
      id: store.users[userIndex].id,
      name: store.users[userIndex].name,
      email: store.users[userIndex].email,
      phone: store.users[userIndex].phone,
      role: store.users[userIndex].role,
      loyaltyPoints: store.users[userIndex].loyaltyPoints,
      membershipTier: store.users[userIndex].membershipTier,
      bookmarks: store.users[userIndex].bookmarks
    }
  });
}

function toggleBookmark(req, res) {
  const { storeId } = req.body;
  if (!storeId) {
    return res.status(400).json({ success: false, message: 'storeId is required.' });
  }

  let isBookmarked = false;
  let updatedBookmarks = [];

  updateStore(state => {
    const user = state.users.find(u => u.id === req.user.id);
    if (!user) return;
    if (!user.bookmarks) user.bookmarks = [];

    const index = user.bookmarks.indexOf(storeId);
    if (index > -1) {
      user.bookmarks.splice(index, 1);
      isBookmarked = false;
    } else {
      user.bookmarks.push(storeId);
      isBookmarked = true;
    }
    updatedBookmarks = [...user.bookmarks];
  });

  return res.json({
    success: true,
    isBookmarked,
    bookmarks: updatedBookmarks
  });
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  toggleBookmark
};

