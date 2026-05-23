import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import { Toaster } from './components/ui/sonner';

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

      {/* iOS Glass Social Buttons */}
      <div
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '25px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >

        {/* WhatsApp */}
        <a
          href="https://wa.me/message/LYXZX5D5BDVGM1"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '24px',
            background:
              'linear-gradient(135deg, rgba(37,211,102,0.95), rgba(20,180,80,0.85))',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255,255,255,0.35)',
            boxShadow:
              '0 0 30px rgba(37,211,102,0.45), inset 0 1px 1px rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            textDecoration: 'none',
          }}
        >
          {/* Glass Shine */}
          <div
            style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              width: '80%',
              height: '35%',
              borderRadius: '18px',
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.45), rgba(255,255,255,0.05))',
            }}
          />

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            style={{
              width: '36px',
              height: '36px',
              zIndex: 2,
              filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5))',
            }}
          />
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/wegofers?igsh=MWdrYjlrbHpoZjRqeQ=="
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '24px',
            background:
              'linear-gradient(135deg, #833AB4, #FD1D1D, #FCAF45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255,255,255,0.35)',
            boxShadow:
              '0 0 30px rgba(255,0,128,0.35), inset 0 1px 1px rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            textDecoration: 'none',
          }}
        >
          {/* Glass Shine */}
          <div
            style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              width: '80%',
              height: '35%',
              borderRadius: '18px',
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.45), rgba(255,255,255,0.05))',
            }}
          />

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt="Instagram"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              zIndex: 2,
              filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5))',
            }}
          />
        </a>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
