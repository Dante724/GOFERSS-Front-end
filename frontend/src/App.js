
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import { Toaster } from './components/ui/sonner';
 
/* ─── Inline styles for the glass buttons ─── */
const styles = {
  wrapper: {
    position: 'fixed',
    right: '22px',
    bottom: '30px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
 
  /* shared base for every button */
  btn: {
    width: '60px',
    height: '60px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease',
    /* Glass base */
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.18)',
  },
 
  whatsapp: {
    background:
      'linear-gradient(145deg, rgba(37,211,102,0.22) 0%, rgba(18,140,60,0.18) 100%)',
    boxShadow:
      '0 8px 32px rgba(37,211,102,0.22), 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.22)',
  },
 
  instagram: {
    background:
      'linear-gradient(145deg, rgba(131,58,180,0.22) 0%, rgba(253,29,29,0.15) 50%, rgba(252,175,69,0.18) 100%)',
    boxShadow:
      '0 8px 32px rgba(200,50,130,0.22), 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.22)',
  },
 
  /* top-left specular shine */
  shine: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    width: '52%',
    height: '38%',
    borderRadius: '12px',
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.04) 100%)',
    pointerEvents: 'none',
  },
 
  /* subtle bottom reflection */
  reflection: {
    position: 'absolute',
    bottom: '4px',
    left: '10%',
    width: '80%',
    height: '18%',
    borderRadius: '8px',
    background:
      'linear-gradient(to top, rgba(255,255,255,0.10), transparent)',
    pointerEvents: 'none',
  },
 
  icon: {
    width: '28px',
    height: '28px',
    zIndex: 2,
    position: 'relative',
    filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.25))',
    transition: 'transform 0.2s ease',
  },
 
  igIcon: {
    borderRadius: '7px',
  },
 
  /* ripple ring on hover — done via CSS keyframe injected below */
  ring: {
    position: 'absolute',
    inset: 0,
    borderRadius: '20px',
    pointerEvents: 'none',
  },
};
 
/* Inject hover & pulse keyframes once */
if (typeof document !== 'undefined' && !document.getElementById('_gfss_btn_css')) {
  const tag = document.createElement('style');
  tag.id = '_gfss_btn_css';
  tag.textContent = `
    ._gfss_btn:hover {
      transform: translateY(-4px) scale(1.07) !important;
    }
    ._gfss_btn:hover img {
      transform: scale(1.12) rotate(-4deg);
    }
    ._gfss_btn:active {
      transform: scale(0.95) !important;
    }
    @keyframes _pulse_wa {
      0%   { box-shadow: 0 8px 32px rgba(37,211,102,0.22), 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.22); }
      50%  { box-shadow: 0 8px 40px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.22); }
      100% { box-shadow: 0 8px 32px rgba(37,211,102,0.22), 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.22); }
    }
    @keyframes _pulse_ig {
      0%   { box-shadow: 0 8px 32px rgba(200,50,130,0.22), 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.22); }
      50%  { box-shadow: 0 8px 40px rgba(200,50,130,0.48), 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.22); }
      100% { box-shadow: 0 8px 32px rgba(200,50,130,0.22), 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.22); }
    }
    ._pulse_wa { animation: _pulse_wa 2.8s ease-in-out infinite; }
    ._pulse_ig { animation: _pulse_ig 2.8s ease-in-out infinite 1.4s; }
  `;
  document.head.appendChild(tag);
}
 
function SocialButtons() {
  return (
    <div style={styles.wrapper}>
 
      {/* ── WhatsApp ── */}
      <a
        href="https://wa.me/message/LYXZX5D5BDVGM1"
        target="_blank"
        rel="noopener noreferrer"
        className="_gfss_btn _pulse_wa"
        style={{ ...styles.btn, ...styles.whatsapp }}
        title="Chat on WhatsApp"
      >
        <div style={styles.shine} />
        <div style={styles.reflection} />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          style={styles.icon}
        />
      </a>
 
      {/* ── Instagram ── */}
      <a
        href="https://www.instagram.com/wegofers?igsh=MWdrYjlrbHpoZjRqeQ=="
        target="_blank"
        rel="noopener noreferrer"
        className="_gfss_btn _pulse_ig"
        style={{ ...styles.btn, ...styles.instagram }}
        title="Follow on Instagram"
      >
        <div style={styles.shine} />
        <div style={styles.reflection} />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
          alt="Instagram"
          style={{ ...styles.icon, ...styles.igIcon }}
        />
      </a>
 
    </div>
  );
}
 
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
        </Routes>
      </BrowserRouter>
 
      <SocialButtons />
 
      <Toaster />
    </div>
  );
}
 
export default App;
