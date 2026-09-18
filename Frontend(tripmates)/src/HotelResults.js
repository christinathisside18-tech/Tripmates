import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logoImg from './tripmates logo.jpeg';
import { useTheme } from './ThemeContext';

const HotelResults = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const userData = user || JSON.parse(localStorage.getItem('user'));

  const { results, city, checkIn, checkOut, guests } = location.state || {};

  const brandGold = theme.accent;
  const navBg     = theme.navBg;
  const navText   = theme.navText;
  const pageBg    = theme.pageBg;
  const cardBg    = theme.cardBg;
  const secondary = theme.secondary;
  const muted     = theme.muted;
  const btnBg     = theme.btnBg;
  const btnText   = theme.btnText;

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [guestDetails, setGuestDetails] = useState({ name: '', contact: '', email: '', aadhar: '', pan: '' });

  const getNights = () => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut) - new Date(checkIn);
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const renderStars = (rating) => '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');

  const openBookingForm = (hotel) => {
    setSelectedHotel(hotel);
    setBookingSuccess(false);
    setBookingError('');
    setGuestDetails({ name: '', contact: '', email: '', aadhar: '', pan: '' });
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async () => {
    setBookingLoading(true);
    setBookingError('');
    try {
      await axios.post('http://localhost:5001/api/bookhotel', {
        username: userData?.username || 'guest',
        hotelName: selectedHotel.name,
        area: selectedHotel.area,
        city: city || 'N/A',
        checkIn: checkIn || 'N/A',
        checkOut: checkOut || 'N/A',
        nights: getNights(),
        guests,
        roomType: selectedHotel.type,
        totalPrice: selectedHotel.price * getNights(),
        guestDetails
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
    fontSize: '11px', fontWeight: '700', color: muted,
    letterSpacing: '1px', marginBottom: '6px', display: 'block'
  };

  if (!results) {
    return (
      <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: secondary, fontSize: '16px', marginBottom: '16px' }}>Koi search data nahi mila.</p>
          <button onClick={() => navigate('/hotels')} style={{ background: btnBg, color: btnText, border: 'none', padding: '12px 28px', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: pageBg, fontFamily: 'Poppins, sans-serif' }}>

      <style>{`
        .hotel-card:hover { transform: translateY(-3px); box-shadow: 0 12px 35px rgba(0,0,0,0.15) !important; }
        .hotel-card { transition: all 0.25s ease; }
        @media (max-width: 600px) {
          .hotel-card-inner { flex-direction: column !important; }
          .nav-inner { padding: 10px 16px !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 40px', background: navBg,
        borderBottom: `3px solid ${brandGold}`,
        position: 'sticky', top: 0, zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }} className="nav-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/feed')}>
          <img src={logoImg} alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
          <h2 style={{ color: theme.brand, margin: 0, fontSize: '18px', fontWeight: '800' }}>TripMates</h2>
        </div>
        <div style={{ fontWeight: '700', fontSize: '15px', color: navText }}>Hotel Results</div>
        <button onClick={() => navigate('/hotels')} style={{
          background: 'none', border: `2px solid ${navText}`, color: navText,
          padding: '7px 18px', borderRadius: '30px', fontWeight: '700',
          cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
        }}>Modify Search</button>
      </nav>

      <div style={{ maxWidth: '950px', margin: '0 auto', padding: '30px 20px', boxSizing: 'border-box' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: '900', color: secondary }}>
            {results.length} Hotels Found
          </h1>
          <p style={{ margin: 0, color: muted, fontSize: '14px' }}>
            {city} • {getNights()} Night{getNights() > 1 ? 's' : ''} • {guests} Guest{guests > 1 ? 's' : ''}
          </p>
        </div>

        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: muted, background: cardBg, borderRadius: '20px' }}>
            No hotels found. Try different filters.
          </div>
        ) : (
          results.map((hotel, i) => (
            <div key={i} className="hotel-card" style={{
              background: cardBg, borderRadius: '20px', padding: '24px',
              marginBottom: '16px', border: `1px solid ${theme.cardBorder}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }} className="hotel-card-inner">
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      width: '50px', height: '50px', borderRadius: '14px',
                      background: theme.avatarBg, color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '900', fontSize: '18px', flexShrink: 0
                    }}>H</div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '16px', color: secondary }}>{hotel.name}</div>
                      <div style={{ fontSize: '13px', color: muted }}>{hotel.area}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ color: brandGold, fontSize: '16px' }}>{renderStars(hotel.rating)}</span>
                    <span style={{ fontWeight: '700', fontSize: '14px', color: secondary }}>{hotel.rating}</span>
                    <span style={{ fontSize: '12px', color: muted }}>({hotel.reviews} reviews)</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {hotel.amenities.map((a, j) => (
                      <span key={j} style={{ background: pageBg, color: muted, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>{a}</span>
                    ))}
                    <span style={{ background: `${brandGold}22`, color: brandGold, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', border: `1px solid ${brandGold}44` }}>{hotel.type}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: '140px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: brandGold }}>Rs. {hotel.price.toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: muted, marginBottom: '4px' }}>per night</div>
                  {checkIn && checkOut && (
                    <div style={{ fontSize: '13px', fontWeight: '700', color: secondary, marginBottom: '12px' }}>
                      Total: Rs. {(hotel.price * getNights()).toLocaleString()}
                      <span style={{ fontSize: '11px', fontWeight: '400', color: muted }}> ({getNights()} nights)</span>
                    </div>
                  )}
                  <button onClick={() => openBookingForm(hotel)} style={{
                    background: btnBg, color: btnText, border: 'none',
                    padding: '10px 24px', borderRadius: '30px', fontWeight: '800',
                    cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
                  }}>Book Now</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.6)', zIndex: 3000, overflowY: 'auto',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          padding: '30px 20px', boxSizing: 'border-box'
        }}>
          <div style={{
            background: cardBg, borderRadius: '24px', padding: '35px',
            width: '100%', maxWidth: '580px', boxSizing: 'border-box',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            {!bookingSuccess ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                  <div>
                    <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '900', color: secondary }}>Guest Details</h2>
                    <p style={{ margin: 0, fontSize: '13px', color: muted }}>
                      {selectedHotel?.name} • {getNights()} Night{getNights() > 1 ? 's' : ''} • Rs. {(selectedHotel?.price * getNights()).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => setShowBookingForm(false)} style={{
                    background: pageBg, border: 'none', borderRadius: '50%',
                    width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', color: muted
                  }}>&times;</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>FULL NAME *</label>
                    <input value={guestDetails.name} onChange={e => setGuestDetails({ ...guestDetails, name: e.target.value })} placeholder="As per ID" style={inputStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={labelStyle}>CONTACT NUMBER *</label>
                      <input value={guestDetails.contact} onChange={e => setGuestDetails({ ...guestDetails, contact: e.target.value })} placeholder="10-digit number" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>EMAIL *</label>
                      <input value={guestDetails.email} onChange={e => setGuestDetails({ ...guestDetails, email: e.target.value })} placeholder="Email address" style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={labelStyle}>AADHAR NO. (optional)</label>
                      <input value={guestDetails.aadhar} onChange={e => setGuestDetails({ ...guestDetails, aadhar: e.target.value })} placeholder="12-digit Aadhar" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>PAN CARD NO. (optional)</label>
                      <input value={guestDetails.pan} onChange={e => setGuestDetails({ ...guestDetails, pan: e.target.value })} placeholder="PAN number" style={inputStyle} />
                    </div>
                  </div>
                </div>
                {bookingError && <p style={{ color: '#ff7675', fontSize: '13px', textAlign: 'center', marginBottom: '12px', fontWeight: '600' }}>{bookingError}</p>}
                <button onClick={handleBookingSubmit} disabled={bookingLoading} style={{
                  width: '100%', background: btnBg, color: btnText, border: 'none',
                  padding: '16px', borderRadius: '14px', fontSize: '16px', fontWeight: '900',
                  cursor: 'pointer', fontFamily: 'Poppins, sans-serif', opacity: bookingLoading ? 0.7 : 1
                }}>
                  {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
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
                <p style={{ color: muted, fontSize: '14px', marginBottom: '6px' }}>{selectedHotel?.name} • {selectedHotel?.area}</p>
                <p style={{ color: muted, fontSize: '14px', marginBottom: '20px' }}>{checkIn} → {checkOut} • {guests} Guest{guests > 1 ? 's' : ''}</p>
                <div style={{ background: pageBg, borderRadius: '14px', padding: '16px', marginBottom: '25px', fontSize: '20px', fontWeight: '900', color: brandGold }}>
                  Total Paid: Rs. {(selectedHotel?.price * getNights()).toLocaleString()}
                </div>
                <button onClick={() => navigate('/hotels')} style={{
                  background: btnBg, color: btnText, border: 'none',
                  padding: '14px 40px', borderRadius: '30px', fontWeight: '800',
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

export default HotelResults;