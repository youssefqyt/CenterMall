const { getStore, updateStore } = require('../config/db');

function getAllStores(req, res) {
  const { category, floor, search, featured } = req.query;
  const store = getStore();
  let results = [...store.stores];

  if (category && category !== 'all') {
    results = results.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }

  if (floor && floor !== 'all') {
    results = results.filter(s => s.floor.toLowerCase() === floor.toLowerCase());
  }

  if (featured === 'true') {
    results = results.filter(s => s.isFeatured);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    results = results.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  return res.json({
    success: true,
    count: results.length,
    stores: results
  });
}

function getStoreById(req, res) {
  const { id } = req.params;
  const store = getStore();
  const shop = store.stores.find(s => s.id === id);

  if (!shop) {
    return res.status(404).json({ success: false, message: 'Store not found.' });
  }

  const products = (store.products || []).filter(p => p.storeId === id);

  return res.json({
    success: true,
    store: {
      ...shop,
      products
    }
  });
}

function addStoreReview(req, res) {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const user = req.user;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
  }

  const store = getStore();
  const shopIndex = store.stores.findIndex(s => s.id === id);
  if (shopIndex === -1) {
    return res.status(404).json({ success: false, message: 'Store not found.' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    storeId: id,
    userId: user.id,
    userName: user.name,
    rating: Number(rating),
    comment: comment ? comment.trim() : '',
    createdAt: new Date().toISOString()
  };

  updateStore(state => {
    if (!state.reviews) state.reviews = [];
    state.reviews.push(newReview);

    // Recalculate average rating
    const storeReviews = state.reviews.filter(r => r.storeId === id);
    const avg = storeReviews.reduce((sum, r) => sum + r.rating, 0) / storeReviews.length;
    state.stores[shopIndex].rating = Number(avg.toFixed(1));
    state.stores[shopIndex].reviewsCount = storeReviews.length;
  });

  return res.status(201).json({
    success: true,
    message: 'Thank you for your review!',
    review: newReview,
    updatedRating: store.stores[shopIndex].rating
  });
}

module.exports = {
  getAllStores,
  getStoreById,
  addStoreReview
};

