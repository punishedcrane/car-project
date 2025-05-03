import Vehicle from '../models/Vehicle.js';
import { uploadToCloudinary } from '../utils/imageUpload.js';

// @desc    Get all vehicles
// @route   GET /api/vehicles
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vehicles' });
  }
};

// @desc    Get featured vehicles
// @route   GET /api/vehicles/featured
export const getFeaturedVehicles = async (req, res) => {
  try {
    const featured = await Vehicle.find({ isFeatured: true });
    res.json(featured);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch featured vehicles' });
  }
};

// @desc    Get new arrival vehicles
// @route   GET /api/vehicles/new
export const getNewVehicles = async (req, res) => {
  try {
    const newVehicles = await Vehicle.find({ isNewArrival: true });
    res.json(newVehicles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch new vehicles' });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle' });
  }
};

// @desc    Create a new vehicle
// @route   POST /api/vehicles/add
export const createVehicle = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.admin) {
      return res.status(401).json({ message: 'Admin not authenticated' });
    }

    const {
      carName,
      carType,
      payPerDay,
      initialPrice,
      quality,
      description,
      gear,
      fuel,
      isElectric,
      isFeatured,
      isNewArrival,
      available,
    } = req.body;

    // Convert string values to appropriate types
    const payPerDayNum = parseFloat(payPerDay);
    const initialPriceNum = parseFloat(initialPrice);
    const isElectricBool = isElectric === 'true' || isElectric === true;
    const isFeaturedBool = isFeatured === 'true' || isFeatured === true;
    const isNewArrivalBool = isNewArrival === 'true' || isNewArrival === true;
    const availableBool = available === 'true' || available === true;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    let imageUrl = '';
    try {
      // Upload buffer directly to Cloudinary
      console.log('Uploading to Cloudinary from memory buffer');
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ message: 'Image upload failed', error: uploadError.message });
    }

    // Create new vehicle with image URL from Cloudinary
    const newVehicle = new Vehicle({
      carName,
      carType,
      payPerDay: payPerDayNum,
      initialPrice: initialPriceNum,
      quality,
      image: imageUrl,
      description,
      gear,
      fuel,
      isElectric: isElectricBool,
      isFeatured: isFeaturedBool,
      isNewArrival: isNewArrivalBool,
      available: availableBool,
      addedBy: req.admin._id,
    });

    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({ message: 'Failed to add vehicle', error: error.message });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
export const updateVehicle = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ message: 'Admin not authenticated' });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const {
      carName,
      carType,
      payPerDay,
      initialPrice,
      quality,
      description,
      gear,
      fuel,
      isElectric,
      isFeatured,
      isNewArrival,
      available,
    } = req.body;

    // Update vehicle fields if provided
    if (carName) vehicle.carName = carName;
    if (carType) vehicle.carType = carType;
    if (payPerDay) vehicle.payPerDay = parseFloat(payPerDay);
    if (initialPrice) vehicle.initialPrice = parseFloat(initialPrice);
    if (quality) vehicle.quality = quality;
    if (description) vehicle.description = description;
    if (gear) vehicle.gear = gear;
    if (fuel) vehicle.fuel = fuel;
    
    // Handle boolean fields properly
    if (isElectric !== undefined) vehicle.isElectric = isElectric === 'true' || isElectric === true;
    if (isFeatured !== undefined) vehicle.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isNewArrival !== undefined) vehicle.isNewArrival = isNewArrival === 'true' || isNewArrival === true;
    if (available !== undefined) vehicle.available = available === 'true' || available === true;

    // Update image if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        vehicle.image = result.secure_url;
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(500).json({ message: 'Image upload failed', error: uploadError.message });
      }
    }

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ message: 'Failed to update vehicle', error: error.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
export const deleteVehicle = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ message: 'Admin not authenticated' });
    }
    
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ message: 'Failed to delete vehicle' });
  }
};

// @desc    Search vehicles by name
// @route   GET /api/vehicles/search/:keyword
export const searchVehicles = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const regex = new RegExp(keyword, 'i'); // Case-insensitive search
    
    const vehicles = await Vehicle.find({
      $or: [
        { carName: { $regex: regex } },
        { carType: { $regex: regex } },
        { description: { $regex: regex } }
      ]
    });
    
    res.json(vehicles);
  } catch (error) {
    console.error("Error searching vehicles:", error);
    res.status(500).json({ message: 'Failed to search vehicles' });
  }
};

// @desc    Filter vehicles by criteria
// @route   POST /api/vehicles/filter
export const filterVehicles = async (req, res) => {
  try {
    const { minPrice, maxPrice, carType, gear, fuel, isElectric } = req.body;
    
    // Build filter object
    const filter = {};
    
    if (minPrice !== undefined && maxPrice !== undefined) {
      filter.payPerDay = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== undefined) {
      filter.payPerDay = { $gte: minPrice };
    } else if (maxPrice !== undefined) {
      filter.payPerDay = { $lte: maxPrice };
    }
    
    if (carType) filter.carType = carType;
    if (gear) filter.gear = gear;
    if (fuel) filter.fuel = fuel;
    if (isElectric !== undefined) filter.isElectric = isElectric;
    
    const vehicles = await Vehicle.find(filter);
    res.json(vehicles);
  } catch (error) {
    console.error("Error filtering vehicles:", error);
    res.status(500).json({ message: 'Failed to filter vehicles' });
  }
};