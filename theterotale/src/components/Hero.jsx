import React from 'react';
import { Star, MapPin, Compass, ShieldCheck } from 'lucide-react';
import photos from '../data/photos.json';

export default function Hero() {
  const heroImgUrl = "/photo/PhotoshopExtension_Image (4).png";

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="section"
      style={{
        paddingTop: '160px',
        paddingBottom: '100px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Decorative Blur Spheres for Design depth */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197, 168, 128, 0.1) 0%, rgba(230, 95, 43, 0.05) 50%, rgba(0,0,0,0) 100%)',
        filter: 'blur(60px)',
        zIndex: -1,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(46, 125, 50, 0.08) 0%, rgba(197, 168, 128, 0.03) 70%, rgba(0,0,0,0) 100%)',
        filter: 'blur(50px)',
        zIndex: -1,
      }} />

      <div className="container">
        <div className="grid-2" style={{ alignItems: 'center' }}>
          
          {/* Left Text Column */}
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
            
            {/* Pure Veg Indicator Tag */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span className="badge-pureveg">
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'currentColor'
                }} />
                100% PURE VEGETARIAN
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}>
                <ShieldCheck size={14} style={{ color: 'var(--accent-gold)' }} />
                Premium Quality Fine-Dine
              </span>
            </div>

            {/* Title / Slogan */}
            <h1 style={{ 
              fontSize: 'clamp(40px, 5vw, 64px)', 
              fontWeight: 800, 
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              margin: 0
            }}>
              All Delicious Food is <br/>
              Available at <span className="text-gradient-coral">The Terotale</span>
            </h1>

            {/* Subtext */}
            <p style={{ 
              fontSize: '17px', 
              color: 'var(--text-secondary)', 
              maxWidth: '540px',
              margin: 0,
              lineHeight: 1.6
            }}>
              Discover Nashik's finest culinary destination. Experience a soothing ambience with minimal design, cozy seating, and a versatile menu crafted with love. Ground floor & covered rooftop dining.
            </p>

            {/* Rating / Spend Stats */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '16px 28px', 
              alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)',
              padding: '16px 24px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              maxWidth: '500px',
              boxShadow: 'var(--card-shadow)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  padding: '8px',
                  borderRadius: '50%',
                  color: '#D97706'
                }}>
                  <Star size={18} fill="currentColor" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '18px' }}>4.7 / 5.0</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>6,250+ Google Reviews</div>
                </div>
              </div>

              <div style={{ width: '1px', height: '36px', backgroundColor: 'var(--border-color)', display: 'none' }} className="divider" />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(197, 168, 128, 0.1)',
                  border: '1px solid rgba(197, 168, 128, 0.2)',
                  padding: '8px',
                  borderRadius: '50%',
                  color: 'var(--accent-gold)'
                }}>
                  <span style={{ fontWeight: 800, fontSize: '15px' }}>₹</span>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '18px' }}>₹200 – ₹600</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Average cost per person</div>
                </div>
              </div>
            </div>

            {/* Call to Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
              <button 
                onClick={() => scrollToSection('menu')}
                className="btn btn-primary"
                style={{ padding: '14px 32px', fontSize: '16px' }}
              >
                Explore Menu
              </button>
              <a 
                href="https://www.google.com/maps/place/THE+TEROTALE/@19.9913633,73.7581925,17z/data=!3m1!4b1!4m6!3m5!1s0x3bddeb761da64c91:0x4609751dd55ee07a!8m2!3d19.9913583!4d73.7607674!16s%2Fg%2F11q4m1rt84?entry=ttu" 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: '14px 32px', fontSize: '16px' }}
              >
                <MapPin size={18} />
                Get Directions
              </a>
            </div>

          </div>

          {/* Right Graphics Column */}
          <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            
            {/* Spinning Food Plate Frame */}
            <div 
              style={{
                position: 'relative',
                width: 'min(380px, 90vw)',
                height: 'min(380px, 90vw)',
                borderRadius: '50%',
                border: '6px solid var(--accent-gold)',
                padding: '12px',
                boxShadow: 'var(--card-shadow)',
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
              className="animate-float"
            >
              {/* Spinning Inner Image */}
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img 
                  src={heroImgUrl}
                  alt="Popular Signature Dish at The Terotale" 
                  style={{
                    width: '120%',
                    height: '120%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                  }}
                />
              </div>

              {/* Central badge logo inside the spinning plate */}
              <div style={{
                position: 'absolute',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-coral)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: '11px',
                border: '4px solid var(--bg-secondary)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                top: '-15px',
                right: '20px',
                transform: 'none'
              }}>
                PURE VEG
              </div>
            </div>

            {/* Background Circular Outline Decors (from Foodle) */}
            <svg 
              viewBox="0 0 100 100" 
              style={{
                position: 'absolute',
                width: '115%',
                height: '115%',
                top: '-7.5%',
                left: '-7.5%',
                pointerEvents: 'none',
                opacity: 0.35,
                zIndex: 1
              }}
            >
              <circle cx="50" cy="50" r="46" fill="none" stroke="var(--accent-gold)" strokeWidth="0.5" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent-coral)" strokeWidth="0.3" />
            </svg>

            {/* Floating Info Card 1 */}
            <div 
              className="glass-card"
              style={{
                position: 'absolute',
                bottom: '10%',
                left: '-20px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 3,
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{
                backgroundColor: 'var(--accent-green-bg)',
                color: 'var(--accent-green)',
                padding: '6px',
                borderRadius: '50%',
              }}>
                <Compass size={18} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>2 Dining Floors</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Ground & Cozy Rooftop</div>
              </div>
            </div>

            {/* Floating Info Card 2 */}
            <div 
              className="glass-card"
              style={{
                position: 'absolute',
                top: '10%',
                right: '-20px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 3,
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{
                backgroundColor: 'rgba(230, 95, 43, 0.1)',
                color: 'var(--accent-coral)',
                padding: '6px',
                borderRadius: '50%',
              }}>
                <Star size={18} fill="currentColor" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>Soothing Ambience</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Minimal Elegant Design</div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .divider {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
}
