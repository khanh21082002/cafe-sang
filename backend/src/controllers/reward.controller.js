import Reward from '../models/reward.model.js';

export const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
