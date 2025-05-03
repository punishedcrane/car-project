import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Gear Up</h3>
            <p className="text-gray-300 mb-4">
              Premium car rental services for all your needs. Experience the thrill of driving your dream car today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="/vehicles" className="text-gray-300 hover:text-white transition-colors">Vehicles</a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-white transition-colors">Login</a>
              </li>
              <li>
                <a href="/register" className="text-gray-300 hover:text-white transition-colors">Register</a>
              </li>
              <li>
                <a href="/profile" className="text-gray-300 hover:text-white transition-colors">My Account</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={20} className="text-gray-300 mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Kaloor road, Calicut, Kerala 12345</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={20} className="text-gray-300 flex-shrink-0" />
                <span className="text-gray-300">84726928372</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={20} className="text-gray-300 flex-shrink-0" />
                <span className="text-gray-300">contact@gearup.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Gear Up. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="/privacy-policy" className="text-gray-400 text-sm hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-gray-400 text-sm hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/faq" className="text-gray-400 text-sm hover:text-white transition-colors">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;