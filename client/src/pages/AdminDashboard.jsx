import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [vehicles, setVehicles] = useState([]); 
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [formData, setFormData] = useState({
    carName: '',
    carType: '',
    payPerDay: '',
    initialPrice: '',
    quality: '',
    image: null,
    imagePreview: '',
    description: '',
    gear: 'Manual',
    fuel: 'Petrol',
    isElectric: false,
    isFeatured: false,
    isNewArrival: false,
    available: true
  });

  
  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
  });

 
  useEffect(() => {
    const fetchAdminAndVehicles = async () => {
      try {
        
        const profileRes = await api.get('/api/admin/profile');
        setAdmin(profileRes.data);

        
        const vehiclesRes = await api.get('/api/vehicles');
        
        setVehicles(Array.isArray(vehiclesRes.data) ? vehiclesRes.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
        setVehicles([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminAndVehicles();
  }, []);


  const handleLogout = async () => {
    try {
      await api.post('/api/admin/logout', {});
      toast.success('Logged out successfully');
      window.location.href = '/admin/login';
    } catch (error) {
      toast.error('Logout failed');
    }
  };

 
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files[0]) {
      
      setFormData({
        ...formData,
        image: files[0],
        imagePreview: URL.createObjectURL(files[0])
      });
    } else if (type === 'checkbox') {
      
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  
  const resetForm = () => {
    setFormData({
      carName: '',
      carType: '',
      payPerDay: '',
      initialPrice: '',
      quality: '',
      image: null,
      imagePreview: '',
      description: '',
      gear: 'Manual',
      fuel: 'Petrol',
      isElectric: false,
      isFeatured: false,
      isNewArrival: false,
      available: true
    });
    setEditMode(false);
    setCurrentVehicle(null);
  };

  
  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      resetForm();
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
     
      Object.keys(formData).forEach(key => {
        if (key !== 'imagePreview') {
          formDataToSend.append(key, formData[key]);
        }
      });

      let response;
      
      if (editMode) {
        
        response = await api.put(
          `/api/vehicles/${currentVehicle._id}`,
          formDataToSend,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        
        
        const updatedVehicles = Array.isArray(vehicles) ? vehicles : [];
        setVehicles(updatedVehicles.map(v => 
          v._id === currentVehicle._id ? response.data : v
        ));
        
        toast.success('Vehicle updated successfully');
      } else {
        
        response = await api.post('/api/vehicles/add', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        
        const updatedVehicles = Array.isArray(vehicles) ? vehicles : [];
        setVehicles([...updatedVehicles, response.data]);
        
        toast.success('Vehicle added successfully');
      }
      
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Operation failed:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleEdit = (vehicle) => {
    setCurrentVehicle(vehicle);
    setFormData({
      carName: vehicle.carName,
      carType: vehicle.carType,
      payPerDay: vehicle.payPerDay,
      initialPrice: vehicle.initialPrice,
      quality: vehicle.quality,
      image: null,
      imagePreview: vehicle.image,
      description: vehicle.description,
      gear: vehicle.gear,
      fuel: vehicle.fuel,
      isElectric: vehicle.isElectric,
      isFeatured: vehicle.isFeatured,
      isNewArrival: vehicle.isNewArrival,
      available: vehicle.available
    });
    setEditMode(true);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setIsLoading(true);
      try {
        await api.delete(`/api/vehicles/${id}`);
        
        const updatedVehicles = Array.isArray(vehicles) ? vehicles : [];
        setVehicles(updatedVehicles.filter(v => v._id !== id));
        toast.success('Vehicle deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error('Failed to delete vehicle');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Helper function to safely count vehicles with a specific property
  const countVehicles = (property) => {
    if (!Array.isArray(vehicles)) return 0;
    return vehicles.filter(v => v[property]).length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 p-4 rounded-md">
          <p className="text-red-700">Unauthorized. Please log in as admin.</p>
          <button 
            onClick={() => window.location.href = '/admin/login'}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Admin Header */}
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">Welcome, {admin.name}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-600">Total Vehicles</h3>
            <p className="text-2xl font-bold">{Array.isArray(vehicles) ? vehicles.length : 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-600">Featured Vehicles</h3>
            <p className="text-2xl font-bold">
              {countVehicles('isFeatured')}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-600">New Arrivals</h3>
            <p className="text-2xl font-bold">
              {countVehicles('isNewArrival')}
            </p>
          </div>
        </div>

        {/* Toggle Form Button */}
        <button 
          onClick={toggleForm}
          className="mb-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : editMode ? 'Cancel Edit' : 'Add New Vehicle'}
        </button>

        {/* Vehicle Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Car Name</label>
                    <input
                      type="text"
                      name="carName"
                      value={formData.carName}
                      onChange={handleChange}
                      required
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Car Type</label>
                    <input
                      type="text"
                      name="carType"
                      value={formData.carType}
                      onChange={handleChange}
                      required
                      className="mt-1 p-2 w-full border rounded-md"
                      placeholder="SUV, Sedan, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pay Per Day ($)</label>
                    <input
                      type="number"
                      name="payPerDay"
                      value={formData.payPerDay}
                      onChange={handleChange}
                      required
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Initial Price ($)</label>
                    <input
                      type="number"
                      name="initialPrice"
                      value={formData.initialPrice}
                      onChange={handleChange}
                      required
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quality</label>
                    <select
                      name="quality"
                      value={formData.quality}
                      onChange={handleChange}
                      required
                      className="mt-1 p-2 w-full border rounded-md"
                    >
                      <option value="">Select Quality</option>
                      <option value="Economy">Economy</option>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gear Type</label>
                    <select
                      name="gear"
                      value={formData.gear}
                      onChange={handleChange}
                      required
                      className="mt-1 p-2 w-full border rounded-md"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                    <select
                      name="fuel"
                      value={formData.fuel}
                      onChange={handleChange}
                      required
                      className="mt-1 p-2 w-full border rounded-md"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border rounded-md"
                      accept="image/*"
                      {...(editMode ? {} : { required: true })}
                    />
                    {formData.imagePreview && (
                      <img 
                        src={formData.imagePreview} 
                        alt="Preview" 
                        className="mt-2 h-24 w-auto object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isElectric"
                        name="isElectric"
                        checked={formData.isElectric}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label htmlFor="isElectric" className="ml-2 text-sm">Electric</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label htmlFor="isFeatured" className="ml-2 text-sm">Featured</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isNewArrival"
                        name="isNewArrival"
                        checked={formData.isNewArrival}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label htmlFor="isNewArrival" className="ml-2 text-sm">New Arrival</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="available"
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label htmlFor="available" className="ml-2 text-sm">Available</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description - Full Width */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="mt-1 p-2 w-full border rounded-md"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : (editMode ? 'Update Vehicle' : 'Add Vehicle')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vehicle List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="p-4 bg-gray-50 border-b text-lg font-semibold">Vehicle Inventory</h2>
          
          {!Array.isArray(vehicles) || vehicles.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No vehicles found. Add your first vehicle!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Daily Price</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.carName} 
                          className="h-16 w-24 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2 font-medium">{vehicle.carName}</td>
                      <td className="px-4 py-2">{vehicle.carType}</td>
                      <td className="px-4 py-2">${vehicle.payPerDay}</td>
                      <td className="px-4 py-2">
                        <span 
                          className={`px-2 py-1 rounded text-xs ${
                            vehicle.available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {vehicle.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(vehicle)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;