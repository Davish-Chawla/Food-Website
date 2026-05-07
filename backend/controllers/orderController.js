const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

exports.placeOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    // Calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
      // Increment orders count for each item
      await MenuItem.findByIdAndUpdate(item.menuItemId || item._id, { $inc: { ordersCount: item.quantity } });
    }

    const deliveryFee = 49;
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + gst;

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const order = await Order.create({
      user: req.user.id,
      items: items.map(i => ({
        menuItem: i.menuItemId || i._id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image
      })),
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
      subtotal,
      deliveryFee,
      gst,
      total
    });

    res.status(201).json({ success: true, order, message: 'Order placed successfully' });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ placedAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
