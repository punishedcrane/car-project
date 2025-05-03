import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/Register';
import Vehicles from './pages/Vehicles'; 
import VehicleDetail from './pages/VehicleDetail';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Add this import
import AdminDashboard from './pages/AdminDashboard';
import './App.css'; 
import Booking from './pages/Booking';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen"> {/* Add this wrapper div */}
        <Navbar />
        <main className="flex-grow"> {/* Add this main tag with flex-grow */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
          </Routes>
        </main>
        <Footer /> {/* Add the Footer component here */}
      </div>
    </Router>
  );
};

export default App;