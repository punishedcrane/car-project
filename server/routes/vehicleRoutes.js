import express from 'express';
import { 
  getVehicles, 
  getVehicleById, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle, 
  getFeaturedVehicles, 
  getNewVehicles,
  searchVehicles,
  filterVehicles
} from '../controllers/vehicleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminProtect } from '../middleware/adminMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Public Routes
router.get('/', getVehicles);
router.get('/featured', getFeaturedVehicles);
router.get('/new', getNewVehicles);
router.get('/search/:keyword', searchVehicles);
router.post('/filter', filterVehicles);
router.get('/:id', getVehicleById);

// Admin Routes - All protected with adminProtect middleware
router.post('/add', adminProtect, upload.single('image'), createVehicle);
router.put('/:id', adminProtect, upload.single('image'), updateVehicle);
router.delete('/:id', adminProtect, deleteVehicle);

export default router;