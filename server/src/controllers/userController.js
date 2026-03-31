import bcrypt from 'bcryptjs';
import User from '../models/UserSchema.js';

// @desc    Get all users
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords for security
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkBadge = async (req, res) => {
  try {
    const { badge } = req.query;
    // Find if any user already has this badge
    const user = await User.findOne({ badge: badge.toUpperCase() });

    res.json({
      isAvailable: !user,
      message: user ? "Badge number already assigned" : "Available"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchFieldOfficers = async (req, res) => {
  const { term } = req.query; // e.g., ?term=Smith
  try {
    const officers = await User.find({
      role: 'FIELD_OFFICER',
      $or: [
        { name: { $regex: term, $options: 'i' } },
        { badge: { $regex: term, $options: 'i' } }
      ]
    }).select('-password');
    res.json(officers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateUserStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
