const { getStore } = require('../config/db');

function getAllProducts(req, res) {
  const { category, storeId, deal, search } = req.query;
  const store = getStore();
  let results = [...(store.products || [])];

  if (category && category !== 'all') {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (storeId) {
    results = results.filter(p => p.storeId === storeId);
  }

  if (deal === 'true') {
    results = results.filter(p => !!p.dealTag || (p.originalPrice && p.originalPrice > p.price));
  }

  if (search) {
    const q = search.toLowerCase().trim();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.storeName.toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    count: results.length,
    products: results
  });
}

function getProductById(req, res) {
  const { id } = req.params;
  const store = getStore();
  const product = (store.products || []).find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  // Also include store information
  const shop = (store.stores || []).find(s => s.id === product.storeId);

  return res.json({
    success: true,
    product: {
      ...product,
      store: shop || null
    }
  });
}

module.exports = {
  getAllProducts,
  getProductById
};

