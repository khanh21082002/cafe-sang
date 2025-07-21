import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: String,
  nameEn: String,
  description: String,
  descriptionEn: String,
  price: Number,
  category: String,
  image: String,
  rating: Number,
  reviewCount: Number,
  views: Number,
  clicks: Number,
  orders: Number
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
