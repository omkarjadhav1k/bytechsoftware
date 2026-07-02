import React from 'react';
import { MapPin, Phone, Clock, Mail, ExternalLink } from 'lucide-react';

export default function Contact() {
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.1983577322896!2d73.7581925!3d19.9913633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb761da64c91%3A0x4609751dd55ee07a!2sTHE%20TEROTALE!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  const handleNavClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      
      {/* Contact & Map Section */}
      <div className="section" style={{ paddingBottom: '40px' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'stretch', gap: '50px' }}>
            
            {/* Contact Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', textAlign: 'left' }}>
              <div>
                <span className="badge-pureveg" style={{ marginBottom: '12px' }}>
                  CONTACT US
                </span>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, marginBottom: '16px' }}>
                  Visit Our Restaurant
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                  We are conveniently located in Parijat Nagar, Nashik, opposite the City Center Mall. Join us for a soothing lunch or dinner.
                </p>
              </div>

              {/* Info Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--accent-coral)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)',
                    flexShrink: 0
                  }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>Address</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Dr. Babasaheb Ambedkar Rd, opposite to City Center Mall, beside Lakshika Mangal Karyalay, DR BR, Forest Colony, Parijat Nagar, Nashik, Maharashtra 422002
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)',
                    flexShrink: 0
                  }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>Phone Numbers</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <a href="tel:09130303308" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        091303 03308
                      </a> (Direct Line)
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--accent-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)',
                    flexShrink: 0
                  }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>Opening Hours</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      Open Daily: <strong>11:00 AM – 12:00 AM</strong> (Midnight)
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Maps Link CTA */}
              <div>
                <a
                  href="https://www.google.com/maps/place/THE+TEROTALE/@19.9913583,73.7607674,17z"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', gap: '8px' }}
                >
                  View on Google Maps
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Embedded Google Map Frame */}
            <div 
              style={{ 
                borderRadius: '24px', 
                overflow: 'hidden', 
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--card-shadow)',
                height: '380px',
                position: 'relative'
              }}
            >
              <iframe
                title="The Terotale Location Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links & Bio */}
      <div 
        style={{ 
          borderTop: '1px solid var(--border-color)', 
          padding: '40px 0 30px 0', 
          backgroundColor: 'var(--bg-primary)' 
        }}
      >
        <div className="container">
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '24px',
              paddingBottom: '30px',
              borderBottom: '1px solid var(--border-color)'
            }}
          >
            {/* Brand Logo Info */}
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }} className="text-gradient-gold">
                THE TEROTALE
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '2px', margin: '4px 0 8px 0' }}>
                दि टेरोटेल • PURE VEG
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                Tasty food, good quantity, minimal design, and a soothing dine-in ambience.
              </p>
            </div>

            {/* Footer Navigation */}
            <div>
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '20px 30px', listStyle: 'none', padding: 0, margin: 0 }}>
                {['home', 'highlights', 'menu', 'gallery', 'reviews'].map(id => (
                  <li key={id}>
                    <button
                      onClick={() => handleNavClick(id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
                      onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
                    >
                      {id.charAt(0).toUpperCase() + id.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social media icons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)',
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)',
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Copyright & Credits */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '12px',
              paddingTop: '20px',
              fontSize: '14px',
              color: 'var(--text-secondary)'
            }}
          >
            <span>
              &copy; {new Date().getFullYear()} The Terotale. All rights reserved.
            </span>
            
            {/* ByTech Software Credits (with portfolio links) */}
            <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
              Build with ♥ by{' '}
              <a 
                href="https://codewithomkar.vercel.app" 
                target="_blank" 
                rel="noreferrer"
                style={{ color: 'var(--accent-gold)', fontWeight: 800, textDecoration: 'underline' }}
              >
                Omkar
              </a>
              {' '}and{' '}
              <a 
                href="https://bytechsoftware.vercel.app" 
                target="_blank" 
                rel="noreferrer"
                style={{ color: 'var(--accent-coral)', fontWeight: 800, textDecoration: 'underline' }}
              >
                ByTech Software
              </a>
            </span>
          </div>

        </div>
      </div>

    </footer>
  );
}
