import User from '../models/user.model.js';
import hashUtil from '../utils/hash.util.js';


// Lấy danh sách user
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo user mới (admin/staff)
export const createUser = async (req, res) => {
  try {
    const { username, password, email, phone, role } = req.body;
    const hashedPassword = await hashUtil.hashPassword(password);
    const user = new User({ username, password: hashedPassword, email, phone, role });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    if (update.password) {
      update.password = await hashUtil.hashPassword(update.password);
    }
    const user = await User.findByIdAndUpdate(id, update, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật điểm user
export const updateUserPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;
    const user = await User.findByIdAndUpdate(id, { points }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật role user
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật trạng thái inStore
export const updateUserInStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { isInStore } = req.body;
    const user = await User.findByIdAndUpdate(id, { isInStore }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
