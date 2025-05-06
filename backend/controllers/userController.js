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
    const { email, hashedPassword } = req.body;
    // Find user by email
    const user = await User.findOne({ email });

    const match = await bcrypt.compare(hashedPassword, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id ,
        userName: user.name
      }, 
      process.env.TOKEN_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
};