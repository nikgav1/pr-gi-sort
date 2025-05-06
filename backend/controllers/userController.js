import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });
    await newUser.save();
    res.status(200)
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error creating User!' });
  }
};
