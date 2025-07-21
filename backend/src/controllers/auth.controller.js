import User from "../models/user.model.js";
import hashUtil from "../utils/hash.util.js";

import jwt from "jsonwebtoken";

const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      username: user.username,
      points: user.points,
      isInStore: user.isInStore,
    },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "15m" }
  );
};

const signRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET || "refresh_secret",
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });
    const hashedPassword = await hashUtil.hashPassword(password);
    const user = new User({
      fullName: name,
      email,
      password: hashedPassword,
      role,
      phone,
    });
    await user.save();
    const token = signToken(user);
    const refreshToken = signRefreshToken(user);
    res
      .status(201)
      .json({ message: "Register success", user, token, refreshToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });
    const isMatch = await hashUtil.comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = signToken(user);
    const refreshToken = signRefreshToken(user);
    res.json({ message: "Login success", user, token, refreshToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Endpoint cấp lại access token từ refresh token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ error: "No refresh token provided" });
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET || "refresh_secret",
    async (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });
      // Lấy lại user từ DB để đảm bảo thông tin mới nhất
      const dbUser = await User.findById(user.id);
      if (!dbUser) return res.status(404).json({ error: "User not found" });
      const newToken = signToken(dbUser);
      res.json({ token: newToken });
    }
  );
};
