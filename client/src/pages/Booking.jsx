import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { FaCar, FaGasPump, FaCogs, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';

// Initialize Stripe with your public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Booking = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [vehicle, setVehicle] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Get the dates from URL parameters
  const query = new URLSearchParams(location.search);
  const startDate = query.get('start');
  const endDate = query.get('end');

  useEffect(() => {
    // Fetch the vehicle details
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

    // Fetch current user info if needed
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        // Handle not logged in case if needed
      }
    };

    fetchVehicle();
    fetchUser();
  }, [id]);

  // Calculate the rental duration and total price
  const calculateRentalDays = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const diffTime = Math.abs(endDateObj - startDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum 1 day
  };

  const rentalDays = calculateRentalDays(startDate, endDate);
  const totalPrice = vehicle ? rentalDays * vehicle.payPerDay : 0;

  // Handle the Stripe checkout process
  const handleCheckout = async () => {
    if (!vehicle || !startDate || !endDate) {
      alert('Missing booking information!');
      return;
    }

    setProcessingPayment(true);

    try {
      const stripe = await stripePromise;
      
      // Create a checkout session
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/stripe/create-checkout-session`, {
        vehicle: {
          _id: vehicle._id,
          name: vehicle.carName,
          price: vehicle.payPerDay
        },
        userId: user?._id || 'guest', 
        startDate: startDate,
        endDate: endDate
      });

      // Redirect to Stripe checkout
      const { id: sessionId } = response.data;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe redirect error:', error);
        alert('Payment failed: ' + error.message);
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      alert('Unable to process payment. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Handle canceling the booking
  const handleCancel = () => {
    navigate(-1); // Go back to previous page
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

  // Format dates for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Booking Confirmation</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Vehicle Summary */}
        <div className="border-b border-gray-200">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.carName} 
                  className="w-full h-48 object-cover rounded-lg shadow"
                />
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl font-semibold">{vehicle.carName}</h2>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-1 text-gray-600">
                    <FaCar className="text-blue-600" />
                    <span>{vehicle.carType}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FaGasPump className="text-blue-600" />
                    <span>{vehicle.fuel}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FaCogs className="text-blue-600" />
                    <span>{vehicle.gear}</span>
                  </div>
                </div>
                <div className="mt-2 text-gray-600">{vehicle.description}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Details */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-blue-600 mr-2" />
                <span className="font-medium">Pickup Date:</span>
                <span className="ml-2">{formatDate(startDate)}</span>
              </div>
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-blue-600 mr-2" />
                <span className="font-medium">Return Date:</span>
                <span className="ml-2">{formatDate(endDate)}</span>
              </div>
              <div className="flex items-center mb-2">
                <span className="font-medium">Duration:</span>
                <span className="ml-2">{rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-2">
                <span className="font-medium">Rate per day:</span>
                <span className="ml-2">₹{vehicle.payPerDay.toLocaleString()}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Number of days:</span>
                <span className="ml-2">{rentalDays}</span>
              </div>
              <div className="font-bold text-lg mt-2">
                <span>Total Amount:</span>
                <span className="ml-2 text-blue-600">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Button */}
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
            {processingPayment ? (
              <>Processing...</>
            ) : (
              <>
                <FaCreditCard />
                Proceed to Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
