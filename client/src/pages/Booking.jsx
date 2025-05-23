import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { FaCar, FaGasPump, FaCogs, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Booking = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [vehicle, setVehicle] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState(null);

  const query = new URLSearchParams(location.search);
  const startDate = query.get('start');
  const endDate = query.get('end');

  useEffect(() => {
    const checkUserSession = () => {
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        try {
          setUser(JSON.parse(userFromStorage));
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    };

    const fetchVehicle = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles/${id}`);
        setVehicle(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        setError('Failed to fetch vehicle details');
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
          withCredentials: true
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        // Not setting an error here as we may already have user from localStorage
        checkUserSession();
      }
    };

    fetchVehicle();
    fetchUser();
  }, [id]);

  const calculateRentalDays = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const diffTime = Math.abs(endDateObj - startDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const rentalDays = calculateRentalDays(startDate, endDate);
  const totalPrice = vehicle ? rentalDays * vehicle.payPerDay : 0;

  const handleCheckout = async () => {
    if (!vehicle || !startDate || !endDate) {
      alert('Missing booking information!');
      return;
    }

    if (!user || !user._id) {
      setError("You must be logged in to book a vehicle");
      navigate('/login');
      return;
    }

    setProcessingPayment(true);
    setError(null);
    setDebug(null);

    try {
      const paymentData = {
        vehicle: {
          _id: vehicle._id,
          name: vehicle.carName,  // Match backend expectation
          price: vehicle.payPerDay  // Match backend expectation
        },
        userId: user._id,
        startDate,
        endDate
      };
      
      console.log("Creating checkout session with data:", paymentData);
      setDebug("Sending payment request...");
      
      const stripe = await stripePromise;
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/stripe/create-checkout-session`,
        paymentData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Checkout session response:", response.data);
      setDebug(prev => prev + "\nReceived session ID");
      
      const { id: sessionId } = response.data;
      
      if (!sessionId) {
        throw new Error('No session ID returned from server');
      }

      setDebug(prev => prev + "\nRedirecting to Stripe...");
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe redirect error:', error);
        setError(`Payment failed: ${error.message}`);
        setDebug(prev => prev + "\nStripe redirect error: " + error.message);
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      let errorMessage = "Unable to process payment";
      
      if (err.response) {
        console.log("Response error data:", err.response.data);
        errorMessage += `: ${err.response.data.message || err.response.statusText}`;
        setDebug(JSON.stringify(err.response.data, null, 2));
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading booking details...</div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-red-600">Vehicle not found or booking information is invalid.</div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Booking Details</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{vehicle.carName}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <img 
                src={vehicle.image} 
                alt={vehicle.carName}
                className="w-full h-auto rounded-md"
              />
            </div>
            
            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FaCar className="text-blue-500" />
                  <span className="font-medium">Model:</span> {vehicle.carType}
                </div>
                
                <div className="flex items-center gap-2">
                  <FaGasPump className="text-blue-500" />
                  <span className="font-medium">Fuel Type:</span> {vehicle.fuelType}
                </div>
                
                <div className="flex items-center gap-2">
                  <FaCogs className="text-blue-500" />
                  <span className="font-medium">Transmission:</span> {vehicle.transmission}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center gap-2 text-xl">
                  <span className="font-bold">${vehicle.payPerDay}</span>
                  <span className="text-gray-500">per day</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-xl font-semibold mb-4">Rental Period</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">{formatDate(startDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-medium">{formatDate(endDate)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span>Days:</span>
                <span>{rentalDays}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Rate per day:</span>
                <span>${vehicle.payPerDay}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${totalPrice}</span>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {debug && import.meta.env.DEV && (
              <div className="mt-4 p-3 bg-gray-100 text-gray-700 rounded-md text-xs font-mono whitespace-pre-wrap">
                <p className="font-semibold mb-1">Debug Info:</p>
                {debug}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 flex flex-col md:flex-row justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md transition-colors duration-200 hover:bg-gray-100"
            disabled={processingPayment}
          >
            Cancel
          </button>
          <button 
            onClick={handleCheckout}
            disabled={processingPayment}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-400"
          >
            {processingPayment ? "Processing..." : (<><FaCreditCard /> Proceed to Payment</>)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;