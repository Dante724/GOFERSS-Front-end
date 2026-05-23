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

      {/* WhatsApp Logo */}
      <a
        href="https://wa.me/message/LYXZX5D5BDVGM1"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '90px',
          zIndex: 1000,
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
          }}
        />
      </a>

      <Toaster />
    </div>
  );
}

export default App;
