import Contact from '../models/contact.model.js';

export const sendContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ message: 'Contact sent', contact });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
