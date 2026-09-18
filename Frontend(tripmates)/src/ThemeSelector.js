import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import logoImg from './tripmates logo.jpeg';

const ThemeSelector = () => {
  const navigate = useNavigate();
  const { theme, currentTheme, applyTheme, themes } = useTheme();

  return (
    <div style={{ minHeight: '100vh', background: theme.pageBg, fontFamily: 'Poppins, sans-serif' }}>

      <style>{`
        .theme-card { transition: all 0.25s ease; cursor: pointer; }
        .theme-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.15) !important; }
        .apply-btn:hover { opacity: 0.88; transform: scale(1.02); }
        .apply-btn { transition: all 0.2s ease; }
        @media (max-width: 600px) {
          .themes-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .nav-pad { padding: 12px 16px !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 32px', background: theme.navBg,
        position: 'sticky', top: 0, zIndex: 1000,
        borderBottom: `3px solid ${theme.navBorder}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }} className="nav-pad">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/feed')}>
          <img src={logoImg} alt="Logo" style={{ height: '34px', width: '34px', borderRadius: '50%' }} />
          <span style={{ color: theme.brand, fontWeight: '800', fontSize: '18px' }}>TripMates</span>
        </div>
        <span style={{ color: theme.navText, fontWeight: '700', fontSize: '15px' }}>Choose Your Theme</span>
        <button onClick={() => navigate('/feed')} style={{
          background: 'none', border: `2px solid ${theme.navText}`, color: theme.navText,
          padding: '7px 18px', borderRadius: '30px', fontWeight: '700',
          cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
        }}>Back to Feed</button>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 20px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: `${theme.accent}22`, border: `1px solid ${theme.accent}44`,
            borderRadius: '30px', padding: '6px 18px', marginBottom: '16px'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: theme.accent }} />
            <span style={{ color: theme.accent, fontSize: '13px', fontWeight: '700' }}>PERSONALIZE YOUR WORLD</span>
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: '32px', fontWeight: '900', color: theme.secondary }}>
            Pick Your Vibe
          </h1>
          <p style={{ margin: 0, color: theme.muted, fontSize: '15px' }}>
            Choose a theme that matches your travel personality
          </p>
        </div>

        {/* Currently Active */}
        <div style={{
          background: theme.cardBg, borderRadius: '20px', padding: '20px 24px',
          border: `2px solid ${theme.accent}`,
          boxShadow: `0 8px 30px ${theme.accent}22`,
          marginBottom: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '16px',
              background: themes[currentTheme].coverBg,
            }} />
            <div>
              <div style={{ fontSize: '11px', color: theme.muted, fontWeight: '600', letterSpacing: '1px', marginBottom: '4px' }}>CURRENTLY ACTIVE</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: theme.secondary }}>{themes[currentTheme].name}</div>
            </div>
          </div>
          <div style={{
            background: theme.accent, color: theme.accentText,
            padding: '8px 20px', borderRadius: '30px', fontSize: '13px', fontWeight: '700'
          }}>Active</div>
        </div>

        {/* All Themes Grid */}
        <div className="themes-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px'
        }}>
          {Object.entries(themes).map(([id, t]) => (
            <div
              key={id}
              className="theme-card"
              onClick={() => applyTheme(id)}
              style={{
                background: theme.cardBg,
                border: currentTheme === id
                  ? `2px solid ${theme.accent}`
                  : `1px solid ${theme.cardBorder}`,
                borderRadius: '20px', overflow: 'hidden',
                boxShadow: currentTheme === id
                  ? `0 8px 24px ${theme.accent}33`
                  : '0 2px 12px rgba(0,0,0,0.06)',
                position: 'relative'
              }}
            >
              {/* Active checkmark */}
              {currentTheme === id && (
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: theme.accent, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', zIndex: 1
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke={theme.accentText} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Theme preview cover */}
              <div style={{
                height: '70px', background: t.coverBg, position: 'relative', overflow: 'hidden'
              }}>
                {/* Mini navbar preview */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: '14px', background: t.navBg,
                  borderBottom: `2px solid ${t.navBorder}`,
                  display: 'flex', alignItems: 'center', paddingLeft: '6px', gap: '3px'
                }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: t.navText, opacity: 0.8 }} />
                  <div style={{ width: '20px', height: '3px', borderRadius: '2px', background: t.brand, opacity: 0.7 }} />
                </div>
                {/* Color accent strip at bottom */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: '4px', background: t.accent
                }} />
              </div>

              {/* Theme info */}
              <div style={{ padding: '14px 14px 16px' }}>
                <div style={{ fontWeight: '800', fontSize: '14px', color: theme.secondary, marginBottom: '8px' }}>{t.name}</div>

                {/* Color dots */}
                <div style={{ display: 'flex', gap: '5px', marginBottom: '12px' }}>
                  {[t.navBg, t.accent, t.pageBg, t.primary].map((c, i) => (
                    <div key={i} style={{
                      width: '14px', height: '14px', borderRadius: '50%',
                      background: c, border: '1.5px solid rgba(0,0,0,0.08)', flexShrink: 0
                    }} />
                  ))}
                </div>

                <button
                  className="apply-btn"
                  onClick={(e) => { e.stopPropagation(); applyTheme(id); }}
                  style={{
                    width: '100%',
                    background: currentTheme === id ? `${t.accent}22` : t.btnBg,
                    color: currentTheme === id ? t.accent : t.btnText,
                    border: currentTheme === id ? `1.5px solid ${t.accent}` : 'none',
                    padding: '8px', borderRadius: '10px', fontWeight: '700',
                    cursor: 'pointer', fontSize: '12px', fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  {currentTheme === id ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{
          textAlign: 'center', marginTop: '32px', padding: '16px',
          background: theme.cardBg, borderRadius: '16px',
          border: `1px solid ${theme.cardBorder}`
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: theme.muted }}>
            Themes are saved automatically — they persist across sessions
          </p>
        </div>

      </div>
    </div>
  );
};

export default ThemeSelector;