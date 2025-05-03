import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaCar, FaGasPump, FaCogs, FaCalendarAlt, FaClock, FaShieldAlt, FaStar, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import ReviewSection from '../components/ReviewSection'; // Import the ReviewSection component

const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles/${id}`);
        setVehicle(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600">The vehicle you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const calculateRentalDays = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const diffTime = Math.abs(endDateObj - startDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const rentalDays = startDate && endDate ? calculateRentalDays(startDate, endDate) : 0;
  const pricePerDay = vehicle.payPerDay;
  const totalPrice = rentalDays * pricePerDay;

  const dollarPricePerDay = pricePerDay;
  const dollarTotalPrice = totalPrice;

  const handleBooking = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    window.location.href = `/booking/${vehicle._id}?start=${startDate}&end=${endDate}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const getMinEndDate = () => {
    if (startDate) {
      const minEnd = new Date(startDate);
      minEnd.setDate(minEnd.getDate() + 1);
      return minEnd.toISOString().split('T')[0];
    }
    return tomorrowStr;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-96">
          <img
            src={vehicle.image}
            alt={vehicle.carName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-4xl font-bold">{vehicle.carName}</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center">
                  <FaCar className="text-blue-600 text-xl mb-1" />
                  <span className="text-sm font-medium">{vehicle.carType}</span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center">
                  <FaCogs className="text-blue-600 text-xl mb-1" />
                  <span className="text-sm font-medium">{vehicle.gear}</span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center">
                  <FaGasPump className="text-blue-600 text-xl mb-1" />
                  <span className="text-sm font-medium">{vehicle.fuel}</span>
                </div>
                {vehicle.isElectric && (
                  <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center">
                    <span className="text-blue-600 text-xl mb-1">⚡</span>
                    <span className="text-sm font-medium">Electric</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{vehicle.description || "Experience the perfect blend of comfort, style, and performance with this exceptional vehicle. Ideal for both city driving and long road trips, this car will make your journey comfortable and enjoyable."}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-3">What's included</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center">
                  <FaShieldAlt className="text-green-600 mr-2" />
                  <span>Insurance included</span>
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="text-green-600 mr-2" />
                  <span>24/7 roadside assistance</span>
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="text-green-600 mr-2" />
                  <span>Free cancellation</span>
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="text-green-600 mr-2" />
                  <span>Unlimited mileage</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky top-20 self-start">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">$</span>{dollarPricePerDay}
                <span className="text-gray-500 text-base font-normal">/day</span>
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-600" /> Start Date
                  </label>
                  <input 
                    type="date" 
                    value={startDate} 
                    min={tomorrowStr}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate && new Date(endDate) <= new Date(e.target.value)) {
                        setEndDate('');
                      }
                    }} 
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center">
                    <FaClock className="mr-2 text-blue-600" /> End Date
                  </label>
                  <input 
                    type="date" 
                    value={endDate}
                    min={getMinEndDate()}
                    disabled={!startDate}
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                {startDate && endDate ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">${dollarPricePerDay} × {rentalDays} days</span>
                      <span>${dollarTotalPrice}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-lg">${dollarTotalPrice}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 text-sm py-2">
                    Select dates to see total price
                  </div>
                )}
              </div>

              <button 
                onClick={handleBooking}
                disabled={!startDate || !endDate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Book Now <FaArrowRight className="ml-2" />
              </button>
              
              {!startDate || !endDate ? (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Please select both dates to continue
                </p>
              ) : (
                <p className="text-sm text-gray-500 text-center mt-2">
                  {formatDate(startDate)} to {formatDate(endDate)} · {rentalDays} day{rentalDays !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ReviewSection vehicleId={id} />
    </div>
  );
};

export default VehicleDetail;
