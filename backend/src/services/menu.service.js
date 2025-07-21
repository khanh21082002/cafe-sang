import MenuItem from '../models/menu.model.js';

export const getAllMenuItems = async () => {
  return MenuItem.find();
};

export const getMenuItemById = async (id) => {
  return MenuItem.findById(id);
};

export const createMenuItem = async (data) => {
  const item = new MenuItem(data);
  return item.save();
};

export const updateMenuItem = async (id, update) => {
  return MenuItem.findByIdAndUpdate(id, update, { new: true });
};

export const deleteMenuItem = async (id) => {
  return MenuItem.findByIdAndDelete(id);
};

export const getTopOrderedMenuItems = async (limit = 5) => {
  return MenuItem.find().sort({ orders: -1 }).limit(limit);
};
