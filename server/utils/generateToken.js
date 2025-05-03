import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('token', token, {
    httpOnly: true, // Cannot be accessed via JavaScript (secure)
    secure: process.env.NODE_ENV === 'production', // Send cookie over HTTPS only in production
    sameSite: 'strict', // Prevent CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
