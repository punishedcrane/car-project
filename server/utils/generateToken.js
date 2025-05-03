// server/utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,                                // Secure from client-side JS
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',                            // Protect against CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000,              // 30 days
  });
};

export default generateToken;
