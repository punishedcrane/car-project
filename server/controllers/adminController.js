import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// Generate JWT and set it as cookie
const generateAdminToken = (res, adminId) => {
  const token = jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('adminJwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Register admin
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = await Admin.create({ name, email, password });

    generateAdminToken(res, admin._id);

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    generateAdminToken(res, admin._id);

    res.status(200).json({
      message: 'Admin logged in successfully',
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout admin
export const logoutAdmin = (req, res) => {
  res.cookie('adminJwt', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Admin logged out successfully' });
};

// Get logged-in admin profile
export const getAdminProfile = async (req, res) => {
  const admin = req.admin;
  if (!admin) return res.status(401).json({ message: 'Unauthorized' });

  res.json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
  });
};
