import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from './tripmates logo.jpeg';
import { useTheme } from './ThemeContext';

const LocalGuides = ({ user }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const userData = user || JSON.parse(localStorage.getItem('user'));

  const accent    = theme.accent;
  const navBg     = theme.navBg;
  const navText   = theme.navText;
  const pageBg    = theme.pageBg;
  const cardBg    = theme.cardBg;
  const secondary = theme.secondary;
  const muted     = theme.muted;
  const btnBg     = theme.btnBg;
  const btnText   = theme.btnText;

  const indianCities = [
    { city: 'Mumbai', state: 'Maharashtra' }, { city: 'Delhi', state: 'Delhi' },
    { city: 'Bangalore', state: 'Karnataka' }, { city: 'Chennai', state: 'Tamil Nadu' },
    { city: 'Hyderabad', state: 'Telangana' }, { city: 'Kolkata', state: 'West Bengal' },
    { city: 'Jaipur', state: 'Rajasthan' }, { city: 'Goa', state: 'Goa' },
    { city: 'Agra', state: 'Uttar Pradesh' }, { city: 'Manali', state: 'Himachal Pradesh' },
    { city: 'Rishikesh', state: 'Uttarakhand' }, { city: 'Varanasi', state: 'Uttar Pradesh' },
    { city: 'Udaipur', state: 'Rajasthan' }, { city: 'Mysore', state: 'Karnataka' },
    { city: 'Ooty', state: 'Tamil Nadu' }, { city: 'Kochi', state: 'Kerala' },
    { city: 'Thiruvananthapuram', state: 'Kerala' }, { city: 'Amritsar', state: 'Punjab' },
    { city: 'Ahmedabad', state: 'Gujarat' }, { city: 'Pune', state: 'Maharashtra' },
    { city: 'Shimla', state: 'Himachal Pradesh' }, { city: 'Darjeeling', state: 'West Bengal' },
    { city: 'Coorg', state: 'Karnataka' }, { city: 'Jodhpur', state: 'Rajasthan' },
    { city: 'Leh', state: 'Ladakh' }, { city: 'Srinagar', state: 'Jammu & Kashmir' },
  ];

  const specialtyOptions = ['Historical Sites', 'Food Tours', 'Nature & Trekking', 'Photography', 'Shopping', 'Nightlife', 'Religious Places', 'Adventure Sports', 'Cultural Experiences', 'Budget Travel', 'Luxury Tours', 'Family Friendly'];
  const languageOptions  = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Rajasthani', 'Odia'];

  // ── VIEW STATE ──────────────────────────────────────────────────
  const [view, setView] = useState('browse'); // 'browse' | 'register' | 'profile' | 'my_profile' | 'my_bookings'

  // ── BROWSE STATE ────────────────────────────────────────────────
  const [guides, setGuides] = useState([]);
  const [guidesLoading, setGuidesLoading] = useState(false);
  const [filterCity, setFilterCity] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCityDrop, setShowCityDrop] = useState(false);

  // ── REGISTER STATE ──────────────────────────────────────────────
  const [myGuideProfile, setMyGuideProfile] = useState(null);
  const [registerData, setRegisterData] = useState({
    city: '', state: '', bio: '', languages: [],
    specialties: [], pricePerHour: '', pricePerDay: '',
    experience: '', isAvailable: true
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // ── BOOKING STATE ───────────────────────────────────────────────
  const [bookingGuide, setBookingGuide] = useState(null);
  const [bookingData, setBookingData] = useState({ tourDate: '', duration: '1', bookingType: 'daily', message: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [myBookings, setMyBookings] = useState([]);

  // ── REVIEW STATE ────────────────────────────────────────────────
  const [reviewGuide, setReviewGuide] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, review: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewedGuides, setReviewedGuides] = useState([]);

  // ── ON MOUNT ────────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchGuides();
    checkMyProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchGuides = async (city = '') => {
    setGuidesLoading(true);
    try {
      const url = city ? `http://localhost:5001/api/guides?city=${city}` : 'http://localhost:5001/api/guides';
      const res = await axios.get(url);
      setGuides(res.data);
    } catch (err) { console.error(err); }
    setGuidesLoading(false);
  };

  const checkMyProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/guides/${userData?.username}`);
      setMyGuideProfile(res.data);
      setRegisterData({
        city: res.data.city, state: res.data.state, bio: res.data.bio || '',
        languages: res.data.languages, specialties: res.data.specialties,
        pricePerHour: res.data.pricePerHour || '', pricePerDay: res.data.pricePerDay || '',
        experience: res.data.experience || '', isAvailable: res.data.isAvailable
      });
    } catch (err) { /* not a guide yet */ }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/guide-booking/tourist/${userData?.username}`);
      setMyBookings(res.data);
    } catch (err) { console.error(err); }
  };

  // ── REGISTER ────────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!registerData.city || (!registerData.pricePerHour && !registerData.pricePerDay)) return;
    setRegisterLoading(true);
    try {
      await axios.post('http://localhost:5001/api/guides', {
        ...registerData, username: userData?.username, fullName: userData?.fullName,
      });
      setRegisterSuccess(true);
      checkMyProfile();
    } catch (err) { console.error(err); }
    setRegisterLoading(false);
  };

  const toggleAvailability = async () => {
    try {
      await axios.patch(`http://localhost:5001/api/guides/${userData?.username}/availability`, {
        isAvailable: !myGuideProfile?.isAvailable
      });
      checkMyProfile();
    } catch (err) { console.error(err); }
  };

  // ── BOOKING ─────────────────────────────────────────────────────
  const handleBooking = async () => {
    if (!bookingData.tourDate) return;
    setBookingLoading(true);
    try {
      const price = bookingData.bookingType === 'hourly'
        ? bookingGuide.pricePerHour * Number(bookingData.duration)
        : bookingGuide.pricePerDay * Number(bookingData.duration);
      await axios.post('http://localhost:5001/api/guide-booking', {
        guideUsername: bookingGuide.username,
        touristUsername: userData?.username,
        touristName: userData?.fullName,
        tourDate: bookingData.tourDate,
        duration: bookingData.duration,
        bookingType: bookingData.bookingType,
        totalPrice: price,
        message: bookingData.message
      });
      setBookingSuccess(true);
    } catch (err) { console.error(err); }
    setBookingLoading(false);
  };

  // ── REVIEW ──────────────────────────────────────────────────────
  const handleReview = async () => {
    setReviewLoading(true);
    try {
      await axios.post(`http://localhost:5001/api/guides/${reviewGuide.username}/review`, {
        username: userData?.username, rating: reviewData.rating, review: reviewData.review
      });
      setReviewedGuides([...reviewedGuides, reviewGuide.username]);
      setReviewGuide(null);
      fetchGuides(filterCity);
    } catch (err) { console.error(err); }
    setReviewLoading(false);
  };

  const toggleItem = (arr, item, setter, key) => {
    setter(prev => ({
      ...prev,
      [key]: prev[key].includes(item) ? prev[key].filter(x => x !== item) : [...prev[key], item]
    }));
  };

  const renderStars = (rating) => ''.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '') + ''.repeat(Math.max(0, 5 - Math.ceil(rating)));

  const getTotalPrice = () => {
    if (!bookingGuide) return 0;
    return bookingData.bookingType === 'hourly'
      ? (bookingGuide.pricePerHour || 0) * Number(bookingData.duration || 1)
      : (bookingGuide.pricePerDay || 0) * Number(bookingData.duration || 1);
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

  return (
    <div style={{ minHeight: '100vh', background: pageBg, fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        .guide-card:hover { transform: translateY(-3px); box-shadow: 0 12px 35px rgba(0,0,0,0.12) !important; }
        .guide-card { transition: all 0.25s ease; }
        .tag-btn:hover { opacity: 0.8; }
        .city-drop-item:hover { background: ${pageBg} !important; }
        @media (max-width: 600px) {
          .guide-grid { grid-template-columns: 1fr !important; }
          .nav-pad { padding: 10px 16px !important; }
          .price-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 40px', background: navBg, borderBottom: `3px solid ${accent}`,
        position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
      }} className="nav-pad">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/feed')}>
          <img src={logoImg} alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
          <h2 style={{ color: navText, margin: 0, fontSize: '18px', fontWeight: '800' }}>TripMates</h2>
        </div>
        <div style={{ fontWeight: '700', fontSize: '15px', color: navText }}>Local Guides</div>
        <button onClick={() => navigate('/feed')} style={{
          background: 'none', border: `2px solid ${navText}`, color: navText,
          padding: '7px 18px', borderRadius: '30px', fontWeight: '700',
          cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
        }}>Back to Feed</button>
      </nav>

      {/* Hero */}
      <div style={{ background: theme.coverBg, padding: '40px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '900', color: 'white' }}>
          Local <span style={{ color: accent }}>Guides</span>
        </h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
          Connect with verified local guides across India for an authentic travel experience
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px', boxSizing: 'border-box' }}>

        {/* Tab Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { key: 'browse',     label: 'Browse Guides' },
            { key: 'register',   label: myGuideProfile ? 'My Guide Profile' : 'Become a Guide' },
            { key: 'my_bookings',label: 'My Bookings' },
          ].map(tab => (
            <button key={tab.key} onClick={() => { setView(tab.key); if (tab.key === 'my_bookings') fetchMyBookings(); }} style={{
              padding: '9px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '13px',
              background: view === tab.key ? btnBg : cardBg,
              color: view === tab.key ? btnText : muted,
              boxShadow: view === tab.key ? `0 4px 12px ${accent}44` : '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.2s'
            }}>{tab.label}</button>
          ))}
        </div>

        {/* ══ BROWSE GUIDES ═══════════════════════════════════════ */}
        {view === 'browse' && (
          <div>
            {/* Search */}
            <div style={{ background: cardBg, borderRadius: '20px', padding: '20px', marginBottom: '24px', border: `1px solid ${theme.cardBorder}`, position: 'relative' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    value={filterCity}
                    onChange={e => {
                      setFilterCity(e.target.value);
                      const f = indianCities.filter(c => c.city.toLowerCase().startsWith(e.target.value.toLowerCase()));
                      setCitySuggestions(f);
                      setShowCityDrop(e.target.value.length > 0 && f.length > 0);
                    }}
                    onBlur={() => setTimeout(() => setShowCityDrop(false), 150)}
                    placeholder="Search by city (e.g. Goa, Jaipur, Mumbai...)"
                    style={inputStyle}
                  />
                  {showCityDrop && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '10px', zIndex: 100, maxHeight: '180px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginTop: '4px' }}>
                      {citySuggestions.map((item, i) => (
                        <div key={i} className="city-drop-item" onMouseDown={() => { setFilterCity(item.city); setShowCityDrop(false); }} style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: `1px solid ${theme.cardBorder}` }}>
                          <div style={{ fontWeight: '600', fontSize: '14px', color: secondary }}>{item.city}</div>
                          <div style={{ fontSize: '11px', color: muted }}>{item.state}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => fetchGuides(filterCity)} style={{
                  background: btnBg, color: btnText, border: 'none', padding: '12px 24px',
                  borderRadius: '10px', fontWeight: '700', cursor: 'pointer',
                  fontSize: '14px', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap'
                }}>Search</button>
                {filterCity && (
                  <button onClick={() => { setFilterCity(''); fetchGuides(''); }} style={{
                    background: pageBg, color: muted, border: `1px solid ${theme.cardBorder}`, padding: '12px 16px',
                    borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
                  }}>Clear</button>
                )}
              </div>
            </div>

            {guidesLoading ? (
              <div style={{ textAlign: 'center', padding: '50px', color: muted }}>Loading guides...</div>
            ) : guides.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: cardBg, borderRadius: '20px', border: `1px dashed ${theme.cardBorder}` }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}></div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: secondary, marginBottom: '6px' }}>No guides found</div>
                <div style={{ fontSize: '13px', color: muted }}>Try a different city or be the first guide here!</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }} className="guide-grid">
                {guides.map((guide, i) => (
                  <div key={i} className="guide-card" style={{
                    background: cardBg, borderRadius: '20px', padding: '22px',
                    border: `1px solid ${theme.cardBorder}`, boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    cursor: 'pointer'
                  }} onClick={() => { setSelectedGuide(guide); setView('profile'); }}>

                    {/* Guide Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{
                        width: '54px', height: '54px', borderRadius: '50%', flexShrink: 0,
                        background: theme.avatarBg, color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '900', fontSize: '20px',
                        border: `2px solid ${accent}`
                      }}>{guide.fullName?.charAt(0).toUpperCase()}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '800', fontSize: '15px', color: secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{guide.fullName}</div>
                        <div style={{ fontSize: '12px', color: muted }}>{guide.city}, {guide.state}</div>
                      </div>
                      <div style={{
                        background: guide.isAvailable ? '#00b89415' : '#ff767515',
                        color: guide.isAvailable ? '#00b894' : '#ff7675',
                        border: `1px solid ${guide.isAvailable ? '#00b89444' : '#ff767544'}`,
                        borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap'
                      }}>{guide.isAvailable ? 'Available' : 'Busy'}</div>
                    </div>

                    {/* Rating */}
                    {guide.totalReviews > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        <span style={{ color: '#f9ca24', fontSize: '14px' }}>{renderStars(guide.avgRating)}</span>
                        <span style={{ fontWeight: '700', fontSize: '13px', color: secondary }}>{guide.avgRating.toFixed(1)}</span>
                        <span style={{ fontSize: '12px', color: muted }}>({guide.totalReviews} reviews)</span>
                      </div>
                    )}

                    {/* Bio */}
                    {guide.bio && (
                      <p style={{ margin: '0 0 12px', fontSize: '12px', color: muted, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {guide.bio}
                      </p>
                    )}

                    {/* Specialties */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                      {guide.specialties?.slice(0, 3).map((s, j) => (
                        <span key={j} style={{ background: `${accent}15`, color: accent, padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', border: `1px solid ${accent}33` }}>{s}</span>
                      ))}
                      {guide.specialties?.length > 3 && (
                        <span style={{ background: pageBg, color: muted, padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '600' }}>+{guide.specialties.length - 3}</span>
                      )}
                    </div>

                    {/* Price */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {guide.pricePerHour && (
                        <div style={{ background: pageBg, borderRadius: '10px', padding: '6px 12px', border: `1px solid ${theme.cardBorder}` }}>
                          <span style={{ fontSize: '13px', fontWeight: '900', color: accent }}>Rs. {guide.pricePerHour.toLocaleString()}</span>
                          <span style={{ fontSize: '11px', color: muted }}>/hr</span>
                        </div>
                      )}
                      {guide.pricePerDay && (
                        <div style={{ background: pageBg, borderRadius: '10px', padding: '6px 12px', border: `1px solid ${theme.cardBorder}` }}>
                          <span style={{ fontSize: '13px', fontWeight: '900', color: accent }}>Rs. {guide.pricePerDay.toLocaleString()}</span>
                          <span style={{ fontSize: '11px', color: muted }}>/day</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ GUIDE PROFILE VIEW ══════════════════════════════════ */}
        {view === 'profile' && selectedGuide && (
          <div>
            <button onClick={() => setView('browse')} style={{
              background: 'none', border: 'none', color: accent, fontWeight: '700',
              cursor: 'pointer', fontSize: '14px', fontFamily: 'Poppins, sans-serif',
              marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0
            }}>← Back to Guides</button>

            <div style={{ background: cardBg, borderRadius: '24px', padding: '28px', border: `1px solid ${theme.cardBorder}`, marginBottom: '20px' }}>
              {/* Profile Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
                  background: theme.avatarBg, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '900', fontSize: '26px', border: `3px solid ${accent}`
                }}>{selectedGuide.fullName?.charAt(0).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: secondary }}>{selectedGuide.fullName}</h2>
                    <div style={{
                      background: selectedGuide.isAvailable ? '#00b89415' : '#ff767515',
                      color: selectedGuide.isAvailable ? '#00b894' : '#ff7675',
                      border: `1px solid ${selectedGuide.isAvailable ? '#00b89444' : '#ff767544'}`,
                      borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: '700'
                    }}>{selectedGuide.isAvailable ? 'Available' : 'Currently Busy'}</div>
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '14px', color: muted }}>{selectedGuide.city}, {selectedGuide.state}</p>
                  {selectedGuide.experience && (
                    <p style={{ margin: 0, fontSize: '13px', color: muted }}>{selectedGuide.experience} experience</p>
                  )}
                </div>
              </div>

              {/* Rating */}
              {selectedGuide.totalReviews > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ color: '#f9ca24', fontSize: '18px' }}>{renderStars(selectedGuide.avgRating)}</span>
                  <span style={{ fontWeight: '800', fontSize: '16px', color: secondary }}>{selectedGuide.avgRating.toFixed(1)}</span>
                  <span style={{ fontSize: '13px', color: muted }}>({selectedGuide.totalReviews} reviews)</span>
                </div>
              )}

              {/* Bio */}
              {selectedGuide.bio && (
                <p style={{ margin: '0 0 16px', fontSize: '14px', color: muted, lineHeight: 1.7, background: pageBg, padding: '14px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
                  "{selectedGuide.bio}"
                </p>
              )}

              {/* Languages */}
              {selectedGuide.languages?.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: muted, letterSpacing: '1px', marginBottom: '8px' }}>LANGUAGES</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedGuide.languages.map((l, i) => (
                      <span key={i} style={{ background: pageBg, color: secondary, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', border: `1px solid ${theme.cardBorder}` }}>{l}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialties */}
              {selectedGuide.specialties?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: muted, letterSpacing: '1px', marginBottom: '8px' }}>SPECIALTIES</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedGuide.specialties.map((s, i) => (
                      <span key={i} style={{ background: `${accent}15`, color: accent, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: `1px solid ${accent}33` }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }} className="price-grid">
                {selectedGuide.pricePerHour && (
                  <div style={{ background: pageBg, borderRadius: '14px', padding: '16px', textAlign: 'center', border: `1px solid ${theme.cardBorder}` }}>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: accent }}>Rs. {selectedGuide.pricePerHour.toLocaleString()}</div>
                    <div style={{ fontSize: '12px', color: muted, fontWeight: '600' }}>Per Hour</div>
                  </div>
                )}
                {selectedGuide.pricePerDay && (
                  <div style={{ background: pageBg, borderRadius: '14px', padding: '16px', textAlign: 'center', border: `1px solid ${theme.cardBorder}` }}>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: accent }}>Rs. {selectedGuide.pricePerDay.toLocaleString()}</div>
                    <div style={{ fontSize: '12px', color: muted, fontWeight: '600' }}>Per Day</div>
                  </div>
                )}
              </div>

              {/* Book Button */}
              {selectedGuide.username !== userData?.username && (
                <button onClick={() => { setBookingGuide(selectedGuide); setBookingSuccess(false); setBookingData({ tourDate: '', duration: '1', bookingType: selectedGuide.pricePerDay ? 'daily' : 'hourly', message: '' }); }} style={{
                  width: '100%', background: btnBg, color: btnText, border: 'none',
                  padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: '800',
                  cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                  boxShadow: `0 6px 20px ${accent}44`
                }}>Book This Guide</button>
              )}
            </div>

            {/* Reviews Section */}
            {selectedGuide.ratings?.length > 0 && (
              <div style={{ background: cardBg, borderRadius: '24px', padding: '24px', border: `1px solid ${theme.cardBorder}`, marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '800', color: secondary, letterSpacing: '1px' }}>REVIEWS</h3>
                {selectedGuide.ratings.map((r, i) => (
                  <div key={i} style={{ padding: '14px 0', borderBottom: i < selectedGuide.ratings.length - 1 ? `1px solid ${theme.cardBorder}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: theme.avatarBg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px' }}>
                        {r.username?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '700', fontSize: '13px', color: secondary }}>{r.username}</span>
                      <span style={{ color: '#f9ca24', fontSize: '13px' }}>{'★'.repeat(r.rating)}</span>
                    </div>
                    {r.review && <p style={{ margin: 0, fontSize: '13px', color: muted, lineHeight: 1.6 }}>{r.review}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Leave Review */}
            {selectedGuide.username !== userData?.username && !reviewedGuides.includes(selectedGuide.username) && (
              <div style={{ background: cardBg, borderRadius: '24px', padding: '24px', border: `1px solid ${theme.cardBorder}` }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '800', color: secondary }}>Leave a Review</h3>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>RATING</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setReviewData({ ...reviewData, rating: star })} style={{
                        background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer',
                        color: star <= reviewData.rating ? '#f9ca24' : theme.cardBorder
                      }}></button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>YOUR REVIEW</label>
                  <textarea value={reviewData.review} onChange={e => setReviewData({ ...reviewData, review: e.target.value })} placeholder="Share your experience..." style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
                </div>
                <button onClick={() => { setReviewGuide(selectedGuide); handleReview(); }} disabled={reviewLoading} style={{
                  background: btnBg, color: btnText, border: 'none', padding: '12px 28px',
                  borderRadius: '12px', fontWeight: '700', cursor: 'pointer',
                  fontSize: '14px', fontFamily: 'Poppins, sans-serif', opacity: reviewLoading ? 0.7 : 1
                }}>{reviewLoading ? 'Submitting...' : 'Submit Review'}</button>
              </div>
            )}
          </div>
        )}

        {/* ══ BECOME A GUIDE / MY PROFILE ═════════════════════════ */}
        {view === 'register' && (
          <div>
            {myGuideProfile && (
              <div style={{ background: `${accent}11`, borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', border: `1px solid ${accent}33`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '14px', color: secondary }}>Your Guide Profile is Active</div>
                  <div style={{ fontSize: '12px', color: muted }}>Currently: <strong style={{ color: myGuideProfile.isAvailable ? '#00b894' : '#ff7675' }}>{myGuideProfile.isAvailable ? 'Available' : 'Busy'}</strong></div>
                </div>
                <button onClick={toggleAvailability} style={{
                  background: myGuideProfile.isAvailable ? '#ff767515' : '#00b89415',
                  border: `1px solid ${myGuideProfile.isAvailable ? '#ff767544' : '#00b89444'}`,
                  color: myGuideProfile.isAvailable ? '#ff7675' : '#00b894',
                  padding: '8px 18px', borderRadius: '20px', fontWeight: '700',
                  cursor: 'pointer', fontSize: '12px', fontFamily: 'Poppins, sans-serif'
                }}>{myGuideProfile.isAvailable ? 'Mark as Busy' : 'Mark as Available'}</button>
              </div>
            )}

            {registerSuccess ? (
              <div style={{ background: cardBg, borderRadius: '24px', padding: '40px', textAlign: 'center', border: `1px solid ${theme.cardBorder}` }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
                <h2 style={{ margin: '0 0 10px', fontSize: '22px', fontWeight: '900', color: secondary }}>
                  {myGuideProfile ? 'Profile Updated!' : 'You\'re Now a Guide!'}
                </h2>
                <p style={{ color: muted, fontSize: '14px', marginBottom: '20px' }}>Travelers can now find and book you as their local guide!</p>
                <button onClick={() => { setRegisterSuccess(false); setView('browse'); fetchGuides(); }} style={{
                  background: btnBg, color: btnText, border: 'none', padding: '12px 30px',
                  borderRadius: '30px', fontWeight: '700', cursor: 'pointer',
                  fontSize: '14px', fontFamily: 'Poppins, sans-serif'
                }}>View All Guides</button>
              </div>
            ) : (
              <div style={{ background: cardBg, borderRadius: '24px', padding: '28px', border: `1px solid ${theme.cardBorder}` }}>
                <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: '900', color: secondary }}>
                  {myGuideProfile ? 'Update Your Profile' : 'Register as Local Guide'}
                </h2>
                <p style={{ color: muted, fontSize: '13px', margin: '0 0 24px' }}>Share your local knowledge and earn by guiding travelers!</p>

                {/* City Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }} className="price-grid">
                  <div>
                    <label style={labelStyle}>YOUR CITY *</label>
                    <select value={registerData.city} onChange={e => {
                      const found = indianCities.find(c => c.city === e.target.value);
                      setRegisterData({ ...registerData, city: e.target.value, state: found?.state || '' });
                    }} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Select City</option>
                      {indianCities.map((c, i) => <option key={i} value={c.city}>{c.city}, {c.state}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>EXPERIENCE</label>
                    <select value={registerData.experience} onChange={e => setRegisterData({ ...registerData, experience: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Select Experience</option>
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5-10 years">5-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>BIO</label>
                  <textarea value={registerData.bio} onChange={e => setRegisterData({ ...registerData, bio: e.target.value })} placeholder="Tell travelers about yourself, your expertise, and what makes you a great guide..." style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }} />
                </div>

                {/* Languages */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>LANGUAGES YOU SPEAK</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                    {languageOptions.map((l, i) => (
                      <button key={i} className="tag-btn" onClick={() => toggleItem(registerData, l, setRegisterData, 'languages')} style={{
                        padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${registerData.languages.includes(l) ? accent : theme.cardBorder}`,
                        background: registerData.languages.includes(l) ? `${accent}15` : cardBg,
                        color: registerData.languages.includes(l) ? accent : muted,
                        fontWeight: '600', fontSize: '12px', cursor: 'pointer',
                        fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s'
                      }}>{l}</button>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>YOUR SPECIALTIES</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                    {specialtyOptions.map((s, i) => (
                      <button key={i} className="tag-btn" onClick={() => toggleItem(registerData, s, setRegisterData, 'specialties')} style={{
                        padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${registerData.specialties.includes(s) ? accent : theme.cardBorder}`,
                        background: registerData.specialties.includes(s) ? `${accent}15` : cardBg,
                        color: registerData.specialties.includes(s) ? accent : muted,
                        fontWeight: '600', fontSize: '12px', cursor: 'pointer',
                        fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s'
                      }}>{s}</button>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }} className="price-grid">
                  <div>
                    <label style={labelStyle}>PRICE PER HOUR (Rs.)</label>
                    <input type="number" value={registerData.pricePerHour} onChange={e => setRegisterData({ ...registerData, pricePerHour: e.target.value })} placeholder="e.g. 500" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>PRICE PER DAY (Rs.)</label>
                    <input type="number" value={registerData.pricePerDay} onChange={e => setRegisterData({ ...registerData, pricePerDay: e.target.value })} placeholder="e.g. 2000" style={inputStyle} />
                  </div>
                </div>

                <button onClick={handleRegister} disabled={registerLoading || !registerData.city || (!registerData.pricePerHour && !registerData.pricePerDay)} style={{
                  width: '100%', background: btnBg, color: btnText, border: 'none',
                  padding: '15px', borderRadius: '14px', fontSize: '15px', fontWeight: '800',
                  cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                  opacity: (registerLoading || !registerData.city || (!registerData.pricePerHour && !registerData.pricePerDay)) ? 0.6 : 1
                }}>{registerLoading ? 'Saving...' : myGuideProfile ? 'Update Profile' : 'Register as Guide'}</button>
              </div>
            )}
          </div>
        )}

        {/* ══ MY BOOKINGS ══════════════════════════════════════════ */}
        {view === 'my_bookings' && (
          <div>
            {myBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: cardBg, borderRadius: '20px', border: `1px dashed ${theme.cardBorder}` }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}></div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: secondary, marginBottom: '6px' }}>No bookings yet</div>
                <div style={{ fontSize: '13px', color: muted }}>Browse guides and book your first local experience!</div>
              </div>
            ) : (
              myBookings.map((booking, i) => (
                <div key={i} style={{ background: cardBg, borderRadius: '18px', padding: '20px', marginBottom: '14px', border: `1px solid ${theme.cardBorder}`, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: secondary, marginBottom: '4px' }}>Guide: @{booking.guideUsername}</div>
                      <div style={{ fontSize: '13px', color: muted, marginBottom: '4px' }}>Date: {booking.tourDate} • {booking.duration} {booking.bookingType === 'hourly' ? 'hour(s)' : 'day(s)'}</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: accent }}>Rs. {booking.totalPrice?.toLocaleString()}</div>
                      {booking.message && <p style={{ margin: '8px 0 0', fontSize: '12px', color: muted, fontStyle: 'italic' }}>"{booking.message}"</p>}
                    </div>
                    <div style={{
                      background: booking.status === 'pending' ? '#f9ca2415' : booking.status === 'accepted' ? '#00b89415' : '#ff767515',
                      color: booking.status === 'pending' ? '#f9ca24' : booking.status === 'accepted' ? '#00b894' : '#ff7675',
                      border: `1px solid ${booking.status === 'pending' ? '#f9ca2444' : booking.status === 'accepted' ? '#00b89444' : '#ff767544'}`,
                      borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize'
                    }}>{booking.status}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ══ BOOKING MODAL ════════════════════════════════════════ */}
      {bookingGuide && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', zIndex: 3000, overflowY: 'auto',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          padding: '30px 20px', boxSizing: 'border-box'
        }}>
          <div style={{ background: cardBg, borderRadius: '24px', padding: '35px', width: '100%', maxWidth: '520px', boxSizing: 'border-box', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            {!bookingSuccess ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '900', color: secondary }}>Book Guide</h2>
                    <p style={{ margin: 0, fontSize: '13px', color: muted }}>{bookingGuide.fullName} • {bookingGuide.city}</p>
                  </div>
                  <button onClick={() => setBookingGuide(null)} style={{ background: pageBg, border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', color: muted }}>&times;</button>
                </div>

                {/* Booking Type */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>BOOKING TYPE</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {bookingGuide.pricePerHour && (
                      <button onClick={() => setBookingData({ ...bookingData, bookingType: 'hourly' })} style={{
                        flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                        border: `2px solid ${bookingData.bookingType === 'hourly' ? accent : theme.cardBorder}`,
                        background: bookingData.bookingType === 'hourly' ? `${accent}11` : cardBg,
                        color: bookingData.bookingType === 'hourly' ? accent : muted,
                        fontWeight: '700', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
                      }}>Per Hour<br /><span style={{ fontSize: '15px', fontWeight: '900' }}>Rs. {bookingGuide.pricePerHour}</span></button>
                    )}
                    {bookingGuide.pricePerDay && (
                      <button onClick={() => setBookingData({ ...bookingData, bookingType: 'daily' })} style={{
                        flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                        border: `2px solid ${bookingData.bookingType === 'daily' ? accent : theme.cardBorder}`,
                        background: bookingData.bookingType === 'daily' ? `${accent}11` : cardBg,
                        color: bookingData.bookingType === 'daily' ? accent : muted,
                        fontWeight: '700', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
                      }}>Per Day<br /><span style={{ fontSize: '15px', fontWeight: '900' }}>Rs. {bookingGuide.pricePerDay}</span></button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={labelStyle}>TOUR DATE *</label>
                    <input type="date" value={bookingData.tourDate} onChange={e => setBookingData({ ...bookingData, tourDate: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>{bookingData.bookingType === 'hourly' ? 'HOURS' : 'DAYS'}</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${theme.cardBorder}`, borderRadius: '10px', overflow: 'hidden', background: cardBg }}>
                      <button onClick={() => setBookingData({ ...bookingData, duration: String(Math.max(1, Number(bookingData.duration) - 1)) })} style={{ width: '44px', height: '48px', border: 'none', background: pageBg, fontSize: '20px', cursor: 'pointer', color: muted, fontWeight: 'bold' }}>-</button>
                      <span style={{ flex: 1, textAlign: 'center', fontWeight: '700', fontSize: '15px', color: secondary }}>{bookingData.duration}</span>
                      <button onClick={() => setBookingData({ ...bookingData, duration: String(Number(bookingData.duration) + 1) })} style={{ width: '44px', height: '48px', border: 'none', background: pageBg, fontSize: '20px', cursor: 'pointer', color: accent, fontWeight: 'bold' }}>+</button>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>MESSAGE (optional)</label>
                  <textarea value={bookingData.message} onChange={e => setBookingData({ ...bookingData, message: e.target.value })} placeholder="Tell the guide about your travel plans, interests..." style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} />
                </div>

                {/* Price Summary */}
                <div style={{ background: pageBg, borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', border: `1px solid ${theme.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: secondary }}>Total Amount</span>
                  <span style={{ fontSize: '20px', fontWeight: '900', color: accent }}>Rs. {getTotalPrice().toLocaleString()}</span>
                </div>

                <button onClick={handleBooking} disabled={bookingLoading || !bookingData.tourDate} style={{
                  width: '100%', background: btnBg, color: btnText, border: 'none',
                  padding: '15px', borderRadius: '14px', fontSize: '15px', fontWeight: '800',
                  cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                  opacity: (bookingLoading || !bookingData.tourDate) ? 0.7 : 1
                }}>{bookingLoading ? 'Sending Request...' : 'Send Booking Request'}</button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: theme.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px', color: 'white', fontWeight: 'bold' }}>✓</div>
                <h2 style={{ margin: '0 0 10px', fontSize: '22px', fontWeight: '900', color: secondary }}>Request Sent!</h2>
                <p style={{ color: muted, fontSize: '14px', marginBottom: '8px' }}>Your booking request has been sent to <strong>{bookingGuide.fullName}</strong></p>
                <p style={{ color: muted, fontSize: '13px', marginBottom: '20px' }}>The guide will confirm your booking soon!</p>
                <div style={{ background: pageBg, borderRadius: '12px', padding: '14px', marginBottom: '24px', fontSize: '18px', fontWeight: '900', color: accent }}>
                  Total: Rs. {getTotalPrice().toLocaleString()}
                </div>
                <button onClick={() => { setBookingGuide(null); setBookingSuccess(false); }} style={{
                  background: btnBg, color: btnText, border: 'none', padding: '12px 32px',
                  borderRadius: '30px', fontWeight: '700', cursor: 'pointer',
                  fontSize: '14px', fontFamily: 'Poppins, sans-serif'
                }}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalGuides;