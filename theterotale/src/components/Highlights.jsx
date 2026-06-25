import React from 'react';
import { Utensils, Compass, Car, Heart, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function Highlights() {
  const highlightItems = [
    {
      icon: <Utensils size={24} />,
      title: "Authentic Pure Veg",
      description: "Delivering a versatile and pure vegetarian menu, featuring legendary North Indian, Chinese, Mexican, and local Maharashtrian dishes.",
      color: "var(--accent-green)"
    },
    {
      icon: <Compass size={24} />,
      title: "Rooftop & Indoor Seating",
      description: "Enjoy your dining in our elegant, minimal ground floor or on the cozy, partially covered first-floor terrace area with beautiful breezes.",
      color: "var(--accent-gold)"
    },
    {
      icon: <Car size={24} />,
      title: "Plenty of Parking",
      description: "No stress about parking. We provide ample, dedicated parking space right next to the restaurant for your convenience.",
      color: "var(--accent-coral)"
    },
    {
      icon: <Heart size={24} />,
      title: "LGBTQ+ Friendly",
      description: "A highly inclusive, warm, and friendly environment with polite staff dedicated to giving you an exceptional experience.",
      color: "#EC4899"
    },
    {
      icon: <Sparkles size={24} />,
      title: "Minimal Design & Ambience",
      description: "Praised by thousands of visitors for its simple, modern aesthetics that create a soothing, calm fine-dining atmosphere.",
      color: "var(--accent-gold)"
    },
    {
      icon: <ShieldAlert size={24} />,
      title: "Safe & Contactless",
      description: "Offering premium Dine-in services alongside contactless Takeaway and secure, hygiene-tested delivery straight to your doorstep.",
      color: "var(--accent-green)"
    }
  ];

  return (
    <section 
      id="highlights" 
      className="section" 
      style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}
    >
      <div className="container">
        
        {/* Section Header */}
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span className="badge-pureveg" style={{ width: 'fit-content' }}>
              WHY VISIT US
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800 }}>
              Experience Fine Dining at Its Best
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '15px' }}>
              We combine delectable tastes, soothing aesthetics, and impeccable services to make every meal memorable. Here is what makes us special.
            </p>
          </div>
        </ScrollReveal>

        {/* Features Grid */}
        <div className="grid-3">
          {highlightItems.map((item, idx) => (
            <ScrollReveal key={idx} delay={(idx % 3) * 100}>
              <div 
                className="glass-card card-hover"
                style={{
                  padding: '32px',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  backgroundColor: 'var(--bg-primary)',
                  height: '100%'
                }}
              >
                {/* Icon Container */}
                <div 
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                  }}
                >
                  {item.icon}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '19px', fontWeight: 700, margin: 0 }}>
                  {item.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, flexGrow: 1, margin: 0 }}>
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
