import Order from '../models/order.model.js';

export const createOrder = async (req, res) => {
  try {
    const { userId, items, total, tableNumber, pointsEarned } = req.body;
    const order = new Order({ userId, items, total, tableNumber, pointsEarned });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
