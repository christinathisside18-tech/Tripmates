import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import FeaturesTour from './FeaturesTour';
import Login from './Login';
import Signup from './Signup';
import SocialFeed from './SocialFeed';
import Dashboard from './Dashboard';
import FlightBooking from './FlightBooking';
import HotelBooking from './HotelBooking';
import DigitalVault from './DigitalVault';
import ThemeSelector from './ThemeSelector';
import FlightResults from './FlightResults';
import HotelResults from './HotelResults';
import SmartItinerary from './SmartItinerary';
import TripMatesMagic from './TripMatesMagic';
import LocalGuides from './LocalGuides';
import Activities from './Activities';
import Safety from './Safety';
import Admin from './Admin';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    navigate('/feed');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* --- FIXED BACKGROUND LAYER --- */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'none', opacity: 1, zIndex: -1
      }}></div>

      {/* --- Light Overlay --- */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0, 0, 0, 0.05)', zIndex: -1
      }}></div>

      {/* --- Application Routes --- */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/feed" /> : <FeaturesTour />} />
          <Route path="/login" element={user ? <Navigate to="/feed" /> : <Login onLogin={handleLogin} />} />
          <Route path="/signup" element={user ? <Navigate to="/feed" /> : <Signup onLogin={handleLogin} />} />
          <Route path="/feed" element={user ? <SocialFeed user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/flights" element={user ? <FlightBooking user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/flight-results" element={user ? <FlightResults user={user} /> : <Navigate to="/login" />} />
          <Route path="/hotels" element={user ? <HotelBooking user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/hotel-results" element={user ? <HotelResults user={user} /> : <Navigate to="/login" />} />
          <Route path="/vault" element={user ? <DigitalVault user={user} /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <ThemeSelector /> : <Navigate to="/login" />} />
          <Route path="/itinerary" element={user ? <SmartItinerary user={user} /> : <Navigate to="/login" />} />
          <Route path="/magic" element={user ? <TripMatesMagic user={user} /> : <Navigate to="/login" />} />
          <Route path="/guides" element={user ? <LocalGuides user={user} /> : <Navigate to="/login" />} />
          <Route path="/plan" element={<Activities user={user} />} />
          <Route path="/safety" element={user ? <Safety user={user} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;