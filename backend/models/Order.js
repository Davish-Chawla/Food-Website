const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    image: { type: String }
  }],
  deliveryAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    houseNo: String,
    area: String,
    city: String,
    pincode: String
  },
  paymentMethod: { type: String, enum: ['card', 'cod'] },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { 
    type: String, 
    enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed' 
  },
  subtotal: { type: Number },
  deliveryFee: { type: Number, default: 49 },
  gst: { type: Number },
  total: { type: Number },
  estimatedDelivery: { type: String, default: "30-40 minutes" },
  placedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

orderSchema.pre('save', function() {
  if (!this.orderNumber) {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    this.orderNumber = `FH-${randomDigits}`;
  }
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Order', orderSchema);
