import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from './tripmates logo.jpeg';

const FeaturesTour = () => {
  const navigate = useNavigate();
  const brandTeal = '#00d2d3';
  const darkTeal = '#0984e3';
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setVisible(prev => ({ ...prev, [e.target.id]: true }));
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      id: 'flights',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="white"/>
        </svg>
      ),
      title: 'Flight Booking',
      subtitle: 'Best fares, instant booking',
      desc: 'Search hundreds of flights, compare prices, and book in seconds. IndiGo, Air India, SpiceJet aur bahut saari airlines ek jagah.',
      color: '#0984e3',
      bg: '#e8f4fd',
      route: '/flights',
      badge: 'Live'
    },
    {
      id: 'hotels',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M9 22V12h6v10" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Hotel Booking',
      subtitle: 'Luxury to budget stays',
      desc: 'Budget se luxury tak — apni needs ke hisaab se perfect hotel dhundo. Real-time ratings, amenities aur best prices guaranteed.',
      color: '#c9a84c',
      bg: '#fdf6e3',
      route: '/hotels',
      badge: 'Live'
    },
    {
      id: 'vault',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" fill="white" opacity="0.9"/>
          <path d="M7 11V7a5 5 0 0110 0v4" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      ),
      title: 'Digital Vault',
      subtitle: 'All documents, one place',
      desc: 'Passport, visa, tickets — sab securely store karo. Kabhi bhi, kahin bhi access karo. Travel stress-free with your docs always handy.',
      color: '#534AB7',
      bg: '#EEEDFE',
      route: '/vault',
      badge: 'Live'
    },
    {
      id: 'feed',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill="white" opacity="0.9"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      ),
      title: 'Social Feed',
      subtitle: 'Share your journey',
      desc: 'Travel stories share karo, doosron se inspire ho. Like, comment aur connect karo duniya bhar ke travelers ke saath.',
      color: '#e84393',
      bg: '#fde8f3',
      route: '/feed',
      badge: 'Live'
    },
    {
      id: 'itinerary',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
          <path d="M16 2v4M8 2v4M3 10h18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 14h8M8 18h5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Smart Itineraries',
      subtitle: 'AI-powered trip planning',
      desc: 'Apna perfect travel plan banao AI ki madad se. Day-by-day itinerary, budget tracking aur real-time suggestions.',
      color: '#00b894',
      bg: '#e0faf4',
      route: '/feed',
      badge: 'Live'
    },
    {
      id: 'buddy',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="7" r="3" fill="white" opacity="0.8"/>
          <circle cx="15" cy="7" r="3" fill="white"/>
          <path d="M3 19c0-3 2.7-5 6-5M12 19c0-3 2.7-5 6-5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      ),
      title: 'Buddy Finder',
      subtitle: 'Find your travel tribe',
      desc: 'Akele travel karna boring hai! Same destination pe jaane wale travelers se milo aur naye dost banao.',
      color: '#fd7900',
      bg: '#fff3e8',
      route: '/feed',
      badge: 'Live'
    },
  ];

  const stats = [
    { value: '10K+', label: 'Travelers' },
    { value: '50+', label: 'Destinations' },
    { value: '4.9', label: 'App Rating' },
    { value: '100%', label: 'Secure' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'Poppins, sans-serif', overflowX: 'hidden' }}>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        .reveal { opacity: 0; transform: translateY(40px); transition: all 0.6s ease; }
        .reveal.show { opacity: 1; transform: translateY(0); }
        .feature-card:hover { transform: translateY(-6px) !important; box-shadow: 0 20px 50px rgba(0,0,0,0.12) !important; }
        .feature-card { transition: all 0.3s ease; }
        .cta-btn:hover { transform: scale(1.04); box-shadow: 0 8px 30px rgba(0,210,211,0.5) !important; }
        .cta-btn { transition: all 0.25s ease; }
        .stat-card:hover { transform: translateY(-4px); }
        .stat-card { transition: all 0.2s; }
        @media (max-width: 768px) {
          .hero-title { font-size: 32px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .hero-btns { flex-direction: column !important; }
          .nav-links { display: none !important; }
        }
      `}</style>

      {/* Navbar — sirf logo aur links, no buttons */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 60px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrollY > 50 ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(12px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid #f0f0f0' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logoImg} alt="Logo" style={{ height: '38px', width: '38px', borderRadius: '50%' }} />
          <span style={{ color: brandTeal, fontWeight: '900', fontSize: '20px' }}>TripMates</span>
        </div>
        <div style={{ display: 'flex', gap: '32px' }} className="nav-links">
          {['Features', 'About', 'Contact'].map(l => (
            <span key={l} style={{ color: scrollY > 50 ? '#2d3436' : 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer', opacity: 0.85 }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, #0f2027, #203a43, #2c5364)`,
        position: 'relative', overflow: 'hidden', textAlign: 'center',
        padding: '120px 20px 80px'
      }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${[300,200,150,400,250][i]}px`,
            height: `${[300,200,150,400,250][i]}px`,
            borderRadius: '50%',
            background: `${brandTeal}${['08','06','04','05','07'][i]}`,
            top: `${[10,60,30,-10,50][i]}%`,
            left: `${[-5,70,40,60,-8][i]}%`,
            animation: `float ${[6,8,7,9,5][i]}s ease-in-out infinite`,
            animationDelay: `${[0,1,2,0.5,1.5][i]}s`
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '750px', animation: 'fadeUp 0.8s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: `${brandTeal}22`, border: `1px solid ${brandTeal}44`,
            borderRadius: '30px', padding: '6px 18px', marginBottom: '24px'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: brandTeal, animation: 'pulse 1.5s infinite' }} />
            <span style={{ color: brandTeal, fontSize: '13px', fontWeight: '700' }}>Your Ultimate Travel Companion</span>
          </div>

          <h1 className="hero-title" style={{
            fontSize: '52px', fontWeight: '900', color: 'white',
            margin: '0 0 20px', lineHeight: 1.15
          }}>
            Travel Smarter,<br />
            <span style={{ color: brandTeal }}>Together</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '17px', lineHeight: 1.7, marginBottom: '40px', maxWidth: '560px', margin: '0 auto 40px' }}>
            Flights book karo, hotels dhundo, documents safely store karo aur duniya bhar ke travelers se connect karo — sab ek app mein.
          </p>

          {/* Sirf Hero mein buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }} className="hero-btns">
            <button onClick={() => navigate('/signup')} className="cta-btn" style={{
              padding: '16px 40px', borderRadius: '50px', border: 'none',
              background: `linear-gradient(135deg, ${brandTeal}, ${darkTeal})`,
              color: 'white', fontWeight: '800', fontSize: '16px',
              cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
              boxShadow: `0 8px 30px ${brandTeal}55`
            }}>Sign-Up To Get Started </button>
            <button onClick={() => navigate('/login')} style={{
              padding: '16px 40px', borderRadius: '50px',
              border: '2px solirgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.08)',
              color: 'white', fontWeight: '700', fontSize: '16px',
              cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
              backdropFilter: 'blur(8px)'
            }}>Already have account</button>
          </div>

          {/* Scroll hint */}
          <div style={{ marginTop: '60px', animation: 'float 2s infinite' }}>
            <div style={{ width: '28px', height: '44px', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '14px', margin: '0 auto', display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
              <div style={{ width: '4px', height: '8px', background: brandTeal, borderRadius: '2px', animation: 'float 1.5s infinite' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div id="stats" className="reveal" style={{ background: `linear-gradient(135deg, ${brandTeal}, ${darkTeal})`, padding: '40px 60px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', textAlign: 'center' }} className="stats-row">
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: '32px', fontWeight: '900', color: 'white' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontWeight: '600', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      {visible['stats'] && document.getElementById('stats') && document.getElementById('stats').classList.add('show')}

      {/* Features Section */}
      <div style={{ padding: '90px 40px', background: '#f7f8fc' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} id="feat-header" className="reveal">
          <span style={{ color: brandTeal, fontWeight: '700', fontSize: '13px', letterSpacing: '2px' }}>EVERYTHING YOU NEED</span>
          <h2 style={{ fontSize: '38px', fontWeight: '900', color: '#2d3436', margin: '12px 0 16px' }}>
            One App, <span style={{ color: brandTeal }}>Infinite Adventures</span>
          </h2>
          <p style={{ color: '#888', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            TripMates mein sab kuch hai jo ek traveler ko chahiye
          </p>
        </div>
        {visible['feat-header'] && document.getElementById('feat-header') && document.getElementById('feat-header').classList.add('show')}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', maxWidth: '1050px', margin: '0 auto' }} className="features-grid">
          {features.map((f, i) => (
            <div
              key={f.id}
              id={`feat-${f.id}`}
              className="reveal feature-card"
              style={{
                background: 'white', borderRadius: '24px', padding: '30px',
                border: '1px solid #ececec', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transitionDelay: `${i * 0.08}s`
              }}
              onClick={() => navigate(f.route)}
            >
              {visible[`feat-${f.id}`] && document.getElementById(`feat-${f.id}`) && document.getElementById(`feat-${f.id}`).classList.add('show')}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '18px',
                  background: f.color, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 20px ${f.color}44`
                }}>{f.icon}</div>
                <span style={{
                  background: f.badge === 'Live' ? '#e8fdf5' : '#fff3e8',
                  color: f.badge === 'Live' ? '#00b894' : '#fd7900',
                  border: `1px solid ${f.badge === 'Live' ? '#00b89444' : '#fd790044'}`,
                  borderRadius: '20px', padding: '4px 12px',
                  fontSize: '11px', fontWeight: '700'
                }}>{f.badge}</span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: '#2d3436' }}>{f.title}</h3>
              <p style={{ margin: '0 0 16px', fontSize: '12px', color: f.color, fontWeight: '700' }}>{f.subtitle}</p>
              <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#888', lineHeight: 1.7 }}>{f.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: f.color, fontWeight: '700', fontSize: '13px' }}>
                <span>{f.badge === 'Live' ? 'Explore now' : 'Explore Now'}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke={f.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section — no buttons, sirf text */}
      <div id="cta" className="reveal" style={{
        background: 'white', padding: '90px 40px', textAlign: 'center',
        position: 'relative', overflow: 'hidden', borderTop: '1px solid #ececec'
      }}>
        {visible['cta'] && document.getElementById('cta') && document.getElementById('cta').classList.add('show')}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '38px', fontWeight: '900', color: '#2d3436', margin: '0 0 16px' }}>
            Start your journey<br />
            <span style={{ color: brandTeal }}>today for free</span>
          </h2>
          <p style={{ color: '#888', fontSize: '16px', marginBottom: '16px', lineHeight: 1.7 }}>
            Signup karo aur turant access pao — flights, hotels, digital vault aur social feed.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '36px', flexWrap: 'wrap' }}>
            {['No credit card required', 'Free forever plan', '10K+ travelers'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill={`${brandTeal}22`}/>
                  <path d="M8 12l3 3 5-5" stroke={brandTeal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: '13px', color: '#636e72', fontWeight: '600' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#1a1a2e', padding: '30px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logoImg} alt="Logo" style={{ height: '28px', width: '28px', borderRadius: '50%' }} />
          <span style={{ color: brandTeal, fontWeight: '800', fontSize: '15px' }}>TripMates</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>2025 TripMates. Made with love for travelers.</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy', 'Terms', 'Support'].map(l => (
            <span key={l} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FeaturesTour;