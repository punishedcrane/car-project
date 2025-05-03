import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
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
        const adminData = {
          name: formData.name,
          email: formData.email,
          password: formData.password
        };
        response = await axios.post(`${API_BASE_URL}/api/admin/register`, adminData);
        console.log('Admin registration successful:', response.data);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        navigate('/admin/dashboard');
      } else {
        response = await axios.post(`${API_BASE_URL}/api/user/register`, formData);
        console.log('User registration successful:', response.data);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (formData.role === 'dealer') {
          navigate('/dealer/dashboard');
        } else {
          navigate('/');
        }
      }
      
      alert(`${isAdmin ? 'Admin' : formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} registration successful!`);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dysu1piy1/image/upload/v1746203967/pexels-pixabay-248747_yukgcw.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-md px-4">
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Register as:</span>
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
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
            />
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

          <div className="mb-4">
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

          {!isAdmin && (
            <>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Phone (optional)</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone number"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-semibold">Register as</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">Customer</option>
                  <option value="dealer">Dealer</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Register
          </button>
          
          <div className="mt-4 text-center text-gray-600">
            <p>Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login here</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
