import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from './tripmates logo.jpeg';
import { useTheme } from './ThemeContext';

const DigitalVault = ({ user }) => {
  const navigate = useNavigate();
  const userData = user || JSON.parse(localStorage.getItem('user'));
  const { theme } = useTheme();

  const deepNavy    = theme.navBg;
  const purple      = theme.accent;
  const lightPurple = theme.navText;
  const bgLight     = theme.pageBg;
  const midPurple   = theme.primary;

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewDoc, setViewDoc] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState('Passport / ID');
  const [docFile, setDocFile] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const fileInputRef = useRef();

  const categories = ['All', 'Passport / ID', 'Travel Tickets', 'Hotel Receipts', 'Visa Documents'];

  const categoryColors = {
    'Passport / ID': '#534AB7',
    'Travel Tickets': '#1D9E75',
    'Hotel Receipts': '#c9a84c',
    'Visa Documents': '#D85A30',
  };

 // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadDocs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5001/api/vault/${userData?.username}`);
        setDocuments(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
      setLoading(false);
    };
    loadDocs();
  }, [userData?.username]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/vault/${userData?.username}`);
      setDocuments(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setDocFile(reader.result);
      setDocPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!docName.trim() || !docFile) {
      setUploadError('Document name aur file dono required hain.');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      await axios.post('http://localhost:5001/api/vault', {
        username: userData?.username,
        docName,
        category: docCategory,
        fileData: docFile,
      });
      setDocName('');
      setDocCategory('Passport / ID');
      setDocFile(null);
      setDocPreview(null);
      setShowUploadModal(false);
      fetchDocuments();
    } catch (err) {
      setUploadError(err?.response?.data?.message || 'Upload failed. Try again.');
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/vault/${id}`);
      fetchDocuments();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredDocs = activeCategory === 'All'
    ? documents
    : documents.filter(d => d.category === activeCategory);

  const getCategoryCount = (cat) => documents.filter(d => d.category === cat).length;

  const isImage = (data) => data && data.startsWith('data:image');

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: `1.5px solid ${lightPurple}`,
    borderRadius: '10px', fontSize: '14px', outline: 'none',
    fontFamily: 'Poppins, sans-serif', color: deepNavy,
    background: theme.cardBg, boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: '700', color: purple,
    letterSpacing: '1px', marginBottom: '6px', display: 'block'
  };

  return (
    <div style={{ minHeight: '100vh', background: bgLight, fontFamily: 'Poppins, sans-serif' }}>

      <style>{`
        .vault-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.15) !important; }
        .vault-card { transition: all 0.2s ease; }
        .cat-btn:hover { background: ${midPurple} !important; color: white !important; }
        .del-btn:hover { background: #ff7675 !important; color: white !important; }
        .vault-input:focus { border-color: ${purple} !important; }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .docs-grid { grid-template-columns: 1fr !important; }
          .nav-pad { padding: 10px 16px !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 40px', background: deepNavy,
        borderBottom: `3px solid ${purple}`,
        position: 'sticky', top: 0, zIndex: 1000,
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
      }} className="nav-pad">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/feed')}>
          <img src={logoImg} alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
          <h2 style={{ color: lightPurple, margin: 0, fontSize: '18px', fontWeight: '800' }}>TripMates</h2>
        </div>
        <div style={{ fontWeight: '700', fontSize: '15px', color: theme.navText }}>Digital Vault</div>
        <button onClick={() => navigate('/feed')} style={{
          background: 'none', border: `2px solid ${lightPurple}`, color: lightPurple,
          padding: '7px 18px', borderRadius: '30px', fontWeight: '700',
          cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif'
        }}>Back to Feed</button>
      </nav>

      {/* Hero */}
      <div style={{
        background: theme.coverBg,
        padding: '45px 40px', textAlign: 'center'
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: `${lightPurple}22`, border: `2px solid ${lightPurple}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" fill={lightPurple} />
            <path d="M7 11V7a5 5 0 0110 0v4" stroke={lightPurple} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
          </svg>
        </div>
        <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '900', color: 'white' }}>
          Your <span style={{ color: lightPurple }}>Digital Vault</span>
        </h1>
        <p style={{ margin: 0, color: `${lightPurple}99`, fontSize: '14px' }}>
          Securely store all your travel documents in one place
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px', boxSizing: 'border-box' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '28px', marginTop: '-20px', position: 'relative', zIndex: 10 }} className="stats-grid">
          {categories.slice(1).map((cat) => (
            <div key={cat} style={{
              background: theme.cardBg, borderRadius: '16px', padding: '16px',
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center'
            }}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: deepNavy }}>{getCategoryCount(cat)}</div>
              <div style={{ fontSize: '11px', color: purple, fontWeight: '600', marginTop: '2px' }}>{cat}</div>
            </div>
          ))}
        </div>

        {/* Category Filter + Upload Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} className="cat-btn" onClick={() => setActiveCategory(cat)} style={{
                padding: '7px 18px', borderRadius: '30px', border: 'none',
                fontWeight: '700', fontSize: '12px', cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s',
                background: activeCategory === cat ? deepNavy : theme.cardBg,
                color: activeCategory === cat ? lightPurple : purple,
                boxShadow: activeCategory === cat ? `0 4px 12px ${deepNavy}44` : '0 2px 8px rgba(0,0,0,0.06)'
              }}>{cat}</button>
            ))}
          </div>
          <button onClick={() => { setShowUploadModal(true); setUploadError(''); }} style={{
            background: theme.btnBg,
            color: theme.btnText, border: 'none', padding: '10px 22px',
            borderRadius: '30px', fontWeight: '700', fontSize: '13px',
            cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
            boxShadow: `0 4px 16px ${deepNavy}55`
          }}>+ Upload Document</button>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: purple }}>Loading your vault...</div>
        ) : filteredDocs.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px', background: theme.cardBg,
            borderRadius: '20px', border: `1px dashed ${lightPurple}`
          }}>
            <div style={{ marginBottom: '12px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto', display: 'block' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" fill={bgLight} stroke={lightPurple} strokeWidth="1.5"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke={lightPurple} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div style={{ color: purple, fontWeight: '700', fontSize: '15px', marginBottom: '6px' }}>No documents yet</div>
            <div style={{ color: lightPurple, fontSize: '13px' }}>Upload your first document to get started</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="docs-grid">
            {filteredDocs.map((doc) => (
              <div key={doc._id} className="vault-card" style={{
                background: theme.cardBg, borderRadius: '18px', padding: '20px',
                border: `1px solid ${theme.cardBorder}`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.07)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '48px', height: '56px', borderRadius: '10px', flexShrink: 0,
                    background: deepNavy, overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isImage(doc.fileData) ? (
                      <img src={doc.fileData} alt={doc.docName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
                        <rect x="1" y="1" width="20" height="24" rx="3" fill={midPurple} />
                        <path d="M5 8h12M5 12h12M5 16h8" stroke={lightPurple} strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: theme.secondary, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.docName}</div>
                    <div style={{ display: 'inline-block', background: `${categoryColors[doc.category]}22`, border: `0.5px solid ${categoryColors[doc.category]}66`, borderRadius: '20px', padding: '2px 10px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: categoryColors[doc.category] }}>{doc.category}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: lightPurple }}>
                      {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                  <button onClick={() => setViewDoc(doc)} style={{
                    flex: 1, padding: '8px', borderRadius: '10px',
                    border: `1.5px solid ${purple}`, background: 'none',
                    color: purple, fontWeight: '700', fontSize: '12px',
                    cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
                  }}>View</button>
                  <button className="del-btn" onClick={() => handleDelete(doc._id)} style={{
                    flex: 1, padding: '8px', borderRadius: '10px',
                    border: '1.5px solid #ff7675', background: 'none',
                    color: '#ff7675', fontWeight: '700', fontSize: '12px',
                    cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                    transition: 'all 0.2s'
                  }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: `${deepNavy}99`, zIndex: 3000, overflowY: 'auto',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          padding: '30px 20px', boxSizing: 'border-box'
        }}>
          <div style={{
            background: theme.cardBg, borderRadius: '24px', padding: '35px',
            width: '100%', maxWidth: '500px', boxSizing: 'border-box',
            boxShadow: `0 20px 60px ${deepNavy}55`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: theme.secondary }}>Upload Document</h2>
              <button onClick={() => setShowUploadModal(false)} style={{
                background: bgLight, border: 'none', borderRadius: '50%',
                width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', color: purple
              }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>DOCUMENT NAME *</label>
                <input className="vault-input" value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g. My Passport, India Visa" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>CATEGORY *</label>
                <select className="vault-input" value={docCategory} onChange={e => setDocCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option>Passport / ID</option>
                  <option>Travel Tickets</option>
                  <option>Hotel Receipts</option>
                  <option>Visa Documents</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>FILE (IMAGE / PDF) *</label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    border: `2px dashed ${lightPurple}`, borderRadius: '12px',
                    padding: '24px', textAlign: 'center', cursor: 'pointer',
                    background: bgLight, transition: 'all 0.2s'
                  }}>
                  {docPreview ? (
                    isImage(docPreview) ? (
                      <img src={docPreview} alt="preview" style={{ maxHeight: '120px', borderRadius: '8px', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ color: midPurple, fontWeight: '700', fontSize: '14px' }}>PDF Selected</div>
                    )
                  ) : (
                    <>
                      <div style={{ color: purple, fontSize: '13px', fontWeight: '600' }}>Click to select file</div>
                      <div style={{ color: lightPurple, fontSize: '12px', marginTop: '4px' }}>Image or PDF supported</div>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*,application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
              </div>
            </div>

            {uploadError && (
              <p style={{ color: '#ff7675', fontSize: '13px', textAlign: 'center', marginBottom: '12px', fontWeight: '600' }}>{uploadError}</p>
            )}

            <button onClick={handleUpload} disabled={uploading} style={{
              width: '100%', background: theme.btnBg,
              color: theme.btnText, border: 'none', padding: '15px', borderRadius: '14px',
              fontSize: '15px', fontWeight: '800', cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif', opacity: uploading ? 0.7 : 1
            }}>
              {uploading ? 'Uploading...' : 'Upload to Vault'}
            </button>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {viewDoc && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: `${deepNavy}bb`, zIndex: 3000,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '20px', boxSizing: 'border-box'
        }}>
          <div style={{
            background: theme.cardBg, borderRadius: '24px', padding: '30px',
            width: '100%', maxWidth: '520px', boxSizing: 'border-box',
            boxShadow: `0 20px 60px ${deepNavy}55`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '900', color: theme.secondary }}>{viewDoc.docName}</h2>
                <span style={{ fontSize: '12px', color: purple }}>{viewDoc.category}</span>
              </div>
              <button onClick={() => setViewDoc(null)} style={{
                background: bgLight, border: 'none', borderRadius: '50%',
                width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', color: purple
              }}>&times;</button>
            </div>
            <div style={{ textAlign: 'center', background: bgLight, borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
              {isImage(viewDoc.fileData) ? (
                <img src={viewDoc.fileData} alt={viewDoc.docName} style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px', objectFit: 'contain' }} />
              ) : (
                <div style={{ padding: '40px 0' }}>
                  <svg width="48" height="56" viewBox="0 0 48 56" fill="none" style={{ display: 'block', margin: '0 auto 12px' }}>
                    <rect width="48" height="56" rx="6" fill={deepNavy} />
                    <path d="M10 20h28M10 28h28M10 36h18" stroke={lightPurple} strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  <div style={{ color: purple, fontWeight: '700', fontSize: '14px' }}>PDF Document</div>
                </div>
              )}
            </div>
            <a href={viewDoc.fileData} download={viewDoc.docName} style={{
              display: 'block', textAlign: 'center',
              background: theme.btnBg,
              color: theme.btnText, padding: '13px', borderRadius: '12px',
              fontWeight: '700', fontSize: '14px', textDecoration: 'none'
            }}>Download Document</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalVault;