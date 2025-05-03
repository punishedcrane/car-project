import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ReviewSection = ({ vehicleId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      try {
        const userData = JSON.parse(userJSON);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/reviews/${vehicleId}`);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        if (error.response?.status !== 401) {
          toast.error('Failed to load reviews');
        }
      }
    };

    if (vehicleId) {
      fetchReviews();
    }
  }, [vehicleId, BACKEND_URL]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.warning('Please login to submit a review');
      return;
    }

    if (rating < 1 || !comment.trim()) {
      toast.warning('Please provide both rating and comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        withCredentials: true
      };

      await axios.post(
        `${BACKEND_URL}/api/reviews/${vehicleId}`,
        { rating, comment },
        config
      );

      const { data } = await axios.get(`${BACKEND_URL}/api/reviews/${vehicleId}`);
      setReviews(data);

      setRating(5);
      setComment('');
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit review');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Reviews</h2>

      {/* Submit Review Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Write a Review</h3>

        {!user ? (
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <p>Please <a href="/login" className="text-blue-600 hover:underline">login</a> to submit a review.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Rating</label>
              <div className="flex">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <div key={index} className="cursor-pointer">
                      <FaStar
                        size={24}
                        className="mr-1"
                        color={ratingValue <= (hover || rating) ? "#FFB800" : "#e4e5e9"}
                        onClick={() => setRating(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium mb-2 text-gray-700">Your Review</label>
              <textarea
                id="comment"
                rows="4"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Share your experience with this vehicle..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="reviews-container">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {reviews.length > 0 ? `${reviews.length} Reviews` : 'No reviews yet'}
        </h3>

        {reviews.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-500">Be the first to review this vehicle!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-5 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            size={18}
                            color={index < review.rating ? "#FFB800" : "#e4e5e9"}
                            className="mr-1"
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium text-gray-700">
                        {review.userId?.name || 'Anonymous'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
