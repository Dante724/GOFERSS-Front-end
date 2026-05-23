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

      {/* Beautiful WhatsApp Logo */}
      <a
        href="https://wa.me/message/LYXZX5D5BDVGM1"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '95px',
          zIndex: 1000,
          width: '58px',
          height: '58px',
          borderRadius: '18px',
          background:
            'linear-gradient(135deg, #25D366, #1ebe5d)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow:
            '0 0 20px rgba(37,211,102,0.5)',
          border: '2px solid rgba(255,255,255,0.4)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          style={{
            width: '34px',
            height: '34px',
          }}
        />
      </a>

      <Toaster />
    </div>
  );
}

export default App;
