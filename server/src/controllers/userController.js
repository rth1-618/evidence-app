import bcrypt from 'bcryptjs';
import User from '../models/UserSchema.js';

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, badge } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      badge,
      status: 'active' // Default to active when created
    });

    res.status(201).json({ success: true, data: { id: newUser._id, name, role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
