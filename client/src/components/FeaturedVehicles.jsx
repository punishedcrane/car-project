import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VehicleCard from '../pages/VehicleCard';
import { useNavigate } from 'react-router-dom';

const FeaturedVehicles = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');
    const adminFromStorage = localStorage.getItem('admin');
    
    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage));
    }
    
    if (adminFromStorage) {
      setAdmin(JSON.parse(adminFromStorage));
    }
  }, []);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/vehicles`);
        const featured = data.filter(vehicle => vehicle.isFeatured);
        setFeaturedVehicles(featured.slice(0, 8));
      } catch (error) {
        console.error('Failed to fetch featured vehicles', error);
      }
    };

    if (user || admin) {
      fetchFeaturedVehicles();
    }
  }, [user, admin, BACKEND_URL]);

  if (!user && !admin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center font-goldman">
        Featured Vehicles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredVehicles.map(vehicle => (
          <VehicleCard 
            key={vehicle._id} 
            vehicle={vehicle} 
            isAdmin={!!admin}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedVehicles;
