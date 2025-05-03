import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const admin = JSON.parse(localStorage.getItem('admin'));
        const user = JSON.parse(localStorage.getItem('user'));

        if (admin) {
          try {
            const adminRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/admin/profile`,
              { withCredentials: true }
            );
            setProfile(adminRes.data);
            setIsAdmin(true);
            setLoading(false);
          } catch (adminError) {
            localStorage.removeItem('admin');
            setError('Your admin session has expired. Please login again.');
            setLoading(false);
            navigate('/login');
          }
        } else if (user) {
          try {
            const userRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
              { withCredentials: true }
            );
            setProfile(userRes.data);
            setIsAdmin(false);
            setLoading(false);
          } catch (userError) {
            localStorage.removeItem('user');
            setError('Your session has expired. Please login again.');
            setLoading(false);
            navigate('/login');
          }
        } else {
          setError('You must be logged in to view this page');
          setLoading(false);
          navigate('/login');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching your profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      if (isAdmin) {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/logout`,
          {},
          { withCredentials: true }
        );
        localStorage.removeItem('admin');
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/logout`,
          {},
          { withCredentials: true }
        );
        localStorage.removeItem('user');
      }
      navigate('/login');
    } catch (err) {
      setError('Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Error</h1>
          <p className="text-xl text-gray-600 mb-8">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-lg py-3 px-6 rounded-md transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6" style={{
      backgroundImage: `url('https://res.cloudinary.com/dysu1piy1/image/upload/v1745951640/wallpaperflare.com_wallpaper_1_ncgrxi.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="max-w-5xl mx-auto">
        {isAdmin ? (
          // Admin Profile
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-blue-700 px-8 py-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white font-goldman">Admin Dashboard</h1>
                <span className="bg-blue-800 text-white px-4 py-2 rounded-full text-lg font-medium">
                  Admin
                </span>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                    <div className="w-28 h-28 rounded-full bg-blue-200 flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-6 font-goldman">Admin Profile</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-base text-gray-500 font-medium">Name</p>
                        <p className="text-xl text-gray-700 font-goldman">{profile.name}</p>
                      </div>
                      <div>
                        <p className="text-base text-gray-500 font-medium">Email</p>
                        <p className="text-xl text-gray-700">{profile.email}</p>
                      </div>
                      <div>
                        <p className="text-base text-gray-500 font-medium">Admin ID</p>
                        <p className="text-xl text-gray-700">{profile._id}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col space-y-4">
                    <button
                      onClick={() => navigate('/admin/dashboard')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 px-4 rounded-md transition-colors"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 px-4 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
                <div>
                  <div className="bg-white p-8 rounded-lg shadow-md h-full flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://res.cloudinary.com/dysu1piy1/image/upload/v1745951548/josh-berquist-_4sWbzH5fp8-unsplash_u5s0et.jpg" 
                      alt="Luxury car" 
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // User Profile
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white font-goldman">My Profile</h1>
                <span className="bg-blue-400 bg-opacity-30 text-white px-4 py-2 rounded-full text-lg font-medium">
                  {profile.role === 'dealer' ? 'Dealer' : 'User'}
                </span>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                    <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-6">Personal Info</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-base text-gray-500 font-medium font-goldman">Name</p>
                        <p className="text-xl text-gray-700">{profile.name}</p>
                      </div>
                      <div>
                        <p className="text-base text-gray-500 font-medium">Email</p>
                        <p className="text-xl text-gray-700">{profile.email}</p>
                      </div>
                      <div>
                        <p className="text-base text-gray-500 font-medium">Phone</p>
                        <p className="text-xl text-gray-700">{profile.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-base text-gray-500 font-medium">Account Type</p>
                        <p className="text-xl text-gray-700 capitalize">{profile.role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col space-y-4">
                    <button
                      onClick={() => navigate('/vehicles')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 px-4 rounded-md transition-colors"
                    >
                      Browse Vehicles
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 px-4 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
                <div>
                  {profile.role === 'dealer' ? (
                    <div className="bg-white p-8 rounded-lg shadow-md h-full">
                      <h2 className="text-2xl font-semibold mb-6">Dealer Dashboard</h2>
                      <div className="grid grid-cols-1 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-4 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <div className="ml-6">
                              <h3 className="text-xl font-medium text-gray-800">My Listings</h3>
                              <p className="text-lg text-gray-500">Manage your vehicle listings</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-green-100 p-4 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="ml-6">
                              <h3 className="text-xl font-medium text-gray-800">Earnings</h3>
                              <p className="text-lg text-gray-500">Track your rental earnings</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-lg shadow-md h-full flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://res.cloudinary.com/dysu1piy1/image/upload/v1745951548/josh-berquist-_4sWbzH5fp8-unsplash_u5s0et.jpg" 
                        alt="Luxury car" 
                        className="object-cover w-full h-full rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
