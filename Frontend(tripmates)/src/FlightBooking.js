import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from './tripmates logo.jpeg';
import { useTheme } from './ThemeContext';

const FlightBooking = ({ user }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const brandTeal  = theme.accent;
  const navBg      = theme.navBg;
  const navText    = theme.navText;
  const pageBg     = theme.pageBg;
  const cardBg     = theme.cardBg;
  const secondary  = theme.secondary;
  const btnBg      = theme.btnBg;
  const btnText    = theme.btnText;

  const indianCities = [
    { city: 'Vijayawada',          state: 'Andhra Pradesh' },
    { city: 'Visakhapatnam',       state: 'Andhra Pradesh' },
    { city: 'Tirupati',            state: 'Andhra Pradesh' },
    { city: 'Rajahmundry',         state: 'Andhra Pradesh' },
    { city: 'Itanagar',            state: 'Arunachal Pradesh' },
    { city: 'Guwahati',            state: 'Assam' },
    { city: 'Dibrugarh',           state: 'Assam' },
    { city: 'Silchar',             state: 'Assam' },
    { city: 'Jorhat',              state: 'Assam' },
    { city: 'Patna',               state: 'Bihar' },
    { city: 'Gaya',                state: 'Bihar' },
    { city: 'Raipur',              state: 'Chhattisgarh' },
    { city: 'Bilaspur',            state: 'Chhattisgarh' },
    { city: 'Delhi',               state: 'Delhi' },
    { city: 'New Delhi',           state: 'Delhi' },
    { city: 'Goa',                 state: 'Goa' },
    { city: 'Panaji',              state: 'Goa' },
    { city: 'Ahmedabad',           state: 'Gujarat' },
    { city: 'Surat',               state: 'Gujarat' },
    { city: 'Vadodara',            state: 'Gujarat' },
    { city: 'Rajkot',              state: 'Gujarat' },
    { city: 'Bhavnagar',           state: 'Gujarat' },
    { city: 'Chandigarh',          state: 'Haryana' },
    { city: 'Hisar',               state: 'Haryana' },
    { city: 'Shimla',              state: 'Himachal Pradesh' },
    { city: 'Dharamshala',         state: 'Himachal Pradesh' },
    { city: 'Kullu',               state: 'Himachal Pradesh' },
    { city: 'Jammu',               state: 'Jammu & Kashmir' },
    { city: 'Srinagar',            state: 'Jammu & Kashmir' },
    { city: 'Leh',                 state: 'Ladakh' },
    { city: 'Ranchi',              state: 'Jharkhand' },
    { city: 'Jamshedpur',          state: 'Jharkhand' },
    { city: 'Bangalore',           state: 'Karnataka' },
    { city: 'Mangalore',           state: 'Karnataka' },
    { city: 'Mysore',              state: 'Karnataka' },
    { city: 'Hubli',               state: 'Karnataka' },
    { city: 'Belagavi',            state: 'Karnataka' },
    { city: 'Kochi',               state: 'Kerala' },
    { city: 'Thiruvananthapuram',  state: 'Kerala' },
    { city: 'Kozhikode',           state: 'Kerala' },
    { city: 'Kannur',              state: 'Kerala' },
    { city: 'Thrissur',            state: 'Kerala' },
    { city: 'Bhopal',              state: 'Madhya Pradesh' },
    { city: 'Indore',              state: 'Madhya Pradesh' },
    { city: 'Gwalior',             state: 'Madhya Pradesh' },
    { city: 'Jabalpur',            state: 'Madhya Pradesh' },
    { city: 'Mumbai',              state: 'Maharashtra' },
    { city: 'Pune',                state: 'Maharashtra' },
    { city: 'Nagpur',              state: 'Maharashtra' },
    { city: 'Nashik',              state: 'Maharashtra' },
    { city: 'Aurangabad',          state: 'Maharashtra' },
    { city: 'Imphal',              state: 'Manipur' },
    { city: 'Shillong',            state: 'Meghalaya' },
    { city: 'Aizawl',              state: 'Mizoram' },
    { city: 'Dimapur',             state: 'Nagaland' },
    { city: 'Bhubaneswar',         state: 'Odisha' },
    { city: 'Rourkela',            state: 'Odisha' },
    { city: 'Amritsar',            state: 'Punjab' },
    { city: 'Ludhiana',            state: 'Punjab' },
    { city: 'Jaipur',              state: 'Rajasthan' },
    { city: 'Jodhpur',             state: 'Rajasthan' },
    { city: 'Udaipur',             state: 'Rajasthan' },
    { city: 'Jaisalmer',           state: 'Rajasthan' },
    { city: 'Kota',                state: 'Rajasthan' },
    { city: 'Gangtok',             state: 'Sikkim' },
    { city: 'Chennai',             state: 'Tamil Nadu' },
    { city: 'Madurai',             state: 'Tamil Nadu' },
    { city: 'Coimbatore',          state: 'Tamil Nadu' },
    { city: 'Tiruchirappalli',     state: 'Tamil Nadu' },
    { city: 'Salem',               state: 'Tamil Nadu' },
    { city: 'Hyderabad',           state: 'Telangana' },
    { city: 'Warangal',            state: 'Telangana' },
    { city: 'Agartala',            state: 'Tripura' },
    { city: 'Lucknow',             state: 'Uttar Pradesh' },
    { city: 'Varanasi',            state: 'Uttar Pradesh' },
    { city: 'Agra',                state: 'Uttar Pradesh' },
    { city: 'Kanpur',              state: 'Uttar Pradesh' },
    { city: 'Prayagraj',           state: 'Uttar Pradesh' },
    { city: 'Dehradun',            state: 'Uttarakhand' },
    { city: 'Haridwar',            state: 'Uttarakhand' },
    { city: 'Kolkata',             state: 'West Bengal' },
    { city: 'Siliguri',            state: 'West Bengal' },
    { city: 'Bagdogra',            state: 'West Bengal' },
    { city: 'Port Blair',          state: 'Andaman & Nicobar' },
    { city: 'Puducherry',          state: 'Puducherry' },
  ];

  const classPriceMultiplier = {
    'Economy': 1,
    'Premium Economy': 1.5,
    'Business': 2.5,
    'First Class': 4,
  };

  const [tripType, setTripType] = useState('oneway');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('Economy');
  const [loading, setLoading] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const fakeFlights = [
    { airline: 'IndiGo',    flightNo: '6E-204', depart: '06:00', arrive: '08:10', duration: '2h 10m', price: 3199, stops: 'Non-stop', logo: '6E' },
    { airline: 'SpiceJet',  flightNo: 'SG-312', depart: '11:15', arrive: '13:45', duration: '2h 30m', price: 3499, stops: 'Non-stop', logo: 'SG' },
    { airline: 'IndiGo',    flightNo: '6E-512', depart: '17:45', arrive: '20:15', duration: '2h 30m', price: 3899, stops: 'Non-stop', logo: '6E' },
    { airline: 'Air India', flightNo: 'AI-203', depart: '21:00', arrive: '23:30', duration: '2h 30m', price: 4299, stops: 'Non-stop', logo: 'AI' },
    { airline: 'Air India', flightNo: 'AI-101', depart: '08:30', arrive: '11:00', duration: '2h 30m', price: 4899, stops: 'Non-stop', logo: 'AI' },
    { airline: 'Vistara',   flightNo: 'UK-995', depart: '14:00', arrive: '16:30', duration: '2h 30m', price: 5599, stops: 'Non-stop', logo: 'UK' },
  ];

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const multiplier = classPriceMultiplier[travelClass];
      const sorted = [...fakeFlights]
        .map(f => ({ ...f, price: Math.round(f.price * multiplier) }))
        .sort((a, b) => a.price - b.price);
      setLoading(false);
      navigate('/flight-results', {
        state: { results: sorted, from, to, passengers, travelClass, departDate }
      });
    }, 1200);
  };

  const swapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', border: `1.5px solid ${theme.cardBorder}`,
    borderRadius: '10px', fontSize: '14px', outline: 'none',
    fontFamily: 'Poppins, sans-serif', color: secondary,
    background: cardBg, boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: '700', color: theme.muted,
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
        .input-field:focus { border-color: ${brandTeal} !important; }
        .search-btn:hover { opacity: 0.9; }
        .suggestion-item:hover { background: ${pageBg} !important; }
        @media (max-width: 600px) {
          .search-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 40px', background: navBg,
        borderBottom: `3px solid ${brandTeal}`,
        position: 'sticky', top: 0, zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/feed')}>
          <img src={logoImg} alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
          <h2 style={{ color: navText, margin: 0, fontSize: '18px', fontWeight: '800' }}>TripMates</h2>
        </div>
        <div style={{ fontWeight: '700', fontSize: '15px', color: navText }}>Flight Booking</div>
        <button onClick={() => navigate('/feed')} style={{
          background: 'none', border: `2px solid ${navText}`, color: navText,
          padding: '7px 18px', borderRadius: '30px', fontWeight: '700',
          cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
        }}>Back to Feed</button>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px', boxSizing: 'border-box' }}>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '900', color: secondary }}>
            Find Your <span style={{ color: brandTeal }}>Flight</span>
          </h1>
          <p style={{ margin: 0, color: theme.muted, fontSize: '14px' }}>Search from hundreds of flights at the best prices</p>
        </div>

        {/* Search Card */}
        <div style={{
          background: cardBg, borderRadius: '24px', padding: '30px',
          boxShadow: '0 4px 25px rgba(0,0,0,0.07)', marginBottom: '30px',
          border: `1px solid ${theme.cardBorder}`, boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            {['oneway', 'roundtrip'].map(type => (
              <button key={type} onClick={() => setTripType(type)} style={{
                padding: '8px 22px', borderRadius: '30px', border: 'none',
                fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                background: tripType === type ? brandTeal : pageBg,
                color: tripType === type ? theme.accentText : theme.muted,
                boxShadow: tripType === type ? `0 4px 12px ${brandTeal}44` : 'none',
                transition: 'all 0.2s'
              }}>
                {type === 'oneway' ? 'One Way' : 'Round Trip'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>

            {/* FROM with autocomplete */}
            <div style={{ flex: 1, minWidth: '140px', position: 'relative' }}>
              <label style={labelStyle}>FROM</label>
              <input
                className="input-field"
                value={from}
                onChange={e => {
                  setFrom(e.target.value);
                  const filtered = indianCities.filter(c =>
                    c.city.toLowerCase().startsWith(e.target.value.toLowerCase())
                  );
                  setFromSuggestions(filtered);
                  setShowFromDropdown(e.target.value.length > 0 && filtered.length > 0);
                }}
                onBlur={() => setTimeout(() => setShowFromDropdown(false), 150)}
                placeholder="City or Airport"
                style={inputStyle}
              />
              {showFromDropdown && (
                <div style={dropdownStyle}>
                  {fromSuggestions.map((item, i) => (
                    <div
                      key={i}
                      className="suggestion-item"
                      onMouseDown={() => { setFrom(item.city); setShowFromDropdown(false); }}
                      style={suggestionStyle}
                    >
                      <div style={{ fontWeight: '600', fontSize: '14px', color: secondary }}>{item.city}</div>
                      <div style={{ fontSize: '11px', color: theme.muted, marginTop: '2px' }}>{item.state}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={swapCities} style={{
              width: '42px', height: '42px', borderRadius: '50%', border: `2px solid ${brandTeal}`,
              background: cardBg, color: brandTeal, fontWeight: '900', fontSize: '18px',
              cursor: 'pointer', flexShrink: 0, marginBottom: '2px', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>⇄</button>

            {/* TO with autocomplete */}
            <div style={{ flex: 1, minWidth: '140px', position: 'relative' }}>
              <label style={labelStyle}>TO</label>
              <input
                className="input-field"
                value={to}
                onChange={e => {
                  setTo(e.target.value);
                  const filtered = indianCities.filter(c =>
                    c.city.toLowerCase().startsWith(e.target.value.toLowerCase())
                  );
                  setToSuggestions(filtered);
                  setShowToDropdown(e.target.value.length > 0 && filtered.length > 0);
                }}
                onBlur={() => setTimeout(() => setShowToDropdown(false), 150)}
                placeholder="City or Airport"
                style={inputStyle}
              />
              {showToDropdown && (
                <div style={dropdownStyle}>
                  {toSuggestions.map((item, i) => (
                    <div
                      key={i}
                      className="suggestion-item"
                      onMouseDown={() => { setTo(item.city); setShowToDropdown(false); }}
                      style={suggestionStyle}
                    >
                      <div style={{ fontWeight: '600', fontSize: '14px', color: secondary }}>{item.city}</div>
                      <div style={{ fontSize: '11px', color: theme.muted, marginTop: '2px' }}>{item.state}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: tripType === 'roundtrip' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: '15px', marginBottom: '25px' }} className="search-grid">
            <div>
              <label style={labelStyle}>DEPARTURE</label>
              <input type="date" className="input-field" value={departDate} onChange={e => setDepartDate(e.target.value)} style={inputStyle} />
            </div>
            {tripType === 'roundtrip' && (
              <div>
                <label style={labelStyle}>RETURN</label>
                <input type="date" className="input-field" value={returnDate} onChange={e => setReturnDate(e.target.value)} style={inputStyle} />
              </div>
            )}
            <div>
              <label style={labelStyle}>PASSENGERS</label>
              <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${theme.cardBorder}`, borderRadius: '12px', overflow: 'hidden', background: cardBg }}>
                <button onClick={() => setPassengers(p => Math.max(1, p - 1))} style={{ width: '44px', height: '50px', border: 'none', background: pageBg, fontSize: '20px', cursor: 'pointer', color: theme.muted, fontWeight: 'bold' }}>-</button>
                <span style={{ flex: 1, textAlign: 'center', fontWeight: '700', fontSize: '15px', color: secondary }}>{passengers}</span>
                <button onClick={() => setPassengers(p => Math.min(9, p + 1))} style={{ width: '44px', height: '50px', border: 'none', background: pageBg, fontSize: '20px', cursor: 'pointer', color: brandTeal, fontWeight: 'bold' }}>+</button>
              </div>
            </div>
            <div>
              <label style={labelStyle}>CLASS</label>
              <select value={travelClass} onChange={e => setTravelClass(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option>Economy</option>
                <option>Premium Economy</option>
                <option>Business</option>
                <option>First Class</option>
              </select>
            </div>
          </div>

          {/* Price range indicator */}
          <div style={{
            background: pageBg, borderRadius: '10px', padding: '10px 16px',
            marginBottom: '20px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', border: `1px solid ${theme.cardBorder}`
          }}>
            <span style={{ fontSize: '12px', color: theme.muted, fontWeight: '600' }}>
              Estimated price range ({travelClass})
            </span>
            <span style={{ fontSize: '13px', fontWeight: '800', color: brandTeal }}>
              Rs. {Math.round(3199 * classPriceMultiplier[travelClass]).toLocaleString()} —
              Rs. {Math.round(5599 * classPriceMultiplier[travelClass]).toLocaleString()}
            </span>
          </div>

          <button className="search-btn" onClick={handleSearch} style={{
            width: '100%', background: btnBg, color: btnText,
            border: 'none', padding: '16px', borderRadius: '14px',
            fontSize: '16px', fontWeight: '800', cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: `0 6px 20px ${brandTeal}44`, transition: 'opacity 0.2s'
          }}>
            {loading ? 'Searching...' : 'Search Flights'}
          </button>

          {loading && (
            <div style={{ textAlign: 'center', padding: '20px 0 0', color: theme.muted, fontSize: '14px' }}>
              Searching best flights for you...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;