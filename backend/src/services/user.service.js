
import User from '../models/user.model.js';
import hashUtil from '../utils/hash.util.js';

export const getAllUsers = async () => {
  return User.find();
};

export const getUserById = async (id) => {
  return User.findById(id);
};

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const createUser = async ({ fullName, password, email, phone, role }) => {
  const hashedPassword = await hashUtil.hashPassword(password);
  const user = new User({ fullName, password: hashedPassword, email, phone, role });
  return user.save();
};

export const updateUser = async (id, update) => {
  if (update.password) {
    update.password = await hashUtil.hashPassword(update.password);
  }
  return User.findByIdAndUpdate(id, update, { new: true });
};

export const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};

export const updateUserPoints = async (id, points) => {
  return User.findByIdAndUpdate(id, { points }, { new: true });
};

export const updateUserRole = async (id, role) => {
  return User.findByIdAndUpdate(id, { role }, { new: true });
};

export const updateUserInStore = async (id, isInStore) => {
  return User.findByIdAndUpdate(id, { isInStore }, { new: true });
};
