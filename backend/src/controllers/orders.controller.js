const { getStore, updateStore } = require('../config/db');

function createOrder(req, res) {
  const { items, pickupType, deliveryLocation, paymentMethod, notes } = req.body;
  const user = req.user;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart items are required.' });
  }

  const store = getStore();
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = (store.products || []).find(p => p.id === item.productId);
    if (product) {
      const qty = Number(item.quantity) || 1;
      const itemTotal = product.price * qty;
      subtotal += itemTotal;
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        storeId: product.storeId,
        storeName: product.storeName,
        image: product.image,
        total: itemTotal
      });
    }
  }

  if (orderItems.length === 0) {
    return res.status(400).json({ success: false, message: 'No valid products in cart.' });
  }

  const tax = Number((subtotal * 0.07).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const order = {
    id: `ord-${Date.now()}`,
    orderNumber: `CM-${Math.floor(100000 + Math.random() * 900000)}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone || '',
    items: orderItems,
    pickupType: pickupType || 'Store Pickup', // 'Store Pickup', 'Food Court Table Service', 'Mall Valet Delivery'
    deliveryLocation: deliveryLocation || 'Main Information Desk Counter',
    paymentMethod: paymentMethod || 'Card on Pickup',
    notes: notes || '',
    subtotal: Number(subtotal.toFixed(2)),
    tax,
    total,
    status: 'PREPARING', // 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'
    createdAt: new Date().toISOString()
  };

  updateStore(state => {
    if (!state.orders) state.orders = [];
    state.orders.unshift(order);

    // Add loyalty points
    const u = state.users.find(usr => usr.id === user.id);
    if (u) {
      u.loyaltyPoints = (u.loyaltyPoints || 0) + Math.floor(total * 5);
    }
  });

  // Emit real-time notification via Socket.io
  const io = req.app.get('io');
  if (io) {
    io.emit('new_order', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status
    });
  }

  return res.status(201).json({
    success: true,
    message: 'Order placed successfully! Track your order status in real time.',
    order
  });
}

function getUserOrders(req, res) {
  const store = getStore();
  const userOrders = (store.orders || []).filter(o => o.userId === req.user.id);
  return res.json({
    success: true,
    orders: userOrders
  });
}

function getOrderById(req, res) {
  const { id } = req.params;
  const store = getStore();
  const order = (store.orders || []).find(o => o.id === id || o.orderNumber === id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  return res.json({
    success: true,
    order
  });
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById
};

