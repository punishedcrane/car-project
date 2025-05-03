import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
} from '../controllers/adminController.js';
import { adminProtect } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/profile', adminProtect, getAdminProfile); // ✅ New

export default router;
