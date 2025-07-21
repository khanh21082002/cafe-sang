import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: String,
  quantity: Number,
  price: Number,
  notes: String
});

const orderSchema = new mongoose.Schema({
  userId: String,
  items: [orderItemSchema],
  total: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  tableNumber: Number,
  pointsEarned: Number
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
