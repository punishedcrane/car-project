import mongoose from 'mongoose';

const vehicleSchema = mongoose.Schema(
  {
    carName: { type: String, required: true },
    carType: { type: String, required: true },
    payPerDay: { type: Number, required: true },
    initialPrice: { type: Number, required: true },
    quality: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    gear: { type: String, required: true },
    fuel: { type: String, required: true },
    isElectric: { type: Boolean, required: true },
    isFeatured: { type: Boolean, required: true },
    isNewArrival: { type: Boolean, required: true },
    available: { type: Boolean, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }, // Reference to the Admin who added the vehicle
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
