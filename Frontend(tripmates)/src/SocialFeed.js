import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logoImg from './tripmates logo.jpeg';
import { useTheme } from './ThemeContext';

const SocialFeed = ({ user, onLogout }) => {
  const userData = user || JSON.parse(localStorage.getItem('user'));
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const yellow      = theme.accent;
const forestGreen = theme.primary;
const darkGreen   = theme.navBg;
const brown       = theme.secondary;
const beige       = theme.pageBg;


  const [showMenu, setShowMenu] = useState(false);
  const [postCaption, setPostCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalRewardPoints, setTotalRewardPoints] = useState(0);
  const [likedPosts, setLikedPosts] = useState([]);
  const [shareMsg, setShareMsg] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/posts');
        setPosts(response.data);
        const myPosts = response.data.filter(p => p.user === (userData?.fullName || "Traveler"));
        const total = myPosts.reduce((sum, p) => sum + (p.points || 0), 0);
        setTotalRewardPoints(total);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchPosts();
  }, [userData?.fullName]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!postCaption.trim() && !selectedImage) return;
    const newPostData = {
      user: userData?.fullName || "Traveler",
      caption: postCaption,
      image: selectedImage,
      location: "Explorer Mode"
    };
    try {
      const res = await axios.post('http://localhost:5001/api/posts', newPostData);
      setPosts([res.data, ...posts]);
      setTotalRewardPoints(prev => prev + 100);
      setPostCaption('');
      setSelectedImage(null);
    } catch (err) {
      console.error("Post error:", err);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5001/api/posts/${postId}`);
      const deletedPost = posts.find(p => p._id === postId);
      if (deletedPost?.user === (userData?.fullName || "Traveler")) {
        setTotalRewardPoints(prev => Math.max(0, prev - 100));
      }
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleLike = async (postId) => {
    if (likedPosts.includes(postId)) return;
    try {
      const res = await axios.patch(`http://localhost:5001/api/posts/${postId}/like`);
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data.likes } : p));
      setLikedPosts([...likedPosts, postId]);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleShare = (post) => {
    const text = `Check out ${post.user}'s travel post on TripMates: "${post.caption}"`;
    if (navigator.share) {
      navigator.share({ title: 'TripMates Post', text });
    } else {
      navigator.clipboard.writeText(text);
      setShareMsg(post._id);
      setTimeout(() => setShareMsg(null), 2000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.pageBg, width: '100vw', overflowX: 'hidden', fontFamily: 'Poppins, sans-serif' }}>

      <style>{`
        .action-btn:hover { background: #F5EDE4 !important; }
        .like-active { color: ${yellow} !important; }
        .sidebar-item:hover { background: #F5EDE4 !important; color: ${brown} !important; padding-left: 8px !important; transition: all 0.2s; }
        .post-card:hover { box-shadow: 0 8px 30px rgba(75,54,33,0.12) !important; transform: translateY(-1px); transition: all 0.2s; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 40px', background: darkGreen,
        borderBottom: `3px solid ${yellow}`,
        position: 'sticky', top: 0, zIndex: 1000,
        boxShadow: '0 4px 20px rgba(27,94,32,0.35)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div onClick={() => setShowMenu(true)} style={{ cursor: 'pointer', padding: '5px' }}>
            <div style={{ width: '22px', height: '2px', background: yellow, margin: '4px 0' }}></div>
            <div style={{ width: '22px', height: '2px', background: yellow, margin: '4px 0' }}></div>
            <div style={{ width: '22px', height: '2px', background: yellow, margin: '4px 0' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logoImg} alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
            <h2 style={{ color: yellow, margin: 0, fontSize: '20px', fontWeight: '800' }}>TripMates</h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            background: `linear-gradient(135deg, ${yellow}, #FFC107)`,
            color: brown, padding: '8px 18px', borderRadius: '30px',
            fontSize: '14px', fontWeight: '700',
            boxShadow: `0 4px 15px ${yellow}55`
          }}>
            {totalRewardPoints} pts
          </div>
          <div
            onClick={() => navigate('/dashboard')}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${forestGreen}, ${brown})`,
              color: 'white', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: '800', cursor: 'pointer',
              border: `2px solid ${yellow}`, fontSize: '16px'
            }}>
            {userData?.fullName?.charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div style={{
        position: 'fixed', top: 0, left: showMenu ? 0 : '-320px',
        width: '280px', height: '100vh', background: 'white',
        boxShadow: '5px 0 25px rgba(75,54,33,0.2)', zIndex: 2000,
        transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '25px', display: 'flex', flexDirection: 'column',
        boxSizing: 'border-box', overflowY: 'auto',
        borderRight: `3px solid ${yellow}`
      }}>
        <button onClick={() => setShowMenu(false)} style={{
          background: 'none', border: 'none', fontSize: '32px', cursor: 'pointer',
          alignSelf: 'flex-start', color: brown, marginBottom: '20px'
        }}>&times;</button>

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${forestGreen}, ${brown})`,
            color: 'white', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: '800', fontSize: '20px',
            border: `2px solid ${yellow}`
          }}>
            {userData?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: brown }}>{userData?.fullName}</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>@{userData?.username}</div>
          </div>
        </div>

        {/* Reward points */}
        <div style={{
          background: `linear-gradient(135deg, ${brown}, ${forestGreen})`,
          borderRadius: '15px', padding: '18px', color: 'white',
          marginBottom: '25px', textAlign: 'center',
          boxShadow: `0 6px 20px ${brown}44`
        }}>
          <div style={{ fontSize: '28px', fontWeight: '900', color: yellow }}>{totalRewardPoints}</div>
          <div style={{ fontSize: '13px', opacity: 0.9 }}>Your Reward Points</div>
          <div style={{ fontSize: '11px', opacity: 0.75, marginTop: '5px' }}>+100 per post</div>
        </div>

        <h3 style={{ color: brown, fontSize: '13px', letterSpacing: '2px', marginBottom: '12px', fontWeight: '800' }}>SERVICES</h3>
        <div style={{ flex: 1 }}>
          {[
            { label: 'Flight Booking',    route: '/flights' },
            { label: 'Hotel Booking',     route: '/hotels'  },
            { label: 'Digital Vault',     route: '/vault'   },
            { label: 'Smart Itineraries', route: '/itinerary' },
            { label: 'TripMates Magic',   route: '/magic'   },
            { label: 'Local Guides',      route: '/guides'  },
            { label: 'Activities',        route: '/plan'     },
            { label: 'Safety Hub',        route: '/safety' },
            { label: 'Settings',          route: '/settings'},
          ].map((item, i) => (
            <p key={i}
              className="sidebar-item"
              onClick={() => item.route && navigate(item.route)}
              style={{
                padding: '13px 8px', borderBottom: `1px solid ${beige}`,
                cursor: item.route ? 'pointer' : 'default',
                color: item.route ? brown : '#9a8866',
                fontWeight: item.route ? '600' : '400',
                fontSize: '14px', margin: 0, borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: item.route ? yellow : '#ddd' }} />
              {item.label}
            </p>
          ))}
        </div>

        <button onClick={onLogout} style={{
          width: '100%',
          background: `linear-gradient(135deg, ${brown}, ${forestGreen})`,
          color: 'white', border: 'none',
          padding: '14px', borderRadius: '12px', fontWeight: '700',
          cursor: 'pointer', marginBottom: '20px', fontFamily: 'Poppins, sans-serif',
          boxShadow: `0 4px 16px ${brown}44`
        }}>Logout</button>
      </div>

      {showMenu && (
        <div onClick={() => setShowMenu(false)} style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(75,54,33,0.25)', zIndex: 1999
        }} />
      )}

      {/* Main Feed */}
      <div style={{ width: '100%', padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>

        {/* Post Creation Box */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '20px', marginBottom: '24px',
          width: '100%', maxWidth: '700px',
          border: `1px solid #EDE0D0`,
          boxShadow: '0 4px 20px rgba(75,54,33,0.08)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${forestGreen}, ${brown})`,
              color: 'white', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0
            }}>
              {userData?.fullName?.charAt(0).toUpperCase()}
            </div>
            <input
              value={postCaption}
              onChange={(e) => setPostCaption(e.target.value)}
              placeholder={`What's your travel story, ${userData?.fullName?.split(' ')[0] || 'Traveler'}?`}
              style={{
                flex: 1, border: 'none', background: beige, padding: '13px 18px',
                borderRadius: '30px', outline: 'none', fontSize: '14px',
                boxSizing: 'border-box', color: brown,
                fontFamily: 'Poppins, sans-serif'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: `1px solid ${beige}` }}>
            <div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
              <button onClick={() => fileInputRef.current.click()} style={{
                background: 'none', border: `1.5px solid ${forestGreen}`, color: forestGreen,
                fontWeight: '700', cursor: 'pointer', fontSize: '12px',
                padding: '6px 16px', borderRadius: '20px', fontFamily: 'Poppins, sans-serif'
              }}>
                + PHOTO
              </button>
            </div>
            <button onClick={handlePost} style={{
              background: `linear-gradient(135deg, ${yellow}, #FFC107)`,
              color: brown, border: 'none', padding: '10px 30px',
              borderRadius: '30px', fontWeight: '800', cursor: 'pointer',
              boxShadow: `0 4px 15px ${yellow}55`, fontFamily: 'Poppins, sans-serif',
              fontSize: '14px'
            }}>POST</button>
          </div>

          {selectedImage && (
            <div style={{ marginTop: '15px', position: 'relative' }}>
              <img src={selectedImage} alt="Preview" style={{ width: '100%', borderRadius: '12px', maxHeight: '300px', objectFit: 'cover' }} />
              <button onClick={() => setSelectedImage(null)} style={{
                position: 'absolute', top: '10px', right: '10px', background: 'rgba(75,54,33,0.7)',
                color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px',
                cursor: 'pointer', fontSize: '16px'
              }}>&times;</button>
            </div>
          )}
        </div>

        {/* Posts */}
        <div style={{ width: '100%', maxWidth: '700px' }}>
          {posts.map(post => (
            <div key={post._id} className="post-card" style={{
              background: 'white', borderRadius: '20px', marginBottom: '24px',
              border: '1px solid #EDE0D0', overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(75,54,33,0.08)'
            }}>

              {/* Post Header */}
              <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${beige}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${forestGreen}, ${brown})`,
                    color: 'white', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: '800', fontSize: '18px'
                  }}>
                    {post.user?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: brown }}>{post.user}</div>
                    <div style={{ fontSize: '12px', color: '#9a8866' }}>{post.location || 'Explorer Mode'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    background: `${yellow}22`, border: `1px solid ${yellow}66`,
                    borderRadius: '20px', padding: '3px 10px',
                    fontSize: '11px', color: brown, fontWeight: '600'
                  }}>+100 pts</div>
                  {post.user === (userData?.fullName || "Traveler") && (
                    <button onClick={() => deletePost(post._id)} style={{
                      background: 'none', border: 'none', color: '#cc0000',
                      cursor: 'pointer', fontWeight: '700', fontSize: '12px',
                      fontFamily: 'Poppins, sans-serif'
                    }}>DELETE</button>
                  )}
                </div>
              </div>

              {/* Post Image */}
              {post.image && (
                <img src={post.image} alt="Post" style={{ width: '100%', display: 'block', maxHeight: '500px', objectFit: 'cover' }} />
              )}

              {/* Caption */}
              <div style={{ padding: '12px 18px 4px' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: brown }}>{post.user} </span>
                <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{post.caption}</span>
              </div>

              {/* Like + Share Row */}
              <div style={{ padding: '8px 18px 14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  className="action-btn"
                  onClick={() => handleLike(post._id)}
                  style={{
                    background: 'none', border: 'none',
                    cursor: likedPosts.includes(post._id) ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '13px', fontWeight: '700',
                    color: likedPosts.includes(post._id) ? yellow : '#6B7280',
                    padding: '7px 14px', borderRadius: '30px', transition: 'background 0.2s',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24"
                    fill={likedPosts.includes(post._id) ? yellow : 'none'}
                    stroke={likedPosts.includes(post._id) ? yellow : '#6B7280'}
                    strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {post.likes || 0} Likes
                </button>

                <div style={{ position: 'relative' }}>
                  <button
                    className="action-btn"
                    onClick={() => handleShare(post)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      fontSize: '13px', fontWeight: '700', color: '#6B7280',
                      padding: '7px 14px', borderRadius: '30px', transition: 'background 0.2s',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Share
                  </button>
                  {shareMsg === post._id && (
                    <div style={{
                      position: 'absolute', bottom: '115%', left: '50%', transform: 'translateX(-50%)',
                      background: brown, color: 'white', padding: '6px 12px',
                      borderRadius: '8px', fontSize: '12px', whiteSpace: 'nowrap'
                    }}>
                      Copied!
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;