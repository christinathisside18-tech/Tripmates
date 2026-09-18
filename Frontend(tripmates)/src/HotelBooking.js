import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from './tripmates logo.jpeg';
import { useTheme } from './ThemeContext';

const HotelBooking = ({ user }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const brandGold = theme.accent;
  const brandDark = theme.navBg;
  const pageBg    = theme.pageBg;
  const cardBg    = theme.cardBg;
  const secondary = theme.secondary;
  const muted     = theme.muted;
  const btnBg     = theme.btnBg;
  const btnText   = theme.btnText;

  const indianCities = [
    { city: 'Vijayawada',         state: 'Andhra Pradesh' },
    { city: 'Visakhapatnam',      state: 'Andhra Pradesh' },
    { city: 'Tirupati',           state: 'Andhra Pradesh' },
    { city: 'Itanagar',           state: 'Arunachal Pradesh' },
    { city: 'Guwahati',           state: 'Assam' },
    { city: 'Dibrugarh',          state: 'Assam' },
    { city: 'Patna',              state: 'Bihar' },
    { city: 'Gaya',               state: 'Bihar' },
    { city: 'Raipur',             state: 'Chhattisgarh' },
    { city: 'Delhi',              state: 'Delhi' },
    { city: 'New Delhi',          state: 'Delhi' },
    { city: 'Goa',                state: 'Goa' },
    { city: 'Panaji',             state: 'Goa' },
    { city: 'Ahmedabad',          state: 'Gujarat' },
    { city: 'Surat',              state: 'Gujarat' },
    { city: 'Vadodara',           state: 'Gujarat' },
    { city: 'Rajkot',             state: 'Gujarat' },
    { city: 'Chandigarh',         state: 'Haryana' },
    { city: 'Shimla',             state: 'Himachal Pradesh' },
    { city: 'Dharamshala',        state: 'Himachal Pradesh' },
    { city: 'Jammu',              state: 'Jammu & Kashmir' },
    { city: 'Srinagar',           state: 'Jammu & Kashmir' },
    { city: 'Leh',                state: 'Ladakh' },
    { city: 'Ranchi',             state: 'Jharkhand' },
    { city: 'Bangalore',          state: 'Karnataka' },
    { city: 'Mangalore',          state: 'Karnataka' },
    { city: 'Mysore',             state: 'Karnataka' },
    { city: 'Hubli',              state: 'Karnataka' },
    { city: 'Kochi',              state: 'Kerala' },
    { city: 'Thiruvananthapuram', state: 'Kerala' },
    { city: 'Kozhikode',          state: 'Kerala' },
    { city: 'Kannur',             state: 'Kerala' },
    { city: 'Thrissur',           state: 'Kerala' },
    { city: 'Bhopal',             state: 'Madhya Pradesh' },
    { city: 'Indore',             state: 'Madhya Pradesh' },
    { city: 'Gwalior',            state: 'Madhya Pradesh' },
    { city: 'Mumbai',             state: 'Maharashtra' },
    { city: 'Pune',               state: 'Maharashtra' },
    { city: 'Nagpur',             state: 'Maharashtra' },
    { city: 'Nashik',             state: 'Maharashtra' },
    { city: 'Aurangabad',         state: 'Maharashtra' },
    { city: 'Imphal',             state: 'Manipur' },
    { city: 'Shillong',           state: 'Meghalaya' },
    { city: 'Aizawl',             state: 'Mizoram' },
    { city: 'Dimapur',            state: 'Nagaland' },
    { city: 'Bhubaneswar',        state: 'Odisha' },
    { city: 'Amritsar',           state: 'Punjab' },
    { city: 'Ludhiana',           state: 'Punjab' },
    { city: 'Jaipur',             state: 'Rajasthan' },
    { city: 'Jodhpur',            state: 'Rajasthan' },
    { city: 'Udaipur',            state: 'Rajasthan' },
    { city: 'Jaisalmer',          state: 'Rajasthan' },
    { city: 'Gangtok',            state: 'Sikkim' },
    { city: 'Chennai',            state: 'Tamil Nadu' },
    { city: 'Madurai',            state: 'Tamil Nadu' },
    { city: 'Coimbatore',         state: 'Tamil Nadu' },
    { city: 'Tiruchirappalli',    state: 'Tamil Nadu' },
    { city: 'Hyderabad',          state: 'Telangana' },
    { city: 'Warangal',           state: 'Telangana' },
    { city: 'Agartala',           state: 'Tripura' },
    { city: 'Lucknow',            state: 'Uttar Pradesh' },
    { city: 'Varanasi',           state: 'Uttar Pradesh' },
    { city: 'Agra',               state: 'Uttar Pradesh' },
    { city: 'Kanpur',             state: 'Uttar Pradesh' },
    { city: 'Dehradun',           state: 'Uttarakhand' },
    { city: 'Haridwar',           state: 'Uttarakhand' },
    { city: 'Kolkata',            state: 'West Bengal' },
    { city: 'Siliguri',           state: 'West Bengal' },
    { city: 'Port Blair',         state: 'Andaman & Nicobar' },
    { city: 'Puducherry',         state: 'Puducherry' },
  ];

  const [city, setCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [roomType, setRoomType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [useNearest, setUseNearest] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const fakeHotels = [
    { name: 'The Grand Meridian',   area: 'City Center',       price: 4500, rating: 4.8, reviews: 320, type: 'Suite',  amenities: ['Free WiFi', 'Pool', 'Spa', 'Breakfast'] },
    { name: 'Comfort Stay Inn',     area: 'Near Airport',      price: 1800, rating: 3.9, reviews: 145, type: 'Single', amenities: ['Free WiFi', 'Parking'] },
    { name: 'Royal Palace Hotel',   area: 'Downtown',          price: 7200, rating: 4.9, reviews: 512, type: 'Suite',  amenities: ['Free WiFi', 'Pool', 'Spa', 'Bar', 'Gym'] },
    { name: 'Blue Lotus Resort',    area: 'Beach Side',        price: 5500, rating: 4.6, reviews: 278, type: 'Double', amenities: ['Free WiFi', 'Pool', 'Breakfast', 'Beach Access'] },
    { name: 'Budget Nest',          area: 'Old City',          price: 999,  rating: 3.5, reviews: 89,  type: 'Single', amenities: ['Free WiFi'] },
    { name: 'Elite Business Suites',area: 'Business District', price: 6800, rating: 4.7, reviews: 401, type: 'Suite',  amenities: ['Free WiFi', 'Gym', 'Conference Room', 'Breakfast'] },
    { name: 'Cozy Retreat',         area: 'Suburbs',           price: 2200, rating: 4.1, reviews: 167, type: 'Double', amenities: ['Free WiFi', 'Parking', 'Breakfast'] },
    { name: 'Sunshine Lodge',       area: 'Near Station',      price: 1400, rating: 3.7, reviews: 92,  type: 'Single', amenities: ['Free WiFi', 'Parking'] },
  ];

  const handleNearestLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => { setCity('Current Location'); setUseNearest(true); setLocationLoading(false); },
        () => { setLocationLoading(false); alert('Location access denied.'); }
      );
    } else { setLocationLoading(false); }
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...fakeHotels];
      if (roomType !== 'All') filtered = filtered.filter(h => h.type === roomType);
      filtered = filtered.filter(h => h.price <= maxPrice);
      filtered = filtered.sort((a, b) => a.price - b.price);
      setLoading(false);
      navigate('/hotel-results', {
        state: {
          results: filtered,
          city, checkIn, checkOut, guests, roomType, maxPrice
        }
      });
    }, 1200);
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', border: `1.5px solid ${theme.cardBorder}`,
    borderRadius: '10px', fontSize: '14px', outline: 'none',
    fontFamily: 'Poppins, sans-serif', color: secondary,
    background: cardBg, boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: '700', color: muted,
    letterSpacing: '1px', marginBottom: '6px', display: 'block'
  };

  const dropdownStyle = {
    position: 'absolute', top: '100%', left: 0, right: 0,
    background: cardBg, border: `1px solid ${theme.cardBorder}`,
    borderRadius: '10px', zIndex: 100, maxHeight: '200px',
    overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    marginTop: '4px'
  };

  const suggestionStyle = {
    padding: '10px 14px', cursor: 'pointer',
    borderBottom: `1px solid ${theme.cardBorder}`,
    transition: 'background 0.15s'
  };

  return (
    <div style={{ minHeight: '100vh', background: pageBg, fontFamily: 'Poppins, sans-serif' }}>

      <style>{`
        .hotel-input:focus { border-color: ${brandGold} !important; }
        .suggestion-item:hover { background: ${pageBg} !important; }
        @media (max-width: 600px) {
          .search-grid { grid-template-columns: 1fr !important; }
          .hotel-card-inner { flex-direction: column !important; }
          .nav-inner { padding: 10px 16px !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 40px', background: brandDark,
        borderBottom: `3px solid ${brandGold}`,
        position: 'sticky', top: 0, zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }} className="nav-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/feed')}>
          <img src={logoImg} alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
          <h2 style={{ color: theme.navText, margin: 0, fontSize: '18px', fontWeight: '800' }}>TripMates</h2>
        </div>
        <div style={{ fontWeight: '700', fontSize: '15px', color: theme.navText }}>Hotel Booking</div>
        <button onClick={() => navigate('/feed')} style={{
          background: 'none', border: `2px solid ${theme.navText}`, color: theme.navText,
          padding: '7px 18px', borderRadius: '30px', fontWeight: '700',
          cursor: 'pointer', fontSize: '13px'
        }}>Back to Feed</button>
      </nav>

      {/* Hero Banner */}
      <div style={{ background: theme.coverBg, padding: '50px 40px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 10px', fontSize: '32px', fontWeight: '900', color: 'white' }}>
          Find Your Perfect <span style={{ color: brandGold }}>Stay</span>
        </h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>Luxury to budget — discover hotels that feel like home</p>
      </div>

      <div style={{ maxWidth: '950px', margin: '0 auto', padding: '30px 20px', boxSizing: 'border-box' }}>

        {/* Search Card */}
        <div style={{
          background: cardBg, borderRadius: '24px', padding: '30px',
          boxShadow: `0 8px 40px ${brandGold}22`, marginBottom: '30px',
          border: `1px solid ${theme.cardBorder}`, boxSizing: 'border-box',
          marginTop: '-30px', position: 'relative', zIndex: 10
        }}>

          {/* City Search Row with autocomplete */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <label style={labelStyle}>CITY / DESTINATION</label>
              <input
                className="hotel-input"
                value={city}
                onChange={e => {
                  setCity(e.target.value);
                  setUseNearest(false);
                  const filtered = indianCities.filter(c =>
                    c.city.toLowerCase().startsWith(e.target.value.toLowerCase())
                  );
                  setCitySuggestions(filtered);
                  setShowCityDropdown(e.target.value.length > 0 && filtered.length > 0);
                }}
                onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
                placeholder="Search city or destination"
                style={inputStyle}
              />
              {showCityDropdown && (
                <div style={dropdownStyle}>
                  {citySuggestions.map((item, i) => (
                    <div
                      key={i}
                      className="suggestion-item"
                      onMouseDown={() => { setCity(item.city); setShowCityDropdown(false); }}
                      style={suggestionStyle}
                    >
                      <div style={{ fontWeight: '600', fontSize: '14px', color: secondary }}>{item.city}</div>
                      <div style={{ fontSize: '11px', color: muted, marginTop: '2px' }}>{item.state}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleNearestLocation} disabled={locationLoading} style={{
              padding: '12px 20px', borderRadius: '10px', border: `2px solid ${brandGold}`,
              background: useNearest ? brandGold : cardBg, color: useNearest ? theme.accentText : brandGold,
              fontWeight: '700', fontSize: '13px', cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap', transition: 'all 0.2s'
            }}>
              {locationLoading ? 'Locating...' : 'Nearest Hotels'}
            </button>
          </div>

          {/* Dates + Guests */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }} className="search-grid">
            <div>
              <label style={labelStyle}>CHECK-IN</label>
              <input type="date" className="hotel-input" value={checkIn} onChange={e => setCheckIn(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>CHECK-OUT</label>
              <input type="date" className="hotel-input" value={checkOut} onChange={e => setCheckOut(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>GUESTS</label>
              <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${theme.cardBorder}`, borderRadius: '10px', overflow: 'hidden', background: cardBg }}>
                <button onClick={() => setGuests(g => Math.max(1, g - 1))} style={{ width: '44px', height: '48px', border: 'none', background: pageBg, fontSize: '20px', cursor: 'pointer', color: muted, fontWeight: 'bold' }}>-</button>
                <span style={{ flex: 1, textAlign: 'center', fontWeight: '700', fontSize: '15px', color: secondary }}>{guests}</span>
                <button onClick={() => setGuests(g => Math.min(10, g + 1))} style={{ width: '44px', height: '48px', border: 'none', background: pageBg, fontSize: '20px', cursor: 'pointer', color: brandGold, fontWeight: 'bold' }}>+</button>
              </div>
            </div>
          </div>

          {/* Room Type + Price Filter */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }} className="search-grid">
            <div>
              <label style={labelStyle}>ROOM TYPE</label>
              <select value={roomType} onChange={e => setRoomType(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} className="hotel-input">
                <option value="All">All Types</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>MAX PRICE PER NIGHT — Rs. {maxPrice.toLocaleString()}</label>
              <input
                type="range" min="500" max="10000" step="500"
                value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', marginTop: '12px', accentColor: brandGold, cursor: 'pointer' }}
              />
            </div>
          </div>

          <button onClick={handleSearch} style={{
            width: '100%', background: btnBg, color: btnText,
            border: 'none', padding: '16px', borderRadius: '14px',
            fontSize: '16px', fontWeight: '900', cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: `0 6px 20px ${brandGold}55`, transition: 'opacity 0.2s'
          }}>
            {loading ? 'Searching...' : 'Search Hotels'}
          </button>

          {loading && (
            <div style={{ textAlign: 'center', padding: '20px 0 0', color: muted, fontSize: '14px' }}>
              Finding best hotels for you...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;