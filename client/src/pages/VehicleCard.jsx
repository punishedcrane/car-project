// VehicleCard.jsx - With updated styling
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdElectricCar, MdStars, MdFiberNew, MdAccessTime, MdMonetizationOn } from 'react-icons/md';
import { FaCarSide, FaGasPump } from 'react-icons/fa';

const VehicleCard = ({ vehicle, isAdmin }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/vehicle/${vehicle._id}`);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border border-amber-200">
      {/* Gold accent on top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"></div>
      
      {/* Card Image */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={vehicle.image} 
          alt={vehicle.carName} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
        
        {/* Feature Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {vehicle.isElectric && (
            <span className="bg-green-500 text-white text-xs px-2.5 py-1 rounded-full flex items-center shadow-md">
              <MdElectricCar className="mr-1" size={14} />Electric
            </span>
          )}
          {vehicle.isFeatured && (
            <span className="bg-amber-500 text-white text-xs px-2.5 py-1 rounded-full flex items-center shadow-md">
              <MdStars className="mr-1" size={14} />Featured
            </span>
          )}
          {vehicle.isNewArrival && (
            <span className="bg-green-500 text-white text-xs px-2.5 py-1 rounded-full flex items-center shadow-md">
              <MdFiberNew className="mr-1" size={14} />New
            </span>
          )}
        </div>
        
        {/* Quality Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`
            text-xs font-medium px-3 py-1 rounded-full shadow-md
            ${vehicle.quality === 'Luxury' ? 'bg-purple-600 text-white' : 
              vehicle.quality === 'Premium' ? 'bg-amber-500 text-white' :
              vehicle.quality === 'Standard' ? 'bg-blue-500 text-white' : 
              'bg-gray-500 text-white'}
          `}>
            {vehicle.quality}
          </span>
        </div>
      </div>
      
      {/* Card Body - New Styling */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{vehicle.carName}</h3>
        
        <div className="flex justify-between mb-3">
          <span className="text-sm text-gray-600">{vehicle.quality} • {vehicle.carType}</span>
          {vehicle.isElectric && (
            <span className="flex items-center text-green-600 text-sm">
              <MdElectricCar className="mr-1" />
              Electric
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-500">Initial Price:</p>
            <p className="text-lg font-semibold text-gray-800">
              ${vehicle.initialPrice ? vehicle.initialPrice.toLocaleString() : 'N/A'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Per Day:</p>
            <p className="text-xl font-bold text-amber-600">
              ${vehicle.payPerDay ? vehicle.payPerDay.toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleViewDetails}
          className="mt-4 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-2 rounded-lg font-medium transition-colors shadow-md"
        >
          View Details
        </button>
        
        {/* Availability */}
        {!vehicle.available && (
          <div className="mt-2 py-1 bg-red-50 border border-red-100 rounded text-center">
            <p className="text-red-500 text-xs font-medium">
              Currently unavailable
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;