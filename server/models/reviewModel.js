// server/models/reviewModel.js

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  vehicleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Vehicle", 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // This automatically manages createdAt and updatedAt
});

// Add index for faster queries
reviewSchema.index({ vehicleId: 1 });
reviewSchema.index({ userId: 1, vehicleId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;