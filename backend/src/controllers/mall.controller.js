const { getStore } = require('../config/db');

function getMallInfo(req, res) {
  const store = getStore();
  return res.json({
    success: true,
    mall: store.mall,
    categories: store.categories || []
  });
}

function getFloors(req, res) {
  const store = getStore();
  const floors = (store.mall && store.mall.floors) || [];
  const stores = store.stores || [];

  const floorsWithStores = floors.map(floor => ({
    ...floor,
    stores: stores.filter(s => s.floor.toLowerCase() === floor.id.toLowerCase())
  }));

  return res.json({
    success: true,
    floors: floorsWithStores
  });
}

function getAmenities(req, res) {
  const store = getStore();
  return res.json({
    success: true,
    amenities: (store.mall && store.mall.amenities) || []
  });
}

function getCategories(req, res) {
  const store = getStore();
  return res.json({
    success: true,
    categories: store.categories || []
  });
}

module.exports = {
  getMallInfo,
  getFloors,
  getAmenities,
  getCategories
};

