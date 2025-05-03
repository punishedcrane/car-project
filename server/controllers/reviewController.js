// server/controllers/reviewController.js

import Review from '../models/reviewModel.js';
import mongoose from 'mongoose';

// @desc    Create a review
// @route   POST /api/reviews/:vehicleId
// @access  Private
export const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { vehicleId } = req.params;

  // Validate vehicleId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    return res.status(400).json({ message: 'Invalid vehicle ID' });
  }

  // Make sure we have a user
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'User not authenticated properly' });
  }

  try {
    // Check if user has already reviewed this vehicle
    const existingReview = await Review.findOne({
      userId: req.user._id,
      vehicleId: vehicleId
    });

    if (existingReview) {
      // Update existing review instead of creating new one
      existingReview.rating = Number(rating);
      existingReview.comment = comment;
      existingReview.updatedAt = Date.now();
      
      const updatedReview = await existingReview.save();
      return res.status(200).json(updatedReview);
    }

    // Create new review
    const review = new Review({
      userId: req.user._id,
      vehicleId: vehicleId,
      rating: Number(rating),
      comment
    });

    const createdReview = await review.save();
    
    // Populate user data before sending response
    const populatedReview = await Review.findById(createdReview._id)
      .populate('userId', 'name email');
      
    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error while creating review' });
  }
};

// @desc    Get all reviews for a vehicle
// @route   GET /api/reviews/:vehicleId
// @access  Public
export const getReviewsByVehicle = async (req, res) => {
  const { vehicleId } = req.params;

  // Validate vehicleId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    return res.status(400).json({ message: 'Invalid vehicle ID' });
  }

  try {
    const reviews = await Review.find({ vehicleId: vehicleId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 }); // Sort by newest first
      
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private (only review owner)
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return res.status(400).json({ message: 'Invalid review ID' });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'User not authenticated properly' });
  }

  try {
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user is the owner of the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    
    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error while deleting review' });
  }
};