import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  name: String,
  nameEn: String,
  description: String,
  descriptionEn: String,
  pointsRequired: Number,
  image: String,
  available: Boolean
});

const Reward = mongoose.model('Reward', rewardSchema);
export default Reward;
