const { getStore } = require('../config/db');

function getAllDeals(req, res) {
  const store = getStore();
  return res.json({
    success: true,
    deals: store.deals || []
  });
}

module.exports = {
  getAllDeals
};

