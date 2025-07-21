import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  points: { type: Number, default: 0 },
  isInStore: { type: Boolean, default: false },
  role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
