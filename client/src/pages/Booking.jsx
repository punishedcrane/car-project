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

  const query = new URLSearchParams(location.search);
  const startDate = query.get('start');
  const endDate = query.get('end');

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

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
          withCredentials: true
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
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

    setProcessingPayment(true);

    try {
      const stripe = await stripePromise;
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/stripe/create-checkout-session`,
        {
          vehicle: {
            _id: vehicle._id,
            name: vehicle.carName,
            price: vehicle.payPerDay
          },
          userId: user?._id || 'guest',
          startDate,
          endDate
        },
        { withCredentials: true }
      );

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
      {/* ... existing UI code unchanged ... */}
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
  );
};

export default Booking;
