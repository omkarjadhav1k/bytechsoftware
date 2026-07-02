import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import DebugPanel from './components/DebugPanel';

export default function App() {
  // We default to 'dark' for a high-end luxury fine-dining vibe, but allow toggling
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', transition: 'background-color 0.3s ease' }}>
      
      {/* Navigation Header */}
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      {/* Page Content sections */}
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Highlights & Features Section */}
        <Highlights />
        
        {/* Interactive Food Menu */}
        <Menu />
        
        {/* Vibe & Food Gallery */}
        <Gallery />
        
        {/* Customer Reviews & Google Maps Stats */}
        <Reviews />
        
        {/* Contact info, Map and Credits Footer */}
        <Contact />
      </main>

      {/* Floating admin tool to map photos in real-time */}
      <DebugPanel />

    </div>
  );
}
