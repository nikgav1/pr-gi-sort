import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });
    await newUser.save();

    res.status(200).json({
      message: 'User created successfully',
      userId: newUser._id,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email });

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, userEmail: user.email, userName: user.name },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.json({
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const safeUserObject = {
      name: user.name,
      sortedTrash: user.sortedTrash,
    };

    res.json(safeUserObject);
  } catch (error) {
    console.error('Getting user info error:', error);
    res.status(500).json({ error: 'Getting user info error' });
  }
};
