import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from './tripmates logo.jpeg';
import { useTheme } from './ThemeContext';

const Dashboard = ({ user, onLogout }) => {
  const userData = user || JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const { theme } = useTheme();

  const yellow      = theme.accent;
  const forestGreen = theme.primary;
  const darkGreen   = theme.navBg;
  const brown       = theme.secondary;
  const purple      = '#6C5CE7';
  const blue        = '#0984E3';

  const [stats, setStats] = useState({
    flights: 0, hotels: 0, guides: 0,
    activities: 0, trips: 0, buddies: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/stats/${userData?.username}`);
        setStats(res.data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    };
    fetchStats();
  }, [userData?.username]);

  const totalActivity = stats.flights + stats.hotels + stats.guides + stats.activities + stats.trips + stats.buddies;

  const getLevel = () => {
    if (totalActivity >= 20) return { name: 'Legend Explorer',  color: yellow,      textColor: brown,   next: null };
    if (totalActivity >= 10) return { name: 'Pro Traveler',     color: purple,      textColor: 'white', next: 20   };
    if (totalActivity >= 5)  return { name: 'Adventure Seeker', color: forestGreen, textColor: 'white', next: 10   };
    return                          { name: 'Newbie Explorer',  color: brown,       textColor: 'white', next: 5    };
  };

  const level = getLevel();
  const progressPercent = level.next ? Math.min((totalActivity / level.next) * 100, 100) : 100;

  const statCards = [
    { label: 'Flights',    value: stats.flights,    color: blue,        bg: '#E8F4FD' },
    { label: 'Hotels',     value: stats.hotels,     color: forestGreen, bg: '#E8F5E9' },
    { label: 'Guides',     value: stats.guides,     color: brown,       bg: '#F5EDE4' },
    { label: 'Activities', value: stats.activities, color: '#B8860B',   bg: '#FFF9E0' },
    { label: 'Trips',      value: stats.trips,      color: purple,      bg: '#F3EFFF' },
    { label: 'Buddies',    value: stats.buddies,    color: darkGreen,   bg: '#E8F5E9' },
  ];

  const quickActions = [
    { label: 'Book Flight', route: '/flights', color: blue        },
    { label: 'Book Hotel',  route: '/hotels',  color: forestGreen },
    { label: 'My Vault',    route: '/vault',   color: purple      },
    { label: 'Social Feed', route: '/feed',    color: brown       },
  ];

  return (
    <div style={{ minHeight: '100vh', background: theme.pageBg, fontFamily: 'Poppins, sans-serif' }}>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .db-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 32px;
          background: ${darkGreen};
          position: sticky; top: 0; z-index: 1000;
          box-shadow: 0 4px 20px rgba(27,94,32,0.35);
        }
        .db-nav-title { color: white; font-weight: 700; font-size: 15px; }

        .db-wrapper {
          max-width: 860px;
          margin: 0 auto;
          padding: 28px 20px 48px;
        }

        .profile-card {
          background: ${theme.cardBg}; border-radius: 28px; overflow: visible;
          box-shadow: 0 6px 32px rgba(75,54,33,0.13);
          margin-bottom: 22px; border: 1px solid ${theme.cardBorder};
        }

        .cover-area {
          height: 165px;
          background: ${theme.coverBg};
          position: relative; overflow: visible;
        }
        .cover-area::before {
          content: ''; position: absolute;
          width: 240px; height: 240px; border-radius: 50%;
          background: rgba(255,255,255,0.07); top: -90px; right: -60px;
        }
        .cover-area::after {
          content: ''; position: absolute;
          width: 140px; height: 140px; border-radius: 50%;
          background: rgba(255,255,255,0.05); bottom: -50px; left: 50px;
        }
        .cover-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 5px; background: ${yellow};
        }

        .profile-body { padding: 0 28px 28px; }

        .avatar-stats-row {
          display: flex; align-items: flex-end;
          justify-content: space-between; flex-wrap: wrap; gap: 12px;
        }

        .avatar-circle {
  width: 88px; height: 88px; border-radius: 50%;
  background: ${theme.avatarBg};
  color: white; display: flex; align-items: center; justify-content: center;
  font-size: 36px; font-weight: 800;
  border: 5px solid white; margin-top: -44px;
  box-shadow: 0 6px 22px rgba(75,54,33,0.28); flex-shrink: 0;
  position: relative; z-index: 10;
}
        .mini-stats { display: flex; gap: 24px; padding-bottom: 6px; }
        .mini-stat { text-align: center; }
        .mini-stat-val { font-size: 20px; font-weight: 800; color: ${theme.navText}; }
        .mini-stat-lbl { font-size: 11px; color: #6B7280; font-weight: 500; }

        .name-section { margin-top: 16px; margin-bottom: 16px; }
        .user-name { margin: 0 0 3px; font-size: 22px; font-weight: 800; color: ${theme.navText}; }
        .user-handle { margin: 0 0 12px; color: #6B7280; font-size: 14px; font-weight: 500; }

        .level-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 18px; border-radius: 30px;
          font-size: 13px; font-weight: 700; letter-spacing: 0.3px;
        }
        .badge-dot { width: 8px; height: 8px; border-radius: 50%; }

        .progress-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid ${theme.cardBorder}; }
        .progress-lbl-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .progress-track {
          height: 11px; background: ${theme.pageBg}; border-radius: 10px;
          overflow: hidden; border: 1px solid ${theme.cardBorder};
        }
        .progress-fill {
          height: 100%; border-radius: 10px;
          background: ${theme.progressBg};
          transition: width 0.6s ease;
        }

        .section-card {
          background: ${theme.cardBg}; border-radius: 28px; padding: 26px 24px;
          box-shadow: 0 6px 28px rgba(75,54,33,0.1);
          margin-bottom: 22px; border: 1px solid ${theme.cardBorder};
        }

        .section-header { display: flex; align-items: center; gap: 11px; margin-bottom: 20px; }
        .section-accent { width: 5px; height: 22px; background: ${yellow}; border-radius: 3px; }
        .section-title { margin: 0; font-size: 13px; font-weight: 800; color: ${theme.navText}; letter-spacing: 1.5px; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .stat-item {
          border-radius: 20px; padding: 20px 10px;
          text-align: center; transition: all 0.22s ease; cursor: default;
        }
        .stat-item:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(0,0,0,0.1); }
        .stat-value { font-size: 30px; font-weight: 900; line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 12px; color: #6B7280; font-weight: 600; }

        .actions-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
        }
        .action-btn {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          padding: 16px 8px; border-radius: 18px; border: none; cursor: pointer;
          font-family: Poppins, sans-serif; font-size: 12px; font-weight: 700;
          transition: all 0.2s ease;
        }
        .action-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.12); }

        .logout-btn {
          width: 100%;
          background: ${theme.btnBg};
          color: ${theme.btnText}; border: none; padding: 17px;
          border-radius: 18px; font-weight: 700; cursor: pointer;
          font-size: 15px; font-family: Poppins, sans-serif;
          box-shadow: 0 6px 22px rgba(75,54,33,0.35);
          transition: all 0.2s ease; letter-spacing: 0.4px;
        }
        .logout-btn:hover { opacity: 0.91; transform: translateY(-1px); }

        @media (max-width: 768px) {
          .db-nav { padding: 12px 16px; }
          .db-wrapper { padding: 18px 14px 36px; }
          .profile-body { padding: 0 16px 22px; }
          .cover-area { height: 130px; }
          .avatar-circle { width: 76px; height: 76px; font-size: 30px; margin-top: -38px; border-width: 4px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .actions-grid { grid-template-columns: repeat(2, 1fr); }
          .section-card { padding: 20px 16px; }
        }

        @media (max-width: 480px) {
          .db-nav-title { display: none; }
          .cover-area { height: 110px; }
          .avatar-circle { width: 68px; height: 68px; font-size: 26px; margin-top: -34px; }
          .mini-stats { gap: 16px; }
          .mini-stat-val { font-size: 17px; }
          .user-name { font-size: 19px; }
          .stat-value { font-size: 26px; }
        }

        @media (min-width: 1100px) {
          .db-wrapper { max-width: 920px; }
          .stats-grid { grid-template-columns: repeat(6, 1fr); }
        }
      `}</style>

      {/* Navbar */}
      <nav className="db-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/feed')}>
          <img src={logoImg} alt="Logo" style={{ height: '34px', width: '34px', borderRadius: '50%' }} />
          <span style={{ color: yellow, fontWeight: '800', fontSize: '18px' }}>TripMates</span>
        </div>
        <span className="db-nav-title">My Profile</span>
        <button onClick={() => navigate('/feed')} style={{
          background: 'none', border: `2px solid ${yellow}`, color: yellow,
          padding: '7px 18px', borderRadius: '30px', fontWeight: '700',
          cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
        }}>Back to Feed</button>
      </nav>

      <div className="db-wrapper">

        {/* Profile Card */}
        <div className="profile-card">
          <div className="cover-area">
            <div className="cover-bar" />
          </div>
          <div className="profile-body">
            <div className="avatar-stats-row">
              <div className="avatar-circle">
                {userData?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="mini-stats">
                <div className="mini-stat">
                  <div className="mini-stat-val">0</div>
                  <div className="mini-stat-lbl">Followers</div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-val">0</div>
                  <div className="mini-stat-lbl">Following</div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-val">{totalActivity}</div>
                  <div className="mini-stat-lbl">Activities</div>
                </div>
              </div>
            </div>

            <div className="name-section">
              <h2 className="user-name">{userData?.fullName}</h2>
              <p className="user-handle">@{userData?.username}</p>

              <div style={{ marginBottom: '10px' }}>
                <div
                  className="level-badge"
                  style={{ background: level.color, color: level.textColor, boxShadow: `0 4px 14px ${level.color}55` }}
                >
                  <div className="badge-dot" style={{ background: level.textColor === 'white' ? 'rgba(255,255,255,0.5)' : `${brown}66` }} />
                  {level.name}
                </div>
              </div>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: theme.pageBg, border: `1px solid ${theme.cardBorder}`,
                borderRadius: '20px', padding: '5px 14px',
                fontSize: '12px', color: theme.navText, fontWeight: '600'
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="2" width="14" height="20" rx="3" stroke={theme.navText} strokeWidth="2"/>
                  <circle cx="12" cy="17" r="1" fill={theme.navText}/>
                </svg>
                {userData?.mobileNumber || 'No number added'}
              </div>
            </div>

            {level.next && (
              <div className="progress-section">
                <div className="progress-lbl-row">
                  <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>Level Progress</span>
                  <span style={{ fontSize: '12px', color: theme.navText, fontWeight: '700' }}>
                    {totalActivity} / {level.next} activities
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#6B7280' }}>
                  {level.next - totalActivity} more to unlock next level
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Stats */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-accent" />
            <h3 className="section-title">YOUR TRIPMATES ACTIVITY</h3>
          </div>
          <div className="stats-grid">
            {statCards.map((stat, i) => (
              <div key={i} className="stat-item" style={{
                background: stat.bg,
                border: `1px solid ${stat.color}22`,
                borderTop: `4px solid ${stat.color}`
              }}>
                <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-accent" />
            <h3 className="section-title">QUICK ACTIONS</h3>
          </div>
          <div className="actions-grid">
            {quickActions.map((action, i) => (
              <button
                key={i}
                className="action-btn"
                onClick={() => navigate(action.route)}
                style={{
                  background: `${action.color}12`,
                  color: action.color,
                  border: `1.5px solid ${action.color}33`
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button className="logout-btn" onClick={onLogout}>
          Logout from TripMates
        </button>

      </div>
    </div>
  );
};

export default Dashboard;