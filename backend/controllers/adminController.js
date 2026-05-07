const Order = require('../models/Order');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrdersCount = await Order.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrdersCount = await Order.countDocuments({ placedAt: { $gte: today } });

    const allPaidOrders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = allPaidOrders.reduce((acc, order) => acc + order.total, 0);
    
    const todayPaidOrders = await Order.find({ paymentStatus: 'paid', placedAt: { $gte: today } });
    const todayRevenue = todayPaidOrders.reduce((acc, order) => acc + order.total, 0);

    const totalCustomers = await User.countDocuments({ role: 'customer' });

    const pendingOrders = await Order.countDocuments({ orderStatus: 'placed' });
    const preparingOrders = await Order.countDocuments({ orderStatus: 'preparing' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

    // Revenue by day (last 7 days)
    const revenueByDay = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      
      const dayOrders = await Order.find({
        paymentStatus: 'paid',
        placedAt: { $gte: d, $lt: nextDay }
      });
      const dayRev = dayOrders.reduce((acc, o) => acc + o.total, 0);
      revenueByDay.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayRev
      });
    }

    // Top items
    const topItemsData = await MenuItem.find().sort({ ordersCount: -1 }).limit(5);
    const topItems = topItemsData.map(item => ({
      name: item.name,
      ordersCount: item.ordersCount,
      revenue: item.ordersCount * item.price
    }));

    // Recent orders
    const recentOrders = await Order.find().populate('user', 'name').sort({ placedAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalOrders: totalOrdersCount,
        todayOrders: todayOrdersCount,
        totalRevenue,
        todayRevenue,
        totalCustomers,
        pendingOrders,
        preparingOrders,
        deliveredOrders,
        cancelledOrders,
        revenueByDay,
        topItems,
        recentOrders,
        orderStatusBreakdown: {
          placed: pendingOrders,
          confirmed: await Order.countDocuments({ orderStatus: 'confirmed' }),
          preparing: preparingOrders,
          out_for_delivery: await Order.countDocuments({ orderStatus: 'out_for_delivery' }),
          delivered: deliveredOrders,
          cancelled: cancelledOrders
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.orderStatus = status.toLowerCase();
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ placedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
      
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const orderToUpdate = await Order.findById(req.params.id);
    if (!orderToUpdate) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updateData = { orderStatus: status };
    if (status === 'delivered' && orderToUpdate.paymentMethod === 'cod') {
      updateData.paymentStatus = 'paid';
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    const customerData = await Promise.all(customers.map(async (c) => {
      const orders = await Order.find({ user: c._id });
      const totalSpent = orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.total : 0), 0);
      
      let codPending = 0;
      let codPaid = 0;
      let cardTotal = 0;

      orders.forEach(o => {
        if (o.paymentMethod === 'cod') {
          if (o.orderStatus === 'delivered' || o.paymentStatus === 'paid') {
            codPaid += o.total;
          } else if (o.orderStatus !== 'cancelled') {
            codPending += o.total;
          }
        } else if (o.paymentMethod === 'card') {
          if (o.paymentStatus === 'paid') {
            cardTotal += o.total;
          }
        }
      });

      return {
        _id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        totalOrders: orders.length,
        totalSpent,
        codPending,
        codPaid,
        cardTotal,
        joinedAt: c.createdAt
      };
    }));
    
    res.status(200).json({ success: true, data: customerData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMenu = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
