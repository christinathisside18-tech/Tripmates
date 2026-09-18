import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Safety = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem('user'))?.username;

  const [personalContacts, setPersonalContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  const [addingContact, setAddingContact] = useState(false);

  const [sosLocation, setSosLocation] = useState(null);
  const [sosSent, setSosSent] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [locationShared, setLocationShared] = useState(false);

  const [safeCity, setSafeCity] = useState('');
  const [safeResult, setSafeResult] = useState(null);

  const [checkIns, setCheckIns] = useState([]);
  const [checkInMsg, setCheckInMsg] = useState('');
  const [checkInContact, setCheckInContact] = useState('');
  const [checkInSent, setCheckInSent] = useState(false);

  const [insuranceTab, setInsuranceTab] = useState(0);

  const nationalContacts = [
    { name: 'Emergency', number: '112', color: '#e74c3c' },
    { name: 'Police', number: '100', color: '#2980b9' },
    { name: 'Fire', number: '101', color: '#e67e22' },
    { name: 'Ambulance', number: '108', color: '#27ae60' },
    { name: 'Women Helpline', number: '1091', color: '#8e44ad' },
    { name: 'Tourist Helpline', number: '1363', color: '#16a085' },
    { name: 'Child Helpline', number: '1098', color: '#f39c12' },
    { name: 'Cyber Crime', number: '1930', color: '#2c3e50' },
  ];

  const citySafetyData = {
    'Mumbai': { score: 72, level: 'Moderate', tips: ['Avoid isolated areas at night', 'Keep valuables secure in local trains', 'Beware of overcharging auto-rickshaws'], safe: ['Colaba', 'Bandra', 'Juhu'], avoid: ['Dharavi at night', 'Isolated chawls'], crimeIndex: 'Medium' },
    'Delhi': { score: 58, level: 'Caution', tips: ['Use app-based cabs only', 'Avoid empty metro coaches late night', 'Keep emergency numbers saved'], safe: ['Connaught Place', 'Hauz Khas', 'Saket'], avoid: ['Isolated areas post midnight', 'Unknown alleys'], crimeIndex: 'High' },
    'Goa': { score: 78, level: 'Safe', tips: ['Lock your scooter always', 'Beach safety at night', 'Avoid unknown party invites'], safe: ['Panjim', 'Calangute', 'Anjuna'], avoid: ['Isolated beaches at night'], crimeIndex: 'Low' },
    'Jaipur': { score: 70, level: 'Moderate', tips: ['Bargain at markets, dont overpay', 'Avoid unknown guides', 'Keep hotel address handy'], safe: ['Pink City area', 'C-Scheme'], avoid: ['Outskirts after dark'], crimeIndex: 'Medium' },
    'Manali': { score: 82, level: 'Safe', tips: ['Weather can change rapidly', 'Carry altitude medicine', 'Inform hotel before trekking'], safe: ['Mall Road', 'Old Manali'], avoid: ['Unknown trek routes alone'], crimeIndex: 'Low' },
    'Bangalore': { score: 68, level: 'Moderate', tips: ['Traffic is heavy, plan time', 'Use only app cabs at night', 'Avoid isolated tech park areas late'], safe: ['Indiranagar', 'Koramangala', 'MG Road'], avoid: ['Isolated outskirts'], crimeIndex: 'Medium' },
    'Chennai': { score: 74, level: 'Safe', tips: ['Respect local customs', 'Marina Beach safety at night', 'Keep hydrated in heat'], safe: ['T Nagar', 'Anna Nagar', 'Adyar'], avoid: ['Unknown fishing areas'], crimeIndex: 'Low' },
    'Kolkata': { score: 71, level: 'Moderate', tips: ['Political rallies — avoid crowds', 'Keep cash handy, less card acceptance', 'Trust yellow taxis'], safe: ['Park Street', 'Salt Lake', 'New Town'], avoid: ['Isolated ghats at night'], crimeIndex: 'Medium' },
    'Hyderabad': { score: 76, level: 'Safe', tips: ['Old city — stay alert', 'Biryani area can be crowded', 'Use app cabs for night rides'], safe: ['Banjara Hills', 'Jubilee Hills', 'HITEC City'], avoid: ['Isolated old city lanes at night'], crimeIndex: 'Low' },
    'Rishikesh': { score: 80, level: 'Safe', tips: ['River is dangerous in monsoon', 'Verify rafting operators', 'Carry ID proof always'], safe: ['Lakshman Jhula area', 'Tapovan'], avoid: ['Unguided river activities'], crimeIndex: 'Low' },
  };

  const scamAlerts = [
    { city: 'All Cities', scam: 'Fake Taxi / Overcharging', tip: 'Always use Ola/Uber. Agree on price before boarding autos.', severity: 'High' },
    { city: 'Delhi/Agra', scam: 'Fake Guides at Monuments', tip: 'Only hire guides from official counters inside monuments.', severity: 'High' },
    { city: 'Goa', scam: 'Gem/Jewelry Scam', tip: 'Never buy "export quality" gems from strangers for reselling abroad.', severity: 'High' },
    { city: 'Mumbai', scam: 'Train Ticket Black Market', tip: 'Only buy tickets from official counters or IRCTC app.', severity: 'Medium' },
    { city: 'Jaipur', scam: 'Carpet/Textile Scam', tip: 'Dont follow strangers to "uncle\'s shop". Prices are inflated 10x.', severity: 'High' },
    { city: 'All Cities', scam: 'Fake Police/Officials', tip: 'Real police never ask for on-spot fines. Demand receipt + station visit.', severity: 'High' },
    { city: 'Hill Stations', scam: 'Petrol/Breakdown Scam', tip: 'Rent vehicles only from verified shops. Check fuel before leaving.', severity: 'Medium' },
    { city: 'All Cities', scam: 'ATM Skimming', tip: 'Use ATMs inside banks only. Cover keypad while entering PIN.', severity: 'Medium' },
  ];

  const insurancePlans = [
    { name: 'Basic Travel Cover', price: 'Rs. 299/trip', covers: ['Trip cancellation', 'Lost baggage', 'Medical emergencies up to Rs. 2L'], provider: 'Go Digit' },
    { name: 'Adventure Shield', price: 'Rs. 599/trip', covers: ['Everything in Basic', 'Adventure sports accidents', 'Evacuation cover', 'Medical up to Rs. 5L'], provider: 'HDFC ERGO' },
    { name: 'Premium Nomad', price: 'Rs. 999/trip', covers: ['Everything in Adventure', 'International coverage', 'Trip delay compensation', 'Medical up to Rs. 10L'], provider: 'Bajaj Allianz' },
  ];

  useEffect(() => {
    fetchPersonalContacts();
    fetchCheckIns();
    getLocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        pos => {
          setSosLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          fetchNearbyPlaces(pos.coords.latitude, pos.coords.longitude);
        },
        err => console.log(err),
        { enableHighAccuracy: true }
      );
    }
  };

  const fetchNearbyPlaces = async (lat, lng) => {
    setLoadingPlaces(true);
    try {
      const query = `
        [out:json];
        (
          node["amenity"="hospital"](around:3000,${lat},${lng});
          node["amenity"="police"](around:3000,${lat},${lng});
          node["amenity"="pharmacy"](around:3000,${lat},${lng});
        );
        out body;
      `;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await res.json();
      const places = data.elements.map(el => ({
        id: el.id,
        name: el.tags.name || el.tags.amenity,
        type: el.tags.amenity,
        lat: el.lat,
        lng: el.lon
      }));
      setNearbyPlaces(places);
    } catch (err) {
      console.log('Nearby places fetch failed:', err);
    }
    setLoadingPlaces(false);
  };

  const shareLocation = (type) => {
    if (!sosLocation) return;
    const locUrl = `https://maps.google.com/?q=${sosLocation.lat},${sosLocation.lng}`;
    const msg = `My live location: ${locUrl} — shared via TripMates Safety Hub`;
    if (type === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
    } else if (type === 'sms') {
      window.location.href = `sms:?body=${encodeURIComponent(msg)}`;
    } else if (type === 'copy') {
      navigator.clipboard.writeText(locUrl);
      setLocationShared(true);
      setTimeout(() => setLocationShared(false), 3000);
    }
  };

  const fetchPersonalContacts = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/emergency-contacts/${username}`);
      setPersonalContacts(res.data);
    } catch (err) {}
  };

  const fetchCheckIns = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/checkins/${username}`);
      setCheckIns(res.data);
    } catch (err) {}
  };

  const addContact = async () => {
    if (!newContact.name || !newContact.phone) return;
    try {
      await axios.post('http://localhost:5001/api/emergency-contacts', { username, ...newContact });
      setNewContact({ name: '', phone: '', relation: '' });
      setAddingContact(false);
      fetchPersonalContacts();
    } catch (err) {}
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/emergency-contacts/${id}`);
      fetchPersonalContacts();
    } catch (err) {}
  };

  const sendSOS = () => {
    const locText = sosLocation
      ? `My location: https://maps.google.com/?q=${sosLocation.lat},${sosLocation.lng}`
      : 'Location unavailable';
    const msg = `SOS from TripMates! I need help. ${locText} — ${username}`;
    const smsNumbers = personalContacts.map(c => c.phone).join(',');
    if (smsNumbers) {
      window.location.href = `sms:${smsNumbers}?body=${encodeURIComponent(msg)}`;
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
    }
    setSosSent(true);
    setTimeout(() => setSosSent(false), 5000);
  };

  const checkSafeZone = () => {
    const key = Object.keys(citySafetyData).find(c => c.toLowerCase() === safeCity.toLowerCase());
    setSafeResult(key ? citySafetyData[key] : { score: null });
  };

  const sendCheckIn = async () => {
    if (!checkInMsg || !checkInContact) return;
    const locText = sosLocation
      ? `https://maps.google.com/?q=${sosLocation.lat},${sosLocation.lng}`
      : 'Location unavailable';
    const fullMsg = `Hi! I'm safe. ${checkInMsg} — ${username} (TripMates) | My location: ${locText}`;
    window.location.href = `sms:${checkInContact}?body=${encodeURIComponent(fullMsg)}`;
    try {
      await axios.post('http://localhost:5001/api/checkins', {
        username, message: checkInMsg, contact: checkInContact,
        location: sosLocation ? `${sosLocation.lat},${sosLocation.lng}` : 'Unknown'
      });
      fetchCheckIns();
    } catch (err) {}
    setCheckInSent(true);
    setCheckInMsg('');
    setCheckInContact('');
    setTimeout(() => setCheckInSent(false), 4000);
  };

  const scoreColor = (score) => {
    if (!score) return '#999';
    if (score >= 75) return '#27ae60';
    if (score >= 60) return '#f39c12';
    return '#e74c3c';
  };

  const sectionCard = {
    background: theme.cardBg,
    border: `1.5px solid ${theme.cardBorder}`,
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
  };

  const inputStyle = {
    background: theme.inputBg,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: '10px',
    padding: '10px 14px',
    color: theme.navText,
    fontFamily: 'Poppins',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const btnPrimary = {
    background: theme.btnBg,
    color: theme.btnText,
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.pageBg, fontFamily: 'Poppins' }}>
      {/* Navbar */}
      <div style={{ background: theme.navBg, borderBottom: `2px solid ${theme.navBorder}`, padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ color: theme.navText, fontWeight: 700, fontSize: '20px', cursor: 'pointer' }} onClick={() => navigate('/feed')}>
          TripMates
        </span>
        <span style={{ color: theme.accent, fontWeight: 600, fontSize: '16px' }}>Safety Hub</span>
        <button onClick={() => navigate('/feed')} style={{ ...btnPrimary, padding: '7px 16px', fontSize: '13px' }}>Back</button>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 16px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: theme.navText, fontSize: '28px', fontWeight: 700, margin: 0 }}>Safety Hub</h1>
          <p style={{ color: theme.muted, marginTop: '8px' }}>Your safety companion for every trip</p>
        </div>

        {/* SECTION 1: SOS + MAP */}
        <div style={sectionCard}>
          <h2 style={{ color: theme.navText, fontSize: '18px', fontWeight: 700, margin: '0 0 8px' }}>SOS — Emergency Alert & Live Location</h2>
          <p style={{ color: theme.muted, fontSize: '13px', marginBottom: '16px' }}>
            Your live location is shown below. Share it instantly or send SOS to your emergency contacts.
          </p>

          {/* MAP */}
          {sosLocation ? (
            <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '16px', border: `1.5px solid ${theme.cardBorder}` }}>
              <MapContainer
                center={[sosLocation.lat, sosLocation.lng]}
                zoom={15}
                style={{ height: '320px', width: '100%' }}
                key={`${sosLocation.lat}-${sosLocation.lng}`}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="OpenStreetMap"
                />
                <Marker position={[sosLocation.lat, sosLocation.lng]}>
                  <Popup>You are here</Popup>
                </Marker>
                <Circle
                  center={[sosLocation.lat, sosLocation.lng]}
                  radius={3000}
                  pathOptions={{ color: theme.accent, fillColor: theme.accent, fillOpacity: 0.08 }}
                />
                {nearbyPlaces.map(place => {
                  const color = place.type === 'hospital' ? '#e74c3c' : place.type === 'police' ? '#2980b9' : '#27ae60';
                  const label = place.type === 'hospital' ? 'H' : place.type === 'police' ? 'P' : 'R';
                  const icon = L.divIcon({
                    html: `<div style="background:${color};color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${label}</div>`,
                    className: '',
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                  });
                  return (
                    <Marker key={place.id} position={[place.lat, place.lng]} icon={icon}>
                      <Popup>
                        <strong>{place.name}</strong><br />
                        {place.type === 'hospital' ? 'Hospital' : place.type === 'police' ? 'Police Station' : 'Pharmacy'}
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
              <div style={{ background: theme.inputBg, padding: '10px 16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: theme.navText }}><span style={{ color: '#e74c3c', fontWeight: 700 }}>H</span> Hospital</span>
                <span style={{ fontSize: '12px', color: theme.navText }}><span style={{ color: '#2980b9', fontWeight: 700 }}>P</span> Police Station</span>
                <span style={{ fontSize: '12px', color: theme.navText }}><span style={{ color: '#27ae60', fontWeight: 700 }}>R</span> Pharmacy</span>
                {loadingPlaces && <span style={{ fontSize: '12px', color: theme.muted }}>Loading nearby places...</span>}
              </div>
            </div>
          ) : (
            <div style={{ background: theme.inputBg, borderRadius: '14px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <p style={{ color: theme.muted, fontSize: '14px' }}>Getting your location... Please allow location access.</p>
            </div>
          )}

          {sosLocation && (
            <div style={{ color: theme.muted, fontSize: '12px', marginBottom: '16px' }}>
              Lat: {sosLocation.lat.toFixed(6)}, Lng: {sosLocation.lng.toFixed(6)}
            </div>
          )}

          {/* Share location buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <button onClick={() => shareLocation('whatsapp')}
              style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              Share on WhatsApp
            </button>
            <button onClick={() => shareLocation('sms')}
              style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              Share via SMS
            </button>
            <button onClick={() => shareLocation('copy')} style={btnPrimary}>
              Copy Link
            </button>
          </div>

          {locationShared && (
            <div style={{ marginBottom: '12px', background: '#d5f5e3', color: '#1e8449', borderRadius: '10px', padding: '10px 16px', fontWeight: 600, fontSize: '13px' }}>
              Location link copied to clipboard!
            </div>
          )}

          {/* SOS Button */}
          <button onClick={sendSOS}
            style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)', color: '#fff', border: 'none', borderRadius: '50px', padding: '14px 36px', fontFamily: 'Poppins', fontWeight: 700, fontSize: '18px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(231,76,60,0.4)', letterSpacing: '1px' }}>
            SEND SOS
          </button>

          {sosSent && (
            <div style={{ marginTop: '14px', background: '#d5f5e3', color: '#1e8449', borderRadius: '10px', padding: '10px 16px', fontWeight: 600, fontSize: '13px' }}>
              SOS sent to your emergency contacts!
            </div>
          )}
        </div>

        {/* SECTION 2: Emergency Contacts */}
        <div style={sectionCard}>
          <h2 style={{ color: theme.navText, fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>Emergency Contacts</h2>
          <h3 style={{ color: theme.accent, fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>National Helplines</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {nationalContacts.map(c => (
              <a key={c.number} href={`tel:${c.number}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: theme.inputBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <div>
                    <div style={{ color: theme.navText, fontWeight: 600, fontSize: '13px' }}>{c.name}</div>
                    <div style={{ color: c.color, fontWeight: 700, fontSize: '16px' }}>{c.number}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <h3 style={{ color: theme.accent, fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>My Emergency Contacts</h3>
          {personalContacts.length === 0 && (
            <p style={{ color: theme.muted, fontSize: '13px' }}>No personal contacts added yet.</p>
          )}
          {personalContacts.map(c => (
            <div key={c._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: theme.inputBg, borderRadius: '10px', padding: '10px 14px', marginBottom: '8px' }}>
              <div>
                <span style={{ color: theme.navText, fontWeight: 600, fontSize: '14px' }}>{c.name}</span>
                <span style={{ color: theme.muted, fontSize: '12px', marginLeft: '8px' }}>({c.relation})</span>
                <div style={{ color: theme.accent, fontSize: '13px', fontWeight: 600 }}>{c.phone}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={`tel:${c.phone}`}><button style={{ ...btnPrimary, padding: '6px 12px', fontSize: '12px' }}>Call</button></a>
                <button onClick={() => deleteContact(c._id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontFamily: 'Poppins', fontSize: '12px' }}>Delete</button>
              </div>
            </div>
          ))}

          {addingContact ? (
            <div style={{ background: theme.inputBg, borderRadius: '12px', padding: '16px', marginTop: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <input style={inputStyle} placeholder="Name" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} />
                <input style={inputStyle} placeholder="Phone (10 digits)" value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} />
                <input style={inputStyle} placeholder="Relation (Mom, Friend...)" value={newContact.relation} onChange={e => setNewContact({ ...newContact, relation: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={addContact} style={btnPrimary}>Save Contact</button>
                <button onClick={() => setAddingContact(false)} style={{ ...btnPrimary, background: theme.cardBorder, color: theme.navText }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingContact(true)} style={{ ...btnPrimary, marginTop: '12px' }}>+ Add Emergency Contact</button>
          )}
        </div>

        {/* SECTION 3: Safe Zone Checker */}
        <div style={sectionCard}>
          <h2 style={{ color: theme.navText, fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>Safe Zone Checker</h2>
          <p style={{ color: theme.muted, fontSize: '13px', marginBottom: '14px' }}>Check the safety rating and travel tips for Indian cities.</p>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input
              style={{ ...inputStyle, maxWidth: '300px' }}
              placeholder="Enter city (e.g. Mumbai, Goa, Delhi)"
              value={safeCity}
              onChange={e => setSafeCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkSafeZone()}
            />
            <button onClick={checkSafeZone} style={btnPrimary}>Check Safety</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {Object.keys(citySafetyData).map(city => (
              <span key={city} onClick={() => { setSafeCity(city); setSafeResult(citySafetyData[city]); }}
                style={{ background: theme.inputBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: theme.navText, cursor: 'pointer' }}>
                {city}
              </span>
            ))}
          </div>
          {safeResult && (
            safeResult.score === null ? (
              <div style={{ color: '#e74c3c', fontWeight: 600 }}>City not found. Try: Mumbai, Delhi, Goa, Jaipur...</div>
            ) : (
              <div style={{ background: theme.inputBg, borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: 700, color: scoreColor(safeResult.score) }}>{safeResult.score}</div>
                    <div style={{ fontSize: '11px', color: theme.muted }}>Safety Score</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: scoreColor(safeResult.score), fontSize: '16px', marginBottom: '4px' }}>{safeResult.level}</div>
                    <div style={{ background: theme.cardBorder, borderRadius: '20px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${safeResult.score}%`, height: '100%', background: scoreColor(safeResult.score), borderRadius: '20px' }} />
                    </div>
                    <div style={{ color: theme.muted, fontSize: '12px', marginTop: '4px' }}>Crime Index: {safeResult.crimeIndex}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ color: '#27ae60', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>Safe Areas</div>
                    {safeResult.safe.map(a => <div key={a} style={{ color: theme.navText, fontSize: '12px', marginBottom: '3px' }}>✓ {a}</div>)}
                  </div>
                  <div>
                    <div style={{ color: '#e74c3c', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>Areas to Avoid</div>
                    {safeResult.avoid.map(a => <div key={a} style={{ color: theme.navText, fontSize: '12px', marginBottom: '3px' }}>✗ {a}</div>)}
                  </div>
                </div>
                <div>
                  <div style={{ color: theme.accent, fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>Safety Tips</div>
                  {safeResult.tips.map(t => <div key={t} style={{ color: theme.navText, fontSize: '12px', marginBottom: '4px' }}>• {t}</div>)}
                </div>
              </div>
            )
          )}
        </div>

        {/* SECTION 4: Trip Check-In */}
        <div style={sectionCard}>
          <h2 style={{ color: theme.navText, fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>Trip Check-In</h2>
          <p style={{ color: theme.muted, fontSize: '13px', marginBottom: '16px' }}>
            Let your family/friends know you are safe. Sends your message + live location via SMS.
          </p>
          <div style={{ display: 'grid', gap: '10px', marginBottom: '14px' }}>
            <input style={inputStyle} placeholder="Contact phone number (with country code, e.g. 919876543210)" value={checkInContact} onChange={e => setCheckInContact(e.target.value)} />
            <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Your message (e.g. Reached Manali safely, hotel is great!)" value={checkInMsg} onChange={e => setCheckInMsg(e.target.value)} />
          </div>
          <button onClick={sendCheckIn} style={btnPrimary}>Send Check-In</button>
          {checkInSent && (
            <div style={{ marginTop: '12px', background: '#d5f5e3', color: '#1e8449', borderRadius: '10px', padding: '10px 16px', fontWeight: 600, fontSize: '13px' }}>
              Check-in sent!
            </div>
          )}
          {checkIns.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ color: theme.accent, fontSize: '14px', fontWeight: 600, margin: '0 0 10px' }}>Recent Check-Ins</h3>
              {checkIns.slice(0, 3).map(c => (
                <div key={c._id} style={{ background: theme.inputBg, borderRadius: '10px', padding: '10px 14px', marginBottom: '8px' }}>
                  <div style={{ color: theme.navText, fontSize: '13px' }}>{c.message}</div>
                  <div style={{ color: theme.muted, fontSize: '11px', marginTop: '4px' }}>To: {c.contact} | {new Date(c.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 5: Travel Insurance */}
        <div style={sectionCard}>
          <h2 style={{ color: theme.navText, fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>Travel Insurance</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {insurancePlans.map((p, i) => (
              <button key={i} onClick={() => setInsuranceTab(i)}
                style={{ ...btnPrimary, background: insuranceTab === i ? theme.btnBg : theme.inputBg, color: insuranceTab === i ? theme.btnText : theme.navText, border: `1px solid ${theme.cardBorder}` }}>
                {p.name}
              </button>
            ))}
          </div>
          {(() => {
            const p = insurancePlans[insuranceTab];
            return (
              <div style={{ background: theme.inputBg, borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ color: theme.navText, fontWeight: 700, fontSize: '16px' }}>{p.name}</div>
                    <div style={{ color: theme.muted, fontSize: '13px' }}>by {p.provider}</div>
                  </div>
                  <div style={{ color: theme.accent, fontWeight: 700, fontSize: '18px' }}>{p.price}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  {p.covers.map(c => (
                    <div key={c} style={{ color: theme.navText, fontSize: '13px', marginBottom: '6px' }}>✅ {c}</div>
                  ))}
                </div>
                <button style={{ ...btnPrimary, opacity: 0.7 }} disabled>Get Quote (Coming Soon)</button>
              </div>
            );
          })()}
        </div>

        {/* SECTION 6: Scam Alerts */}
        <div style={sectionCard}>
          <h2 style={{ color: theme.navText, fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>Scam Alerts & Travel Tips</h2>
          <p style={{ color: theme.muted, fontSize: '13px', marginBottom: '16px' }}>Common scams in India — stay informed, stay safe.</p>
          <div style={{ display: 'grid', gap: '12px' }}>
            {scamAlerts.map((s, i) => (
              <div key={i} style={{ background: theme.inputBg, borderRadius: '12px', padding: '14px 16px', borderLeft: `4px solid ${s.severity === 'High' ? '#e74c3c' : '#f39c12'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ color: theme.navText, fontWeight: 600, fontSize: '14px' }}>{s.scam}</span>
                  <span style={{ background: s.severity === 'High' ? '#fde8e8' : '#fef9e7', color: s.severity === 'High' ? '#e74c3c' : '#f39c12', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 600 }}>{s.severity}</span>
                </div>
                <div style={{ color: theme.muted, fontSize: '12px', marginBottom: '4px' }}>{s.city}</div>
                <div style={{ color: theme.navText, fontSize: '13px' }}>{s.tip}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Safety;