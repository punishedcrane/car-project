import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleAdminToggle = () => {
    setIsAdmin(!isAdmin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      let response;
      
      if (isAdmin) {
        // Admin login
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
          formData,
          { withCredentials: true } // 👈 IMPORTANT: accept cookies
        );
        console.log('Admin login successful:', response.data);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        navigate('/admin/dashboard');
      } else {
        // Regular user or dealer login
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
          formData,
          { withCredentials: true } // 👈 IMPORTANT: accept cookies
        );
        console.log('Login successful:', response.data);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (response.data.user.role === 'dealer') {
          navigate('/dealer/dashboard');
        } else {
          navigate('/'); // Regular user goes to home page
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dysu1piy1/image/upload/v1746203685/pexels-vladalex94-1402787_b5jutc.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-md px-4">
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Login as:</span>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={handleAdminToggle}
                    className="mr-2"
                  />
                  <span>Admin</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
          
          <div className="mt-4 text-center text-gray-600">
            <p>Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
