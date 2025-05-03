import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  const checkAuthStatus = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const admin = JSON.parse(localStorage.getItem('admin'));

    if (admin) {
      setIsLoggedIn(true);
      setIsAdmin(true);
    } else if (user) {
      setIsLoggedIn(true);
      setUserRole(user.role);
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserRole(null);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      if (isAdmin) {
        await axios.post(`${BASE_URL}/api/admin/logout`);
        localStorage.removeItem('admin');
        setIsAdmin(false);
      } else {
        await axios.post(`${BASE_URL}/api/user/logout`);
        localStorage.removeItem('user');
        setUserRole(null);
      }

      setIsLoggedIn(false);
      setMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between font-goldman">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="https://res.cloudinary.com/dysu1piy1/image/upload/v1746105711/Screenshot_2025-04-27_114127-removebg-preview_jxa3jg.png" 
              alt="Gear Up Logo" 
              className="h-8 w-auto mr-2"
            />
            <span className="text-white text-xl font-bold">GEAR UP</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-gray-200 transition-colors">Home</Link>
          <Link to="/vehicles" className="text-white hover:text-gray-200 transition-colors">Vehicles</Link>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-white hover:text-yellow-300 transition-colors">Login</Link>
              <Link to="/register" className="text-white hover:text-yellow-300 transition-colors">Register</Link>
            </>
          ) : (
            <>
              {isAdmin ? (
                <Link to="/admin/dashboard" className="text-white hover:text-gray-200 transition-colors">Admin Dashboard</Link>
              ) : userRole === 'dealer' ? (
                <Link to="/dealer/dashboard" className="text-white hover:text-gray-200 transition-colors">Dealer Dashboard</Link>
              ) : null}

              <Link to="/profile" className="text-white hover:text-gray-200 transition-colors">Profile</Link>
              <button 
                onClick={handleLogout}
                className="text-white hover:text-yellow-300 transition-colors bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-white hover:bg-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-blue-400">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-white hover:text-gray-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/vehicles" 
              className="text-white hover:text-gray-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vehicles
            </Link>

            {!isLoggedIn ? (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-yellow-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-white hover:text-yellow-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {isAdmin ? (
                  <Link 
                    to="/admin/dashboard" 
                    className="text-white hover:text-gray-200 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : userRole === 'dealer' ? (
                  <Link 
                    to="/dealer/dashboard" 
                    className="text-white hover:text-gray-200 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dealer Dashboard
                  </Link>
                ) : null}

                <Link 
                  to="/profile" 
                  className="text-white hover:text-gray-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-left text-white hover:text-yellow-300 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
