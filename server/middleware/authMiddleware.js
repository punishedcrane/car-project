// server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';  // Make sure this import path matches your actual User model path

export const protect = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Add this console log to debug
    console.log('User attached to request:', {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    });
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const isDealer = (req, res, next) => {
  if (req.user && req.user.role === 'dealer') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Dealers only.' });
  }
};