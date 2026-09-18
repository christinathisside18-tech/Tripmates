import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from './tripmates logo.jpeg';
import { useTheme } from './ThemeContext';

const TripMatesMagic = ({ user }) => {
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

  // BUDDY FINDER STATE
  const [buddyDestination, setBuddyDestination] = useState('');
  const [buddyDate, setBuddyDate]               = useState('');
  const [buddyReturnDate, setBuddyReturnDate]   = useState('');
  const [buddyCount, setBuddyCount]             = useState(null);
  const [buddyRegistered, setBuddyRegistered]   = useState(false);
  const [buddyLoading, setBuddyLoading]         = useState(false);
  const [buddyError, setBuddyError]             = useState('');

  // GROUP TRIP STATE
  const [groupTripView, setGroupTripView]       = useState('main');
  const [groupTrips, setGroupTrips]             = useState([]);
  const [groupTripsLoading, setGroupTripsLoading] = useState(false);
  const [myGroupTrip, setMyGroupTrip]           = useState(null);
  const [createTripData, setCreateTripData]     = useState({
    destination: '', travelDate: '', returnDate: '',
    totalSeats: 4, tripType: 'group', description: '', isVisible: true
  });
  const [createTripLoading, setCreateTripLoading] = useState(false);
  const [joinMessage, setJoinMessage]           = useState('');
  const [joinedTrips, setJoinedTrips]           = useState([]);
  const [notifiedTrips, setNotifiedTrips]       = useState([]);
  const [filterDestination, setFilterDestination] = useState('');

  // MYSTERY TRIP STATE
  const [mysteryTrip, setMysteryTrip]           = useState(null);
  const [mysteryLoading, setMysteryLoading]     = useState(false);

  // QUIZ STATE
  const [quizStarted, setQuizStarted]           = useState(false);
  const [quizStep, setQuizStep]                 = useState(0);
  const [quizAnswers, setQuizAnswers]           = useState([]);
  const [quizResult, setQuizResult]             = useState(null);

  // CHALLENGE STATE
  const [challengeDone, setChallengeDone]       = useState(false);
  const [challengeIndex]                        = useState(() => new Date().getDate() % 10);

  // BUDDY CHECK ON MOUNT
  useEffect(() => {
    const checkBuddy = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/buddy-finder/user/${userData?.username}`);
        if (res.data.active) {
          setBuddyRegistered(true);
          setBuddyDestination(res.data.entry.destination);
          setBuddyDate(res.data.entry.travelDate);
        }
      } catch (err) { console.error(err); }
    };
    const checkMyTrip = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/group-trip/user/${userData?.username}`);
        if (res.data.length > 0) setMyGroupTrip(res.data[0]);
      } catch (err) { console.error(err); }
    };
    if (userData?.username) { checkBuddy(); checkMyTrip(); }
  }, [userData?.username]);

  // BUDDY FINDER FUNCTIONS
  const handleBuddyRegister = async () => {
    if (!buddyDestination || !buddyDate) { setBuddyError('Destination aur date required!'); return; }
    setBuddyLoading(true); setBuddyError('');
    try {
      await axios.post('http://localhost:5001/api/buddy-finder', {
        username: userData?.username, destination: buddyDestination,
        travelDate: buddyDate, returnDate: buddyReturnDate, isActive: true, isAnonymous: true
      });
      const res = await axios.get(`http://localhost:5001/api/buddy-finder/${buddyDestination}/${buddyDate}`);
      setBuddyCount(res.data.count);
      setBuddyRegistered(true);
    } catch (err) { setBuddyError('Failed. Check server connection.'); }
    setBuddyLoading(false);
  };

  const handleBuddyLeave = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/buddy-finder/${userData?.username}`);
      setBuddyRegistered(false); setBuddyCount(null);
      setBuddyDestination(''); setBuddyDate(''); setBuddyReturnDate('');
    } catch (err) { console.error(err); }
  };

  // GROUP TRIP FUNCTIONS
  const fetchGroupTrips = async (dest = '') => {
    setGroupTripsLoading(true);
    try {
      const url = dest ? `http://localhost:5001/api/group-trip?destination=${dest}` : 'http://localhost:5001/api/group-trip';
      const res = await axios.get(url);
      setGroupTrips(res.data);
    } catch (err) { console.error(err); }
    setGroupTripsLoading(false);
  };

  const handleCreateGroupTrip = async () => {
    if (!createTripData.destination || !createTripData.travelDate) return;
    setCreateTripLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/group-trip', {
        ...createTripData, organizerUsername: userData?.username, organizerName: userData?.fullName,
      });
      setMyGroupTrip(res.data.trip);
      setGroupTripView('main');
    } catch (err) { console.error(err); }
    setCreateTripLoading(false);
  };

  const handleJoinRequest = async (tripId) => {
    try {
      await axios.post(`http://localhost:5001/api/group-trip/${tripId}/join`, {
        username: userData?.username, message: joinMessage
      });
      setJoinedTrips([...joinedTrips, tripId]); setJoinMessage('');
    } catch (err) { console.error(err); }
  };

  const handleNotifyOrganizer = async (tripId) => {
    try {
      await axios.post(`http://localhost:5001/api/group-trip/${tripId}/notify`, { username: userData?.username });
      setNotifiedTrips([...notifiedTrips, tripId]);
    } catch (err) { console.error(err); }
  };

  const handleCancelMyTrip = async () => {
    if (!myGroupTrip) return;
    try {
      await axios.delete(`http://localhost:5001/api/group-trip/${myGroupTrip._id}`);
      setMyGroupTrip(null);
    } catch (err) { console.error(err); }
  };

  const tripTypeLabels = {
    'group':             { label: 'Group Trip',            color: '#0984e3' },
    'solo_open':         { label: 'Solo, Open to Company', color: '#00b894' },
    'friend_backed_out': { label: 'Friend Backed Out',      color: '#fd7900' },
  };

  // MYSTERY TRIP DATA
  const mysteryDestinations = [
    { city: 'Coorg',         state: 'Karnataka',         vibe: 'Misty Coffee Trails',        duration: '3 days', budget: 'Rs. 8K-15K',  bestFor: 'Couples & Nature Lovers',    highlights: ["Raja's Seat Sunset", 'Abbey Falls Trek', 'Coffee Plantation Tour', 'Tibetan Monastery'],    weather: '18-24 C, Cool & Misty' },
    { city: 'Spiti Valley',  state: 'Himachal Pradesh',  vibe: 'The Cold Desert',             duration: '7 days', budget: 'Rs. 25K-45K', bestFor: 'Adventure Seekers',          highlights: ['Key Monastery', 'Chandratal Lake', 'Kunzum Pass', 'Pin Valley Trek'],                        weather: '-5 to 15 C, Freezing Cold' },
    { city: 'Hampi',         state: 'Karnataka',         vibe: 'Ruins & Boulders',            duration: '2 days', budget: 'Rs. 4K-8K',   bestFor: 'History & Culture Buffs',    highlights: ['Virupaksha Temple', 'Vittala Temple', 'Matanga Hill Sunrise', 'Coracle Ride'],               weather: '25-35 C, Hot & Sunny' },
    { city: 'Majuli Island', state: 'Assam',             vibe: 'River Island Paradise',       duration: '3 days', budget: 'Rs. 5K-10K',  bestFor: 'Offbeat Explorers',          highlights: ['Satras Monasteries', 'Mishing Tribal Culture', 'Pottery Village', 'Sunset on Brahmaputra'],  weather: '20-30 C, Humid' },
    { city: 'Ziro Valley',   state: 'Arunachal Pradesh', vibe: 'Hidden Himalayan Valley',     duration: '4 days', budget: 'Rs. 12K-20K', bestFor: 'Music & Nature Lovers',      highlights: ['Ziro Music Festival', 'Apatani Tribal Village', 'Pine Forest Trek', 'Talley Valley'],        weather: '10-22 C, Pleasant' },
    { city: 'Dhanushkodi',   state: 'Tamil Nadu',        vibe: 'Ghost Town by the Sea',       duration: '1 day',  budget: 'Rs. 2K-4K',   bestFor: 'Mystery & History Buffs',    highlights: ['Ruins of Ghost Town', 'Confluence of Two Seas', 'Pamban Bridge View', "Sunrise at Land's End"], weather: '28-34 C, Hot & Windy' },
    { city: 'Dzukou Valley', state: 'Nagaland',          vibe: 'Valley of Flowers',           duration: '3 days', budget: 'Rs. 8K-15K',  bestFor: 'Trekkers & Nature Lovers',   highlights: ['Dzukou Valley Trek', 'Dzukou Lily Season', 'Japfu Peak Sunrise', 'Naga Village'],           weather: '5-20 C, Chilly' },
    { city: 'Chettinad',     state: 'Tamil Nadu',        vibe: 'Heritage Mansions & Cuisine', duration: '2 days', budget: 'Rs. 4K-9K',   bestFor: 'Food & Architecture Lovers', highlights: ['Chettinad Mansions', 'Authentic Cuisine', 'Athangudi Palace Tiles', 'Antique Markets'],     weather: '25-38 C, Hot' },
    { city: 'Tawang',        state: 'Arunachal Pradesh', vibe: 'Buddhist Monastery in Clouds',duration: '5 days', budget: 'Rs. 18K-30K', bestFor: 'Spiritual & Adventure',      highlights: ['Tawang Monastery', 'Sela Pass Snow', 'Pankang Teng Tso Lake', 'Bumla Pass Border'],        weather: '-5 to 12 C, Cold' },
    { city: 'Khajuraho',     state: 'Madhya Pradesh',    vibe: 'Temples & Art',               duration: '2 days', budget: 'Rs. 5K-12K',  bestFor: 'History & Art Lovers',       highlights: ['Western Group Temples', 'Light & Sound Show', 'Panna Tiger Reserve', 'Raneh Falls'],         weather: '15-35 C, Varies' },
  ];

  const generateMysteryTrip = () => {
    setMysteryLoading(true); setMysteryTrip(null);
    setTimeout(() => {
      setMysteryTrip(mysteryDestinations[Math.floor(Math.random() * mysteryDestinations.length)]);
      setMysteryLoading(false);
    }, 1800);
  };

  // QUIZ DATA
  const quizQuestions = [
    { q: 'Ideal weekend plan?',             options: ['Mountain trek all day', 'Explore local street food', 'Spa and relax by pool', 'Nightlife and dancing'] },
    { q: 'You just got 7 days off. You...', options: ['Plan a solo backpacking trip', 'Book a luxury resort', "Explore a new city's culture", 'Adventure sports destination'] },
    { q: "What's your travel bag?",         options: ['Hiking backpack', 'Designer luggage', 'Camera bag & journal', 'Just carry-on, travel light'] },
    { q: 'Dream travel companion?',         options: ['Solo — my own pace', 'Best friend gang', 'Partner/Romantic trip', 'Family trip'] },
    { q: 'First thing in a new city?',      options: ['Find the highest point and climb', 'Search for best local food', 'Visit historical monuments', 'Hit the local market'] },
  ];

  const travelPersonalities = [
    { type: 'The Summit Seeker',     desc: 'You live for heights, treks, and adrenaline. Every trip is an expedition!',            color: '#00b894', destinations: ['Manali', 'Spiti Valley', 'Rishikesh', 'Dzukou Valley'] },
    { type: 'The Foodie Explorer',   desc: 'Your itinerary is basically a food map. Culture through cuisine is your motto!',       color: '#fdcb6e', destinations: ['Mumbai', 'Chettinad', 'Delhi', 'Kolkata'] },
    { type: 'The Zen Wanderer',      desc: 'Peace, serenity and slow travel. You travel to recharge your soul.',                   color: '#74b9ff', destinations: ['Coorg', 'Rishikesh', 'Tawang', 'Ooty'] },
    { type: 'The Night Owl Traveler',desc: 'Sunsets, parties, rooftop bars and neon lights. You come alive after dark!',          color: '#a29bfe', destinations: ['Goa', 'Mumbai', 'Delhi', 'Jaipur'] },
  ];

  const handleQuizAnswer = (answerIndex) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);
    if (newAnswers.length === quizQuestions.length) {
      const counts = [0, 0, 0, 0];
      newAnswers.forEach(a => counts[a]++);
      setQuizResult(travelPersonalities[counts.indexOf(Math.max(...counts))]);
    } else { setQuizStep(quizStep + 1); }
  };

  // DAILY CHALLENGES
  const dailyChallenges = [
    { title: 'Street Food Challenge',  desc: "Try one street food you've never eaten before and share it on TripMates Feed!", points: 150 },
    { title: 'Sunrise Mission',        desc: 'Wake up before sunrise and watch it from the best spot in your city!',           points: 200 },
    { title: 'Local Market Explorer',  desc: 'Visit a local market and buy something unique for under Rs. 100!',              points: 120 },
    { title: 'Hidden Gem Hunt',        desc: "Find a place in your city that most people don't know about and post it!",      points: 180 },
    { title: 'Language Challenge',     desc: "Learn to say 5 phrases in a local language you don't speak!",                  points: 100 },
    { title: 'Travel Journal Entry',   desc: 'Write about your most memorable travel experience and share on feed!',          points: 130 },
    { title: 'Local Transport Day',    desc: 'Use only local public transport the whole day — no cabs!',                     points: 160 },
    { title: 'Sunset Spot Challenge',  desc: 'Find the best sunset spot in your city and capture it!',                       points: 175 },
    { title: 'Temple/Monument Visit',  desc: "Visit a historical monument or temple in your city you've never been to!",     points: 140 },
    { title: 'Cook Local Recipe',      desc: 'Cook a traditional dish from a state you want to visit!',                      points: 110 },
  ];

  const todaysChallenge = dailyChallenges[challengeIndex];

  // STYLES
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

  const sectionCard = {
    background: cardBg, borderRadius: '24px', padding: '28px',
    marginBottom: '24px', border: `1px solid ${theme.cardBorder}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  };

  return (
    <div style={{ minHeight: '100vh', background: pageBg, fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        .magic-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .magic-btn { transition: all 0.2s; }
        .quiz-option:hover { border-color: ${accent} !important; background: ${accent}11 !important; }
        .quiz-option { transition: all 0.2s; }
        @media (max-width: 600px) {
          .buddy-grid { grid-template-columns: 1fr !important; }
          .nav-pad { padding: 10px 16px !important; }
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
        <div style={{ fontWeight: '700', fontSize: '15px', color: navText }}>TripMates Magic</div>
        <button onClick={() => navigate('/feed')} style={{
          background: 'none', border: `2px solid ${navText}`, color: navText,
          padding: '7px 18px', borderRadius: '30px', fontWeight: '700',
          cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
        }}>Back to Feed</button>
      </nav>

      {/* Hero */}
      <div style={{ background: theme.coverBg, padding: '40px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '900', color: 'white' }}>
          TripMates <span style={{ color: accent }}>Magic</span>
        </h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
          Buddy Finder • Mystery Trips • Quiz • Daily Challenges
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 20px', boxSizing: 'border-box' }}>

        {/* 1. BUDDY FINDER */}
        <div style={{ ...sectionCard, borderTop: `4px solid ${accent}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: secondary }}>Buddy Finder</h2>
            <span style={{ background: `${accent}22`, color: accent, padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', border: `1px solid ${accent}44` }}>NEW</span>
          </div>
          <p style={{ color: muted, fontSize: '13px', margin: '0 0 20px' }}>
            Register your trip, find travel buddies, or join someone else's adventure — anonymous until you choose to connect!
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap' }}>
            {[{ key: 'main', label: 'My Trip' }, { key: 'create', label: '+ Plan a Trip' }, { key: 'browse', label: 'Browse Trips' }].map(tab => (
              <button key={tab.key} onClick={() => { setGroupTripView(tab.key); if (tab.key === 'browse') fetchGroupTrips(); }} style={{
                padding: '8px 18px', borderRadius: '30px', border: 'none', cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '13px',
                background: groupTripView === tab.key ? btnBg : pageBg,
                color: groupTripView === tab.key ? btnText : muted,
                boxShadow: groupTripView === tab.key ? `0 4px 12px ${accent}44` : 'none',
                transition: 'all 0.2s'
              }}>{tab.label}</button>
            ))}
          </div>

          {/* MY TRIP TAB */}
          {groupTripView === 'main' && (
            <>
              <div style={{ background: pageBg, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.cardBorder}`, marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '800', color: secondary }}>Anonymous Destination Check</h4>
                <p style={{ color: muted, fontSize: '12px', margin: '0 0 14px' }}>See how many TripMates are visiting the same place — no names shown!</p>
                {!buddyRegistered ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }} className="buddy-grid">
                      <div>
                        <label style={labelStyle}>DESTINATION *</label>
                        <input value={buddyDestination} onChange={e => setBuddyDestination(e.target.value)} placeholder="e.g. Goa, Manali" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>TRAVEL DATE *</label>
                        <input type="date" value={buddyDate} onChange={e => setBuddyDate(e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ background: `${accent}11`, border: `1px solid ${accent}33`, borderRadius: '10px', padding: '8px 12px', marginBottom: '12px', fontSize: '12px', color: muted }}>
                      100% anonymous — only count shown, no names or details ever disclosed.
                    </div>
                    {buddyError && <p style={{ color: '#ff7675', fontSize: '13px', marginBottom: '10px', fontWeight: '600' }}>{buddyError}</p>}
                    <button className="magic-btn" onClick={handleBuddyRegister} disabled={buddyLoading} style={{
                      width: '100%', background: btnBg, color: btnText, border: 'none',
                      padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: '800',
                      cursor: 'pointer', fontFamily: 'Poppins, sans-serif', opacity: buddyLoading ? 0.7 : 1
                    }}>{buddyLoading ? 'Checking...' : 'Check My Destination'}</button>
                  </>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: '900', color: secondary }}>
                      {buddyCount !== null
                        ? buddyCount <= 1 ? "You're the first one here!" : `${buddyCount - 1} TripMates also visiting!`
                        : "You're registered!"}
                    </h3>
                    <p style={{ color: muted, fontSize: '13px', margin: 0 }}>
                      <strong style={{ color: secondary }}>{buddyDestination}</strong> • <strong style={{ color: secondary }}>{buddyDate}</strong>
                    </p>
                    <button className="magic-btn" onClick={handleBuddyLeave} style={{
                      marginTop: '14px', background: pageBg, border: `1.5px solid ${theme.cardBorder}`,
                      color: muted, padding: '8px 20px', borderRadius: '30px', fontWeight: '700',
                      cursor: 'pointer', fontSize: '12px', fontFamily: 'Poppins, sans-serif'
                    }}>Leave</button>
                  </div>
                )}
              </div>

              {myGroupTrip && (
                <div style={{ background: `${accent}11`, borderRadius: '16px', padding: '20px', border: `1px solid ${accent}33` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: tripTypeLabels[myGroupTrip.tripType]?.color, background: `${tripTypeLabels[myGroupTrip.tripType]?.color}15`, padding: '2px 10px', borderRadius: '20px' }}>
                          {tripTypeLabels[myGroupTrip.tripType]?.label}
                        </span>
                      </div>
                      <h4 style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: '800', color: secondary }}>{myGroupTrip.destination}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: muted }}>{myGroupTrip.travelDate} {myGroupTrip.returnDate && `to ${myGroupTrip.returnDate}`}</p>
                    </div>
                    <button className="magic-btn" onClick={handleCancelMyTrip} style={{
                      background: '#ff767522', border: '1px solid #ff767555', color: '#ff7675',
                      padding: '6px 14px', borderRadius: '20px', fontWeight: '700',
                      cursor: 'pointer', fontSize: '12px', fontFamily: 'Poppins, sans-serif'
                    }}>Cancel</button>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: muted, flexWrap: 'wrap' }}>
                    <span>Seats: <strong style={{ color: secondary }}>{myGroupTrip.filledSeats}/{myGroupTrip.totalSeats}</strong></span>
                    <span>Requests: <strong style={{ color: accent }}>{myGroupTrip.joinRequests?.length || 0}</strong></span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* CREATE TRIP TAB */}
          {groupTripView === 'create' && (
            <div>
              <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '800', color: secondary }}>What's your situation?</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {Object.entries(tripTypeLabels).map(([key, val]) => (
                  <button key={key} onClick={() => setCreateTripData({ ...createTripData, tripType: key })} style={{
                    padding: '12px 16px', borderRadius: '12px',
                    border: `2px solid ${createTripData.tripType === key ? val.color : theme.cardBorder}`,
                    background: createTripData.tripType === key ? `${val.color}11` : cardBg,
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'Poppins, sans-serif',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: createTripData.tripType === key ? val.color : secondary }}>{val.label}</div>
                    <div style={{ fontSize: '12px', color: muted }}>
                      {key === 'group' && "I'm organizing a group trip and want people to join"}
                      {key === 'solo_open' && 'Going solo but open to meeting travel companions'}
                      {key === 'friend_backed_out' && 'My companion bailed — looking for someone to join'}
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }} className="buddy-grid">
                <div>
                  <label style={labelStyle}>DESTINATION *</label>
                  <input value={createTripData.destination} onChange={e => setCreateTripData({ ...createTripData, destination: e.target.value })} placeholder="e.g. Goa, Manali" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>TRAVEL DATE *</label>
                  <input type="date" value={createTripData.travelDate} onChange={e => setCreateTripData({ ...createTripData, travelDate: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }} className="buddy-grid">
                <div>
                  <label style={labelStyle}>RETURN DATE (optional)</label>
                  <input type="date" value={createTripData.returnDate} onChange={e => setCreateTripData({ ...createTripData, returnDate: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>TOTAL SEATS (incl. you)</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${theme.cardBorder}`, borderRadius: '10px', overflow: 'hidden', background: cardBg }}>
                    <button onClick={() => setCreateTripData({ ...createTripData, totalSeats: Math.max(2, createTripData.totalSeats - 1) })} style={{ width: '44px', height: '48px', border: 'none', background: pageBg, fontSize: '20px', cursor: 'pointer', color: muted, fontWeight: 'bold' }}>-</button>
                    <span style={{ flex: 1, textAlign: 'center', fontWeight: '700', fontSize: '15px', color: secondary }}>{createTripData.totalSeats}</span>
                    <button onClick={() => setCreateTripData({ ...createTripData, totalSeats: Math.min(12, createTripData.totalSeats + 1) })} style={{ width: '44px', height: '48px', border: 'none', background: pageBg, fontSize: '20px', cursor: 'pointer', color: accent, fontWeight: 'bold' }}>+</button>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>TRIP DESCRIPTION (optional)</label>
                <textarea value={createTripData.description} onChange={e => setCreateTripData({ ...createTripData, description: e.target.value })} placeholder="Tell people about your trip plan, vibe, budget range..." style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: pageBg, borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', border: `1px solid ${theme.cardBorder}` }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: secondary }}>Show my name to others</div>
                  <div style={{ fontSize: '11px', color: muted }}>Off = anonymous trip listing</div>
                </div>
                <div onClick={() => setCreateTripData({ ...createTripData, isVisible: !createTripData.isVisible })} style={{
                  width: '46px', height: '26px', borderRadius: '13px', cursor: 'pointer',
                  background: createTripData.isVisible ? accent : theme.cardBorder, position: 'relative', transition: 'all 0.2s'
                }}>
                  <div style={{ position: 'absolute', top: '3px', left: createTripData.isVisible ? '23px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                </div>
              </div>

              <button className="magic-btn" onClick={handleCreateGroupTrip} disabled={createTripLoading || !createTripData.destination || !createTripData.travelDate} style={{
                width: '100%', background: btnBg, color: btnText, border: 'none',
                padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: '800',
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                opacity: (createTripLoading || !createTripData.destination || !createTripData.travelDate) ? 0.6 : 1
              }}>{createTripLoading ? 'Creating...' : 'Post My Trip'}</button>
            </div>
          )}

          {/* BROWSE TRIPS TAB */}
          {groupTripView === 'browse' && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <input value={filterDestination} onChange={e => setFilterDestination(e.target.value)} placeholder="Filter by destination..." style={{ ...inputStyle, flex: 1 }} />
                <button className="magic-btn" onClick={() => fetchGroupTrips(filterDestination)} style={{
                  background: btnBg, color: btnText, border: 'none', padding: '12px 20px',
                  borderRadius: '10px', fontWeight: '700', cursor: 'pointer',
                  fontSize: '13px', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap'
                }}>Search</button>
              </div>

              {groupTripsLoading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: muted }}>Loading trips...</div>
              ) : groupTrips.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: muted, background: pageBg, borderRadius: '16px', border: `1px dashed ${theme.cardBorder}` }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>No trips found</div>
                  <div style={{ fontSize: '12px' }}>Be the first to post a trip!</div>
                </div>
              ) : (
                groupTrips.map((trip, i) => {
                  const typeInfo = tripTypeLabels[trip.tripType] || tripTypeLabels['group'];
                  const isOwn = trip.organizerUsername === userData?.username;
                  const hasJoined = joinedTrips.includes(trip._id);
                  const hasNotified = notifiedTrips.includes(trip._id);
                  const seatsLeft = trip.totalSeats - trip.filledSeats;
                  return (
                    <div key={i} style={{
                      background: cardBg, borderRadius: '16px', padding: '20px',
                      marginBottom: '14px', border: `1px solid ${theme.cardBorder}`,
                      borderLeft: `4px solid ${typeInfo.color}`,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: typeInfo.color, background: `${typeInfo.color}15`, padding: '2px 8px', borderRadius: '20px' }}>{typeInfo.label}</span>
                            {isOwn && <span style={{ fontSize: '11px', fontWeight: '700', color: accent, background: `${accent}15`, padding: '2px 8px', borderRadius: '20px' }}>Your Trip</span>}
                          </div>
                          <h4 style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: '800', color: secondary }}>{trip.destination}</h4>
                          <p style={{ margin: 0, fontSize: '12px', color: muted }}>{trip.travelDate} {trip.returnDate && `to ${trip.returnDate}`}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '13px', fontWeight: '800', color: seatsLeft > 0 ? '#00b894' : '#ff7675' }}>
                            {seatsLeft > 0 ? `${seatsLeft} seat${seatsLeft > 1 ? 's' : ''} left` : 'Full'}
                          </div>
                          <div style={{ fontSize: '11px', color: muted }}>
                            {trip.isVisible && trip.organizerName ? `by ${trip.organizerName}` : 'Anonymous trip'}
                          </div>
                        </div>
                      </div>

                      {trip.description && (
                        <p style={{ margin: '0 0 12px', fontSize: '13px', color: muted, fontStyle: 'italic', lineHeight: 1.5 }}>"{trip.description}"</p>
                      )}

                      {!isOwn && seatsLeft > 0 && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {!hasJoined ? (
                            <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                              <input placeholder="Short message (optional)..." value={joinMessage} onChange={e => setJoinMessage(e.target.value)} style={{ ...inputStyle, flex: 1, padding: '8px 12px', fontSize: '12px' }} />
                              <button className="magic-btn" onClick={() => handleJoinRequest(trip._id)} style={{
                                background: btnBg, color: btnText, border: 'none',
                                padding: '8px 16px', borderRadius: '10px', fontWeight: '700',
                                cursor: 'pointer', fontSize: '12px', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap'
                              }}>Connect</button>
                            </div>
                          ) : (
                            <div style={{ background: '#00b89415', border: '1px solid #00b89444', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: '700', color: '#00b894' }}>Request Sent!</div>
                          )}
                          {!hasNotified ? (
                            <button className="magic-btn" onClick={() => handleNotifyOrganizer(trip._id)} style={{
                              background: pageBg, border: `1.5px solid ${theme.cardBorder}`, color: muted,
                              padding: '8px 14px', borderRadius: '10px', fontWeight: '700',
                              cursor: 'pointer', fontSize: '12px', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap'
                            }}>Ping Anonymously</button>
                          ) : (
                            <div style={{ background: `${accent}15`, border: `1px solid ${accent}33`, borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: '700', color: accent }}>Pinged!</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* 2. MYSTERY TRIP */}
        <div style={{ ...sectionCard, borderTop: '4px solid #e84393' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: '900', color: secondary }}>Mystery Trip Generator</h2>
          <p style={{ color: muted, fontSize: '13px', marginBottom: '20px' }}>Let us surprise you with a hidden gem destination you've probably never considered!</p>

          <button className="magic-btn" onClick={generateMysteryTrip} disabled={mysteryLoading} style={{
            width: '100%', background: 'linear-gradient(135deg, #e84393, #fd7900)',
            color: 'white', border: 'none', padding: '14px', borderRadius: '12px',
            fontSize: '15px', fontWeight: '800', cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif', marginBottom: '20px', opacity: mysteryLoading ? 0.7 : 1
          }}>{mysteryLoading ? 'Finding your perfect destination...' : 'Surprise Me!'}</button>

          {mysteryTrip && (
            <div style={{ background: pageBg, borderRadius: '16px', padding: '22px', border: `1px solid ${theme.cardBorder}` }}>
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: '900', color: secondary }}>{mysteryTrip.city}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: muted }}>{mysteryTrip.state} • {mysteryTrip.vibe}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                {[{ label: 'Duration', value: mysteryTrip.duration }, { label: 'Budget', value: mysteryTrip.budget }, { label: 'Best For', value: mysteryTrip.bestFor }, { label: 'Weather', value: mysteryTrip.weather }].map((item, i) => (
                  <div key={i} style={{ background: cardBg, borderRadius: '10px', padding: '10px 14px', border: `1px solid ${theme.cardBorder}` }}>
                    <div style={{ fontSize: '10px', color: muted, fontWeight: '700', letterSpacing: '1px' }}>{item.label.toUpperCase()}</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: secondary, marginTop: '2px' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: muted, letterSpacing: '1px', marginBottom: '8px' }}>MUST DO</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {mysteryTrip.highlights.map((h, i) => (
                  <span key={i} style={{ background: cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: secondary, fontWeight: '600' }}>{h}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. TRAVEL PERSONALITY QUIZ */}
        <div style={{ ...sectionCard, borderTop: '4px solid #6c5ce7' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: '900', color: secondary }}>Travel Personality Quiz</h2>
          <p style={{ color: muted, fontSize: '13px', marginBottom: '20px' }}>5 quick questions to discover your travel personality type!</p>

          {!quizStarted && !quizResult && (
            <button className="magic-btn" onClick={() => setQuizStarted(true)} style={{
              width: '100%', background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
              color: 'white', border: 'none', padding: '14px', borderRadius: '12px',
              fontSize: '15px', fontWeight: '800', cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
            }}>Start Quiz</button>
          )}

          {quizStarted && !quizResult && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', color: muted, fontWeight: '600' }}>Question {quizStep + 1} of {quizQuestions.length}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {quizQuestions.map((_, i) => (
                    <div key={i} style={{ width: '28px', height: '4px', borderRadius: '2px', background: i <= quizStep ? '#6c5ce7' : theme.cardBorder }} />
                  ))}
                </div>
              </div>
              <h3 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: '800', color: secondary }}>{quizQuestions[quizStep].q}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {quizQuestions[quizStep].options.map((opt, i) => (
                  <button key={i} className="quiz-option" onClick={() => handleQuizAnswer(i)} style={{
                    padding: '13px 18px', borderRadius: '12px', border: `1.5px solid ${theme.cardBorder}`,
                    background: cardBg, color: secondary, fontWeight: '600', fontSize: '14px',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'Poppins, sans-serif'
                  }}>{opt}</button>
                ))}
              </div>
            </div>
          )}

          {quizResult && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '900', color: quizResult.color }}>{quizResult.type}</h3>
              <p style={{ color: muted, fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>{quizResult.desc}</p>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: muted, letterSpacing: '1px', marginBottom: '8px' }}>YOUR DREAM DESTINATIONS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                  {quizResult.destinations.map((d, i) => (
                    <span key={i} style={{ background: `${quizResult.color}15`, color: quizResult.color, border: `1px solid ${quizResult.color}44`, borderRadius: '20px', padding: '4px 14px', fontSize: '13px', fontWeight: '700' }}>{d}</span>
                  ))}
                </div>
              </div>
              <button className="magic-btn" onClick={() => { setQuizStarted(false); setQuizStep(0); setQuizAnswers([]); setQuizResult(null); }} style={{
                background: pageBg, border: `1.5px solid ${theme.cardBorder}`, color: muted,
                padding: '10px 24px', borderRadius: '30px', fontWeight: '700',
                cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
              }}>Retake Quiz</button>
            </div>
          )}
        </div>

        {/* 4. DAILY CHALLENGE */}
        <div style={{ ...sectionCard, borderTop: '4px solid #00b894' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: '900', color: secondary }}>Daily Travel Challenge</h2>
          <p style={{ color: muted, fontSize: '13px', marginBottom: '20px' }}>A new challenge every day — complete it and earn bonus reward points!</p>

          <div style={{ background: pageBg, borderRadius: '16px', padding: '24px', border: `1px solid ${theme.cardBorder}`, textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '900', color: secondary }}>{todaysChallenge.title}</h3>
            <p style={{ color: muted, fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>{todaysChallenge.desc}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${accent}15`, border: `1px solid ${accent}33`, borderRadius: '20px', padding: '6px 16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '14px', fontWeight: '900', color: accent }}>+{todaysChallenge.points} pts</span>
              <span style={{ fontSize: '12px', color: muted }}>on completion</span>
            </div>
            {!challengeDone ? (
              <button className="magic-btn" onClick={() => setChallengeDone(true)} style={{
                display: 'block', width: '100%', background: 'linear-gradient(135deg, #00b894, #00cec9)',
                color: 'white', border: 'none', padding: '14px', borderRadius: '12px',
                fontSize: '15px', fontWeight: '800', cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
              }}>Mark as Complete!</button>
            ) : (
              <div style={{ background: '#00b89415', border: '1px solid #00b89444', borderRadius: '12px', padding: '14px' }}>
                <p style={{ margin: 0, fontWeight: '800', fontSize: '15px', color: '#00b894' }}>Challenge Completed! +{todaysChallenge.points} pts earned!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TripMatesMagic;