import { Link, useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaArrowLeft, FaHome } from 'react-icons/fa';

const PaymentCancel = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page (likely the booking page)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center">
          <FaTimesCircle className="text-red-500 text-6xl" />
        </div>
        
        <h1 className="mt-6 text-3xl font-bold text-gray-900">Payment Cancelled</h1>
        
        <p className="mt-4 text-gray-600">
          Your payment process was cancelled. No charges have been made to your account.
        </p>
        
        <p className="mt-2 text-gray-600">
          If you experienced any issues during the payment process, please contact our support team.
        </p>
        
        <div className="mt-8 space-y-3">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <FaArrowLeft />
            Return to Booking
          </button>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            <FaHome />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;