// Vehicle.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import VehicleCard from './VehicleCard';
import SearchFilters from './SearchFilters';

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedQuality, setSelectedQuality] = useState('');
  const [isElectric, setIsElectric] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [sortOrder, setSortOrder] = useState('');

  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/api/vehicles`);
        setVehicles(data);
        setFilteredVehicles(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch vehicles');
        toast.error('Failed to fetch vehicles');
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [BASE_URL]);

  useEffect(() => {
    let result = [...vehicles];

    if (searchQuery) {
      result = result.filter(vehicle => 
        vehicle.carName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedQuality) {
      result = result.filter(vehicle => vehicle.quality === selectedQuality);
    }

    if (isElectric) {
      result = result.filter(vehicle => vehicle.isElectric);
    }
    
    if (isFeatured) {
      result = result.filter(vehicle => vehicle.isFeatured);
    }
    
    if (isNewArrival) {
      result = result.filter(vehicle => vehicle.isNewArrival);
    }

    if (sortOrder === 'lowToHigh') {
      result.sort((a, b) => a.payPerDay - b.payPerDay);
    } else if (sortOrder === 'highToLow') {
      result.sort((a, b) => b.payPerDay - a.payPerDay);
    }

    setFilteredVehicles(result);
  }, [vehicles, searchQuery, selectedQuality, isElectric, isFeatured, isNewArrival, sortOrder]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedQuality('');
    setIsElectric(false);
    setIsFeatured(false);
    setIsNewArrival(false);
    setSortOrder('');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 md:h-24 md:w-24 lg:h-32 lg:w-32 border-t-4 border-b-4 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-red-500">
          <p className="text-red-500 text-lg md:text-xl font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user && !admin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-amber-200 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Authentication Required</h2>
          <p className="text-gray-600 mb-8">Please log in or register to view our premium vehicle collection.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/login')} 
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out mb-3 sm:mb-0 w-full sm:w-auto"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-12">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 font-goldman">
            Premium CAR Collection
          </h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our carefully selected fleet of premium vehicles for your next journey
          </p>
        </div>
        
        <SearchFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedQuality={selectedQuality}
          setSelectedQuality={setSelectedQuality}
          isElectric={isElectric}
          setIsElectric={setIsElectric}
          isFeatured={isFeatured}
          setIsFeatured={setIsFeatured}
          isNewArrival={isNewArrival}
          setIsNewArrival={setIsNewArrival}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          resetFilters={resetFilters}
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          totalVehicles={vehicles.length}
          filteredCount={filteredVehicles.length}
        />
        
        {filteredVehicles.length === 0 ? (
          <div className="bg-white p-10 rounded-lg shadow-md text-center max-w-2xl mx-auto border border-amber-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-700 mb-4">No vehicles match your criteria</p>
            <p className="text-gray-500 mb-6">Try adjusting your filters to find the perfect vehicle.</p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard 
                key={vehicle._id} 
                vehicle={vehicle} 
                isAdmin={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicle;
