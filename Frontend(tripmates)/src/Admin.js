import React, { useState } from 'react';
import axios from 'axios';
import logoImg from './tripmates logo.jpeg';


const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [view, setView] = useState('overview'); // 'overview' | 'users' | 'userDetail'
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [userDetail, setUserDetail] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const navBg = '#26215C';
  const accent = '#7F77DD';
  const pageBg = '#EEEDFE';
  const cardBg = '#ffffff';
  const secondary = '#2d3436';
  const muted = '#636e72';

  const handleLogin = async () => {
    setLoginError('');
    try {
      const res = await axios.post('http://localhost:5001/api/admin/login', loginForm);
      if (res.data.success) {
        setIsLoggedIn(true);
        loadOverview();
      }
    } catch (err) {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/admin/overview');
      setOverview(res.data);
      setView('overview');
    } catch (err) { }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/admin/users');
      setUsers(res.data);
      setView('users');
    } catch (err) { }
    setLoading(false);
  };

  const loadUserDetail = async (username) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/admin/users/${username}`);
      setUserDetail(res.data);
      setSelectedUser(username);
      setEditForm({
        fullName: res.data.user?.fullName || '',
        email: res.data.user?.email || '',
        mobileNumber: res.data.user?.mobileNumber || '',
        username: res.data.user?.username || '',
      });
      setView('userDetail');
      setActiveTab('profile');
      setEditMode(false);
    } catch (err) { }
    setLoading(false);
  };

  const saveEdit = async () => {
    try {
      await axios.patch(`http://localhost:5001/api/admin/users/${userDetail.user._id}`, editForm);
      setUserDetail(prev => ({ ...prev, user: { ...prev.user, ...editForm } }));
      setEditMode(false);
    } catch (err) {
      alert('Update failed');
    }
  };

  const deleteUser = async (username) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/users/${username}`);
      setDeleteConfirm(null);
      setUsers(prev => prev.filter(u => u.username !== username));
      if (view === 'userDetail') { setView('users'); }
    } catch (err) {
      alert('Delete failed');
    }
  };
  const [selectedUser, setSelectedUser] = useState(null); // eslint-disable-line no-unused-vars
  const generateReport = (detail) => {
  const u = detail.user;
  const now = new Date().toLocaleDateString('en-IN');
  const html = `
    <html>
    <head>
      <title>TripMates User Report - ${u.fullName}</title>
      <style>
        body { font-family: Poppins, sans-serif; padding: 40px; color: #2d3436; background: white; }
        .header { background: linear-gradient(135deg, #26215C, #7F77DD); color: white; padding: 28px 32px; border-radius: 16px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.8; }
        .header .date { font-size: 12px; opacity: 0.7; text-align: right; }
        .section { margin-bottom: 24px; }
        .section-title { font-size: 11px; font-weight: 800; color: #636e72; letter-spacing: 1.5px; margin-bottom: 12px; border-bottom: 2px solid #EEEDFE; padding-bottom: 6px; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .info-box { background: #EEEDFE; border-radius: 10px; padding: 12px 16px; }
        .info-box .label { font-size: 10px; font-weight: 700; color: #636e72; margin-bottom: 4px; }
        .info-box .val { font-size: 14px; font-weight: 800; color: #2d3436; }
        .stat-box { background: #EEEDFE; border-radius: 10px; padding: 14px; text-align: center; }
        .stat-box .num { font-size: 26px; font-weight: 900; }
        .stat-box .lbl { font-size: 11px; color: #636e72; font-weight: 600; margin-top: 4px; }
        .feature-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 10px; margin-bottom: 8px; background: #EEEDFE; }
        .feature-row .fname { font-size: 13px; font-weight: 700; }
        .feature-row .fval { font-size: 13px; font-weight: 800; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .badge.used { background: #d5f5e3; color: #1e8449; }
        .badge.notused { background: #fde8e8; color: #e74c3c; }
        .booking-row { background: #EEEDFE; border-radius: 10px; padding: 12px 14px; margin-bottom: 8px; border-left: 4px solid; }
        .booking-row .btitle { font-size: 13px; font-weight: 800; }
        .booking-row .bsub { font-size: 11px; color: #636e72; margin-top: 3px; }
        .booking-row .bprice { font-size: 14px; font-weight: 900; float: right; }
        .footer { text-align: center; margin-top: 36px; font-size: 11px; color: #636e72; border-top: 1px solid #e0dff8; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>TripMates User Report</h1>
          <p>${u.fullName} &nbsp;|&nbsp; @${u.username}</p>
        </div>
        <div class="date">Generated on<br/><strong>${now}</strong><br/>by TripMates Admin</div>
      </div>

      <!-- USER INFO -->
      <div class="section">
        <div class="section-title">USER INFORMATION</div>
        <div class="grid2">
          <div class="info-box"><div class="label">FULL NAME</div><div class="val">${u.fullName}</div></div>
          <div class="info-box"><div class="label">USERNAME</div><div class="val">@${u.username}</div></div>
          <div class="info-box"><div class="label">EMAIL</div><div class="val">${u.email}</div></div>
          <div class="info-box"><div class="label">MOBILE</div><div class="val">${u.mobileNumber}</div></div>
          <div class="info-box"><div class="label">FOLLOWERS</div><div class="val">${detail.followData?.followers?.length || 0}</div></div>
          <div class="info-box"><div class="label">FOLLOWING</div><div class="val">${detail.followData?.following?.length || 0}</div></div>
        </div>
      </div>

      <!-- FEATURE USAGE -->
      <div class="section">
        <div class="section-title">FEATURE USAGE SUMMARY</div>
        ${[
          { name: 'Social Feed (Posts)', val: detail.posts?.length || 0, color: '#7F77DD' },
          { name: 'Flight Bookings', val: detail.flightBookings?.length || 0, color: '#fd7900' },
          { name: 'Hotel Bookings', val: detail.hotelBookings?.length || 0, color: '#00b894' },
          { name: 'Digital Vault (Docs)', val: detail.vaultDocs?.length || 0, color: '#6c5ce7' },
          { name: 'Day Plans (Activities)', val: detail.dayPlans?.length || 0, color: '#e84393' },
          { name: 'Guide Bookings', val: detail.guideBookings?.length || 0, color: '#c9a84c' },
        ].map(f => `
          <div class="feature-row">
            <span class="fname" style="color:${f.color}">${f.name}</span>
            <span>
              <span class="badge ${f.val > 0 ? 'used' : 'notused'}">${f.val > 0 ? 'Used' : 'Not Used'}</span>
              &nbsp;<span class="fval" style="color:${f.color}">${f.val} record${f.val !== 1 ? 's' : ''}</span>
            </span>
          </div>
        `).join('')}
      </div>

      <!-- ACTIVITY STATS -->
      <div class="section">
        <div class="section-title">ACTIVITY STATS</div>
        <div class="grid3">
          ${[
            { label: 'Flights', val: detail.stats?.flights || 0, color: '#fd7900' },
            { label: 'Hotels', val: detail.stats?.hotels || 0, color: '#00b894' },
            { label: 'Guides', val: detail.stats?.guides || 0, color: '#c9a84c' },
            { label: 'Activities', val: detail.stats?.activities || 0, color: '#6c5ce7' },
            { label: 'Trips', val: detail.stats?.trips || 0, color: '#7F77DD' },
            { label: 'Buddies', val: detail.stats?.buddies || 0, color: '#e84393' },
          ].map(s => `
            <div class="stat-box">
              <div class="num" style="color:${s.color}">${s.val}</div>
              <div class="lbl">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- FLIGHT BOOKINGS -->
      ${detail.flightBookings?.length > 0 ? `
      <div class="section">
        <div class="section-title">FLIGHT BOOKINGS (${detail.flightBookings.length})</div>
        ${detail.flightBookings.map(b => `
          <div class="booking-row" style="border-color:#fd7900">
            <span class="bprice" style="color:#fd7900">Rs. ${b.totalPrice?.toLocaleString()}</span>
            <div class="btitle">${b.airline} — ${b.flightNo}</div>
            <div class="bsub">${b.from} to ${b.to} | ${b.departDate} | ${b.travelClass} | ${b.passengers} passenger(s)</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- HOTEL BOOKINGS -->
      ${detail.hotelBookings?.length > 0 ? `
      <div class="section">
        <div class="section-title">HOTEL BOOKINGS (${detail.hotelBookings.length})</div>
        ${detail.hotelBookings.map(b => `
          <div class="booking-row" style="border-color:#00b894">
            <span class="bprice" style="color:#00b894">Rs. ${b.totalPrice?.toLocaleString()}</span>
            <div class="btitle">${b.hotelName}</div>
            <div class="bsub">${b.area}, ${b.city} | ${b.checkIn} to ${b.checkOut} | ${b.nights} nights | ${b.roomType}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- GUIDE BOOKINGS -->
      ${detail.guideBookings?.length > 0 ? `
      <div class="section">
        <div class="section-title">GUIDE BOOKINGS (${detail.guideBookings.length})</div>
        ${detail.guideBookings.map(b => `
          <div class="booking-row" style="border-color:#c9a84c">
            <span class="bprice" style="color:#c9a84c">Rs. ${b.totalPrice?.toLocaleString()}</span>
            <div class="btitle">Guide: @${b.guideUsername}</div>
            <div class="bsub">${b.tourDate} | ${b.bookingType} | ${b.duration} | Status: ${b.status}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- POSTS -->
      ${detail.posts?.length > 0 ? `
      <div class="section">
        <div class="section-title">POSTS (${detail.posts.length})</div>
        ${detail.posts.map(p => `
          <div class="booking-row" style="border-color:#7F77DD">
            <div class="btitle">${p.caption}</div>
            <div class="bsub">${p.location} | ${p.likes} likes | ${new Date(p.createdAt).toLocaleDateString('en-IN')}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- VAULT DOCS -->
      ${detail.vaultDocs?.length > 0 ? `
      <div class="section">
        <div class="section-title">VAULT DOCUMENTS (${detail.vaultDocs.length})</div>
        ${detail.vaultDocs.map(d => `
          <div class="booking-row" style="border-color:#6c5ce7">
            <div class="btitle">${d.docName}</div>
            <div class="bsub">${d.category} | Uploaded: ${new Date(d.uploadedAt).toLocaleDateString('en-IN')}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- DAY PLANS -->
      ${detail.dayPlans?.length > 0 ? `
      <div class="section">
        <div class="section-title">DAY PLANS (${detail.dayPlans.length})</div>
        ${detail.dayPlans.map(plan => `
          <div class="booking-row" style="border-color:#e84393">
            <div class="btitle">${plan.planName}</div>
            <div class="bsub">${plan.city}, ${plan.state} | ${plan.planDate} | ${plan.activities?.length} activities | Rs. ${plan.totalCost?.toLocaleString()}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <div class="footer">
        TripMates Admin Panel &nbsp;|&nbsp; Report generated for @${u.username} &nbsp;|&nbsp; ${now}
      </div>
    </body>
    </html>
  `;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 500);
};

  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cardStyle = {
    background: cardBg, borderRadius: '16px', padding: '20px',
    border: '1px solid #e0dff8', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e0dff8',
    borderRadius: '10px', fontSize: '13px', outline: 'none',
    fontFamily: 'Poppins, sans-serif', color: secondary,
    background: pageBg, boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: '700', color: muted,
    letterSpacing: '1px', marginBottom: '5px', display: 'block'
  };

  const btnStyle = (bg, color) => ({
    background: bg, color: color, border: 'none',
    padding: '8px 18px', borderRadius: '10px', fontWeight: '700',
    cursor: 'pointer', fontSize: '12px', fontFamily: 'Poppins, sans-serif'
  });

  // ── LOGIN PAGE ──
  if (!isLoggedIn) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #26215C 0%, #4a3f9f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '40px', width: '360px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
        <img src={logoImg} alt="Logo" style={{ height: '60px', width: '60px', borderRadius: '50%', marginBottom: '12px' }} />
        <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '900', color: '#26215C' }}>TripMates Admin</h2>
        <p style={{ margin: '0 0 28px', fontSize: '13px', color: muted }}>Restricted access only</p>

        {loginError && (
          <div style={{ background: '#ff7675', color: 'white', borderRadius: '10px', padding: '10px', fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>
            {loginError}
          </div>
        )}

        <div style={{ marginBottom: '14px', textAlign: 'left' }}>
          <label style={labelStyle}>ADMIN USERNAME</label>
          <input value={loginForm.username} onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
            placeholder="Enter admin username" style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <label style={labelStyle}>PASSWORD</label>
          <input type="password" value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
            placeholder="Enter password" style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <button onClick={handleLogin} style={{ ...btnStyle('linear-gradient(135deg, #26215C, #7F77DD)', 'white'), width: '100%', padding: '13px', fontSize: '14px', borderRadius: '12px' }}>
          Login to Admin Panel
        </button>
      </div>
    </div>
  );

  // ── MAIN ADMIN PANEL ──
  return (
    <div style={{ minHeight: '100vh', background: pageBg, fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        .nav-btn:hover { opacity: 0.8; }
        .user-row:hover { background: #f0effe !important; }
        .user-row { transition: background 0.15s; cursor: pointer; }
        .stat-card:hover { transform: translateY(-2px); }
        .stat-card { transition: all 0.2s; }
        .tab-btn:hover { opacity: 0.8; }
      `}</style>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', background: navBg, borderBottom: `3px solid ${accent}`, position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logoImg} alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
          <h2 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: '800' }}>TripMates Admin</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="nav-btn" onClick={loadOverview} style={{ ...btnStyle(view === 'overview' ? accent : 'rgba(255,255,255,0.15)', 'white'), transition: 'all 0.2s' }}>Overview</button>
          <button className="nav-btn" onClick={loadUsers} style={{ ...btnStyle(view === 'users' || view === 'userDetail' ? accent : 'rgba(255,255,255,0.15)', 'white'), transition: 'all 0.2s' }}>Users</button>
          <button className="nav-btn" onClick={() => setIsLoggedIn(false)} style={btnStyle('#ff7675', 'white')}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: muted, fontSize: '14px', fontWeight: '600' }}>
            Loading...
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {!loading && view === 'overview' && overview && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '900', color: secondary }}>Dashboard Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '30px' }}>
              {[
                { label: 'Total Users', value: overview.totalUsers, color: '#6c5ce7' },
                { label: 'Total Posts', value: overview.totalPosts, color: '#0984e3' },
                { label: 'Flight Bookings', value: overview.totalFlights, color: '#fd7900' },
                { label: 'Hotel Bookings', value: overview.totalHotels, color: '#00b894' },
                { label: 'Day Plans', value: overview.totalDayPlans, color: '#e84393' },
                { label: 'Guide Bookings', value: overview.totalGuideBookings, color: '#c9a84c' },
                { label: 'Local Guides', value: overview.totalGuides, color: '#00cec9' },
              ].map((item, i) => (
                <div key={i} className="stat-card" style={{ ...cardStyle, textAlign: 'center', borderTop: `4px solid ${item.color}` }}>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: '12px', color: muted, fontWeight: '600', marginTop: '4px' }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{ ...cardStyle, textAlign: 'center', padding: '30px' }}>
              <p style={{ margin: '0 0 16px', fontSize: '14px', color: muted }}>View and manage all registered users</p>
              <button onClick={loadUsers} style={{ ...btnStyle(`linear-gradient(135deg, ${navBg}, ${accent})`, 'white'), padding: '12px 32px', fontSize: '14px', borderRadius: '12px' }}>
                View All Users
              </button>
            </div>
          </div>
        )}

        {/* ── USERS LIST ── */}
        {!loading && view === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: secondary }}>All Users ({users.length})</h2>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, username, email..."
                style={{ ...inputStyle, width: '300px' }} />
            </div>

            <div style={cardStyle}>
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 2fr 1fr 1fr', gap: '12px', padding: '10px 16px', borderBottom: '2px solid #e0dff8', marginBottom: '4px' }}>
                {['Full Name', 'Username', 'Email', 'Mobile', 'Actions'].map(h => (
                  <div key={h} style={{ fontSize: '11px', fontWeight: '800', color: muted, letterSpacing: '1px' }}>{h}</div>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: muted, fontSize: '13px' }}>No users found</div>
              )}

              {filteredUsers.map((u, i) => (
                <div key={u._id} className="user-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 2fr 1fr 1fr', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #f0effe', alignItems: 'center', background: i % 2 === 0 ? '#fafafe' : 'white' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: secondary }}>{u.fullName}</div>
                  <div style={{ fontSize: '12px', color: accent, fontWeight: '600' }}>@{u.username}</div>
                  <div style={{ fontSize: '12px', color: muted }}>{u.email}</div>
                  <div style={{ fontSize: '12px', color: muted }}>{u.mobileNumber}</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => loadUserDetail(u.username)} style={btnStyle(accent, 'white')}>View</button>
                    <button onClick={() => setDeleteConfirm(u.username)} style={btnStyle('#ff7675', 'white')}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── USER DETAIL ── */}
        {!loading && view === 'userDetail' && userDetail && (
          <div>
            {/* Back + Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => { setView('users'); }} style={btnStyle('#e0dff8', secondary)}>Back</button>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: secondary }}>
                  {userDetail.user?.fullName} <span style={{ color: accent, fontSize: '15px' }}>@{userDetail.user?.username}</span>
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditMode(!editMode)} style={btnStyle(editMode ? '#e0dff8' : accent, editMode ? secondary : 'white')}>
                  {editMode ? 'Cancel Edit' : 'Edit User'}
                </button>
                <button onClick={() => generateReport(userDetail)} style={{ ...btnStyle('linear-gradient(135deg, #00b894, #00cec9)', 'white') }}>Generate Report</button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {['profile', 'flights', 'hotels', 'posts', 'vault', 'dayplans', 'guides', 'stats'].map(tab => (
                <button key={tab} className="tab-btn" onClick={() => setActiveTab(tab)} style={{
                  padding: '7px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '12px',
                  background: activeTab === tab ? navBg : cardBg,
                  color: activeTab === tab ? 'white' : muted,
                  boxShadow: activeTab === tab ? `0 4px 12px rgba(38,33,92,0.3)` : '0 2px 6px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s', textTransform: 'capitalize'
                }}>{tab}</button>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: '800', color: muted, letterSpacing: '1px' }}>USER PROFILE</h3>
                {editMode ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                      {[
                        { label: 'FULL NAME', key: 'fullName' },
                        { label: 'USERNAME', key: 'username' },
                        { label: 'EMAIL', key: 'email' },
                        { label: 'MOBILE NUMBER', key: 'mobileNumber' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={labelStyle}>{f.label}</label>
                          <input value={editForm[f.key] || ''} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
                        </div>
                      ))}
                    </div>
                    <button onClick={saveEdit} style={{ ...btnStyle('linear-gradient(135deg, #26215C, #7F77DD)', 'white'), padding: '11px 28px', fontSize: '13px', borderRadius: '12px' }}>
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                      { label: 'Full Name', val: userDetail.user?.fullName },
                      { label: 'Username', val: `@${userDetail.user?.username}` },
                      { label: 'Email', val: userDetail.user?.email },
                      { label: 'Mobile', val: userDetail.user?.mobileNumber },
                      { label: 'Followers', val: userDetail.followData?.followers?.length || 0 },
                      { label: 'Following', val: userDetail.followData?.following?.length || 0 },
                      { label: 'Total Posts', val: userDetail.posts?.length || 0 },
                      { label: 'Vault Docs', val: userDetail.vaultDocs?.length || 0 },
                    ].map((item, i) => (
                      <div key={i} style={{ background: pageBg, borderRadius: '10px', padding: '12px 16px' }}>
                        <div style={{ fontSize: '11px', color: muted, fontWeight: '700', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: secondary }}>{item.val || '—'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Flights Tab */}
            {activeTab === 'flights' && (
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '800', color: muted, letterSpacing: '1px' }}>FLIGHT BOOKINGS ({userDetail.flightBookings?.length || 0})</h3>
                {userDetail.flightBookings?.length === 0 && <div style={{ color: muted, fontSize: '13px' }}>No flight bookings</div>}
                {userDetail.flightBookings?.map((b, i) => (
                  <div key={i} style={{ background: pageBg, borderRadius: '12px', padding: '14px 16px', marginBottom: '10px', borderLeft: '4px solid #fd7900' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '14px', color: secondary }}>{b.airline} — {b.flightNo}</div>
                        <div style={{ fontSize: '12px', color: muted, marginTop: '3px' }}>{b.from} to {b.to} | {b.departDate} | {b.travelClass} | {b.passengers} pax</div>
                      </div>
                      <div style={{ fontWeight: '900', fontSize: '16px', color: '#fd7900' }}>Rs. {b.totalPrice?.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hotels Tab */}
            {activeTab === 'hotels' && (
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '800', color: muted, letterSpacing: '1px' }}>HOTEL BOOKINGS ({userDetail.hotelBookings?.length || 0})</h3>
                {userDetail.hotelBookings?.length === 0 && <div style={{ color: muted, fontSize: '13px' }}>No hotel bookings</div>}
                {userDetail.hotelBookings?.map((b, i) => (
                  <div key={i} style={{ background: pageBg, borderRadius: '12px', padding: '14px 16px', marginBottom: '10px', borderLeft: '4px solid #00b894' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '14px', color: secondary }}>{b.hotelName}</div>
                        <div style={{ fontSize: '12px', color: muted, marginTop: '3px' }}>{b.area}, {b.city} | {b.checkIn} to {b.checkOut} | {b.nights} nights | {b.roomType}</div>
                      </div>
                      <div style={{ fontWeight: '900', fontSize: '16px', color: '#00b894' }}>Rs. {b.totalPrice?.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '800', color: muted, letterSpacing: '1px' }}>POSTS ({userDetail.posts?.length || 0})</h3>
                {userDetail.posts?.length === 0 && <div style={{ color: muted, fontSize: '13px' }}>No posts</div>}
                {userDetail.posts?.map((p, i) => (
                  <div key={i} style={{ background: pageBg, borderRadius: '12px', padding: '14px 16px', marginBottom: '10px', borderLeft: `4px solid ${accent}` }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: secondary, marginBottom: '4px' }}>{p.caption}</div>
                    <div style={{ fontSize: '11px', color: muted }}>{p.location} | {p.likes} likes | {new Date(p.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Vault Tab */}
            {activeTab === 'vault' && (
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '800', color: muted, letterSpacing: '1px' }}>VAULT DOCUMENTS ({userDetail.vaultDocs?.length || 0})</h3>
                {userDetail.vaultDocs?.length === 0 && <div style={{ color: muted, fontSize: '13px' }}>No documents</div>}
                {userDetail.vaultDocs?.map((d, i) => (
                  <div key={i} style={{ background: pageBg, borderRadius: '12px', padding: '14px 16px', marginBottom: '10px', borderLeft: '4px solid #6c5ce7' }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: secondary }}>{d.docName}</div>
                    <div style={{ fontSize: '11px', color: muted, marginTop: '3px' }}>{d.category} | Uploaded: {new Date(d.uploadedAt).toLocaleDateString('en-IN')}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Day Plans Tab */}
            {activeTab === 'dayplans' && (
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '800', color: muted, letterSpacing: '1px' }}>DAY PLANS ({userDetail.dayPlans?.length || 0})</h3>
                {userDetail.dayPlans?.length === 0 && <div style={{ color: muted, fontSize: '13px' }}>No day plans</div>}
                {userDetail.dayPlans?.map((plan, i) => (
                  <div key={i} style={{ background: pageBg, borderRadius: '12px', padding: '14px 16px', marginBottom: '10px', borderLeft: '4px solid #e84393' }}>
                    <div style={{ fontWeight: '800', fontSize: '13px', color: secondary }}>{plan.planName}</div>
                    <div style={{ fontSize: '11px', color: muted, marginTop: '3px' }}>{plan.city}, {plan.state} | {plan.planDate} | {plan.activities?.length} activities | Rs. {plan.totalCost?.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Guide Bookings Tab */}
            {activeTab === 'guides' && (
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '800', color: muted, letterSpacing: '1px' }}>GUIDE BOOKINGS ({userDetail.guideBookings?.length || 0})</h3>
                {userDetail.guideBookings?.length === 0 && <div style={{ color: muted, fontSize: '13px' }}>No guide bookings</div>}
                {userDetail.guideBookings?.map((b, i) => (
                  <div key={i} style={{ background: pageBg, borderRadius: '12px', padding: '14px 16px', marginBottom: '10px', borderLeft: '4px solid #c9a84c' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '13px', color: secondary }}>Guide: @{b.guideUsername}</div>
                        <div style={{ fontSize: '11px', color: muted, marginTop: '3px' }}>{b.tourDate} | {b.bookingType} | {b.duration} | Status: {b.status}</div>
                      </div>
                      <div style={{ fontWeight: '900', fontSize: '15px', color: '#c9a84c' }}>Rs. {b.totalPrice?.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: '800', color: muted, letterSpacing: '1px' }}>ACTIVITY STATS</h3>
                {!userDetail.stats ? (
                  <div style={{ color: muted, fontSize: '13px' }}>No activity stats recorded yet</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                    {[
                      { label: 'Flights', val: userDetail.stats?.flights, color: '#fd7900' },
                      { label: 'Hotels', val: userDetail.stats?.hotels, color: '#00b894' },
                      { label: 'Guides', val: userDetail.stats?.guides, color: '#c9a84c' },
                      { label: 'Activities', val: userDetail.stats?.activities, color: '#6c5ce7' },
                      { label: 'Trips', val: userDetail.stats?.trips, color: accent },
                      { label: 'Buddies', val: userDetail.stats?.buddies, color: '#e84393' },
                    ].map((item, i) => (
                      <div key={i} style={{ background: pageBg, borderRadius: '12px', padding: '16px', textAlign: 'center', borderTop: `3px solid ${item.color}` }}>
                        <div style={{ fontSize: '28px', fontWeight: '900', color: item.color }}>{item.val || 0}</div>
                        <div style={{ fontSize: '12px', color: muted, fontWeight: '600', marginTop: '4px' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '360px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>!</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '900', color: secondary }}>Delete User?</h3>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: muted }}>
              This will permanently delete <strong>@{deleteConfirm}</strong> and all their data including bookings, posts, vault docs, and day plans.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ ...btnStyle('#e0dff8', secondary), padding: '10px 24px', fontSize: '13px' }}>Cancel</button>
              <button onClick={() => deleteUser(deleteConfirm)} style={{ ...btnStyle('#ff7675', 'white'), padding: '10px 24px', fontSize: '13px' }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
