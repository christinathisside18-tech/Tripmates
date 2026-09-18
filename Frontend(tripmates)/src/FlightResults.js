import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logoImg from './tripmates logo.jpeg';
import { useTheme } from './ThemeContext';

const FlightResults = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const userData = user || JSON.parse(localStorage.getItem('user'));

  const { results, from, to, passengers, travelClass, departDate } = location.state || {};

  const brandTeal  = theme.accent;
  const navBg      = theme.navBg;
  const navText    = theme.navText;
  const pageBg     = theme.pageBg;
  const cardBg     = theme.cardBg;
  const secondary  = theme.secondary;
  const btnBg      = theme.btnBg;
  const btnText    = theme.btnText;

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const emptyPassenger = { name: '', age: '', passportId: '', contact: '', email: '', aadhar: '', pan: '' };
  const [passengerDetails, setPassengerDetails] = useState([emptyPassenger]);

  const openBookingForm = (flight) => {
    setSelectedFlight(flight);
    const passengerList = Array.from({ length: passengers }, () => ({ ...emptyPassenger }));
    setPassengerDetails(passengerList);
    setBookingSuccess(false);
    setBookingError('');
    setShowBookingForm(true);
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengerDetails];
    updated[index][field] = value;
    setPassengerDetails(updated);
  };

  const handleBookingSubmit = async () => {
    setBookingLoading(true);
    setBookingError('');
    try {
      await axios.post('http://localhost:5001/api/bookflight', {
        username: userData?.username || 'guest',
        airline: selectedFlight.airline,
        flightNo: selectedFlight.flightNo,
        from: from || 'N/A',
        to: to || 'N/A',
        departDate: departDate || 'N/A',
        travelClass,
        passengers,
        totalPrice: selectedFlight.price * passengers,
        passengerDetails
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err?.response?.data?.message || "Booking failed. Please check if server is running.");
    }
    setBookingLoading(false);
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

  if (!results) {
    return (
      <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: secondary, fontSize: '16px', marginBottom: '16px' }}>Koi search data nahi mila.</p>
          <button onClick={() => navigate('/flights')} style={{ background: btnBg, color: btnText, border: 'none', padding: '12px 28px', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: pageBg, fontFamily: 'Poppins, sans-serif' }}>

      <style>{`
        .flight-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.1) !important; }
        .flight-card { transition: all 0.2s ease; }
        @media (max-width: 600px) {
          .flight-row { flex-direction: column !important; gap: 12px !important; }
          .passenger-grid { grid-template-columns: 1fr !important; }
          .nav-pad { padding: 10px 16px !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 40px', background: navBg,
        borderBottom: `3px solid ${brandTeal}`,
        position: 'sticky', top: 0, zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
      }} className="nav-pad">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/feed')}>
          <img src={logoImg} alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
          <h2 style={{ color: theme.brand, margin: 0, fontSize: '18px', fontWeight: '800' }}>TripMates</h2>
        </div>
        <div style={{ fontWeight: '700', fontSize: '15px', color: navText }}>Flight Results</div>
        <button onClick={() => navigate('/flights')} style={{
          background: 'none', border: `2px solid ${navText}`, color: navText,
          padding: '7px 18px', borderRadius: '30px', fontWeight: '700',
          cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
        }}>Modify Search</button>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px', boxSizing: 'border-box' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: '900', color: secondary }}>
            {results.length} Flights Found
          </h1>
          <p style={{ margin: 0, color: theme.muted, fontSize: '14px' }}>
            {from} → {to} • {passengers} Passenger{passengers > 1 ? 's' : ''} • {travelClass} • {departDate}
          </p>
        </div>

        {results.map((flight, i) => (
          <div key={i} className="flight-card" style={{
            background: cardBg, borderRadius: '18px', padding: '20px 25px',
            marginBottom: '15px', border: `1px solid ${theme.cardBorder}`,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }} className="flight-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '140px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: theme.avatarBg, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '900', fontSize: '13px'
                }}>{flight.logo}</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: secondary }}>{flight.airline}</div>
                  <div style={{ fontSize: '12px', color: theme.muted }}>{flight.flightNo}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: secondary }}>{flight.depart}</div>
                  <div style={{ fontSize: '12px', color: theme.muted }}>{from || 'Origin'}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: theme.muted, marginBottom: '4px' }}>{flight.duration}</div>
                  <div style={{ width: '80px', height: '2px', background: theme.cardBorder, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-3px', right: 0, width: '8px', height: '8px', borderRadius: '50%', background: brandTeal }} />
                  </div>
                  <div style={{ fontSize: '11px', color: brandTeal, marginTop: '4px', fontWeight: '600' }}>{flight.stops}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: secondary }}>{flight.arrive}</div>
                  <div style={{ fontSize: '12px', color: theme.muted }}>{to || 'Destination'}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '120px' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: brandTeal }}>
                  Rs. {(flight.price * passengers).toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: theme.muted, marginBottom: '10px' }}>
                  per {passengers > 1 ? `${passengers} passengers` : 'person'}
                </div>
                <button onClick={() => openBookingForm(flight)} style={{
                  background: btnBg, color: btnText, border: 'none',
                  padding: '8px 20px', borderRadius: '30px', fontWeight: '700',
                  cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
                }}>Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', zIndex: 3000, overflowY: 'auto',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          padding: '30px 20px', boxSizing: 'border-box'
        }}>
          <div style={{
            background: cardBg, borderRadius: '24px', padding: '35px',
            width: '100%', maxWidth: '650px', boxSizing: 'border-box',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            {!bookingSuccess ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                  <div>
                    <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '900', color: secondary }}>Passenger Details</h2>
                    <p style={{ margin: 0, fontSize: '13px', color: theme.muted }}>
                      {selectedFlight?.airline} {selectedFlight?.flightNo} • {from} → {to} • Rs. {(selectedFlight?.price * passengers).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => setShowBookingForm(false)} style={{
                    background: pageBg, border: 'none', borderRadius: '50%',
                    width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', color: theme.muted
                  }}>&times;</button>
                </div>

                {passengerDetails.map((p, i) => (
                  <div key={i} style={{
                    border: `1.5px solid ${theme.cardBorder}`, borderRadius: '16px',
                    padding: '20px', marginBottom: '20px'
                  }}>
                    <h4 style={{ margin: '0 0 16px', color: brandTeal, fontSize: '14px', fontWeight: '700' }}>
                      Passenger {i + 1}
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="passenger-grid">
                      <div><label style={labelStyle}>FULL NAME *</label><input value={p.name} onChange={e => updatePassenger(i, 'name', e.target.value)} placeholder="As per ID" style={inputStyle} /></div>
                      <div><label style={labelStyle}>AGE *</label><input type="number" value={p.age} onChange={e => updatePassenger(i, 'age', e.target.value)} placeholder="Age" style={inputStyle} /></div>
                      <div><label style={labelStyle}>PASSPORT / ID NO.</label><input value={p.passportId} onChange={e => updatePassenger(i, 'passportId', e.target.value)} placeholder="Passport or ID number" style={inputStyle} /></div>
                      <div><label style={labelStyle}>CONTACT NUMBER *</label><input value={p.contact} onChange={e => updatePassenger(i, 'contact', e.target.value)} placeholder="10-digit number" style={inputStyle} /></div>
                      <div><label style={labelStyle}>EMAIL *</label><input value={p.email} onChange={e => updatePassenger(i, 'email', e.target.value)} placeholder="Email address" style={inputStyle} /></div>
                      <div><label style={labelStyle}>AADHAR NO. (optional)</label><input value={p.aadhar} onChange={e => updatePassenger(i, 'aadhar', e.target.value)} placeholder="12-digit Aadhar" style={inputStyle} /></div>
                      <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>PAN CARD NO. (optional)</label><input value={p.pan} onChange={e => updatePassenger(i, 'pan', e.target.value)} placeholder="PAN number" style={inputStyle} /></div>
                    </div>
                  </div>
                ))}

                {bookingError && <p style={{ color: '#ff7675', fontSize: '13px', textAlign: 'center', marginBottom: '12px', fontWeight: '600' }}>{bookingError}</p>}

                <button onClick={handleBookingSubmit} disabled={bookingLoading} style={{
                  width: '100%', background: btnBg, color: btnText, border: 'none',
                  padding: '16px', borderRadius: '14px', fontSize: '16px', fontWeight: '800',
                  cursor: 'pointer', fontFamily: 'Poppins, sans-serif', opacity: bookingLoading ? 0.7 : 1
                }}>
                  {bookingLoading ? 'Confirming Booking...' : 'Confirm Booking'}
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%', background: theme.avatarBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: '36px', color: 'white', fontWeight: 'bold'
                }}>✓</div>
                <h2 style={{ margin: '0 0 10px', fontSize: '22px', fontWeight: '900', color: secondary }}>Booking Confirmed!</h2>
                <p style={{ color: theme.muted, fontSize: '14px', marginBottom: '8px' }}>{selectedFlight?.airline} {selectedFlight?.flightNo}</p>
                <p style={{ color: theme.muted, fontSize: '14px', marginBottom: '25px' }}>{from} → {to} • {departDate} • {travelClass}</p>
                <div style={{ background: pageBg, borderRadius: '14px', padding: '16px', marginBottom: '25px', fontSize: '20px', fontWeight: '900', color: brandTeal }}>
                  Total Paid: Rs. {(selectedFlight?.price * passengers).toLocaleString()}
                </div>
                <button onClick={() => navigate('/flights')} style={{
                  background: btnBg, color: btnText, border: 'none',
                  padding: '14px 40px', borderRadius: '30px', fontWeight: '700',
                  cursor: 'pointer', fontSize: '15px', fontFamily: 'Poppins, sans-serif'
                }}>New Search</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightResults;