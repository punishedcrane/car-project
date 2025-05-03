import jwt from 'jsonwebtoken';
import AdminModel from '../models/Admin.js';

export const adminProtect = async (req, res, next) => {
  const token = req.cookies.adminJwt;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized as admin, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await AdminModel.findById(decoded.adminId).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    req.admin = admin; // ✅ Store the logged-in admin as `req.admin`
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Admin token failed or invalid' });
  }
};
