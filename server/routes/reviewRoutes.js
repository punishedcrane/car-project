// server/routes/reviewRoutes.js

import express from 'express';
import { 
  createReview, 
  getReviewsByVehicle,
  deleteReview 
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a review (only logged-in users)
router.post('/:vehicleId', protect, createReview);

// Get all reviews for a vehicle (public)
router.get('/:vehicleId', getReviewsByVehicle);

// Delete a review (only review owner)
router.delete('/:reviewId', protect, deleteReview);

export default router;