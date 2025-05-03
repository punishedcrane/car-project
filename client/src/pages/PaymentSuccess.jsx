import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHome } from 'react-icons/fa';

const PaymentSuccess = () => {
  useEffect(() => {
    // You could potentially fetch the booking details here
    // based on some session ID or other identifier
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>
        
        <h1 className="mt-6 text-3xl font-bold text-gray-900">Payment Successful!</h1>
        
        <p className="mt-4 text-gray-600">
          Your car rental booking has been confirmed. Thank you for choosing our service!
        </p>
        
        <p className="mt-2 text-gray-600">
          A confirmation email with all your booking details has been sent to your registered email address.
        </p>
        
        <div className="mt-8">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <FaHome />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;