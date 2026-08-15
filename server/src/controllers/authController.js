import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/UserSchema.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'inactive' && user.role !== 'EVIDENCE_MANAGER') {
      return res.status(403).json({
        message: 'Your account has been deactivated. Please contact an administrator.'
      });
    }

    // Create Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, role: user.role, badge: user.badge, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
