
import MenuItem from '../models/menu.model.js';

export const getMenu = async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await MenuItem.findByIdAndDelete(id);
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTopOrderedMenuItems = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const items = await MenuItem.find().sort({ orders: -1 }).limit(limit);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
