import React from 'react';
import { Star, MessageSquare, Quote, CheckCircle } from 'lucide-react';

export default function Reviews() {
  const reviewsList = [
    {
      name: "Akanksha Negi",
      type: "Local Guide",
      stats: "18 reviews • 22 photos",
      rating: 5,
      date: "2 weeks ago",
      text: "Let me tell you, we stayed in Nashik last month for three days, and visited 'The Terotale' every single night for dinner. We were hooked to that place, and each time we ordered new things - we're amazed by the quality of those savoury dishes!",
      initial: "A",
      bgColor: "#1E3A8A"
    },
    {
      name: "Sanjay Pawar",
      type: "Local Guide",
      stats: "177 reviews • 498 photos",
      rating: 5,
      date: "8 months ago",
      text: "Good option for an authentic vegetarian fine dine restaurant in Nashik opp City Centre Mall. Two floors. Ground floor is cozy and first floor is partially covered. Menu is versatile and gives us good choice. Weekends you may have to wait for a table, but it's worth it.",
      initial: "S",
      bgColor: "#065F46"
    },
    {
      name: "vinit S",
      type: "Local Guide",
      stats: "245 reviews • 1,202 photos",
      rating: 5,
      date: "6 months ago",
      text: "Nice place for a brunch, when you need something light over a cup of coffee and sandwiches. Nice view outside area to chat with your family and friends. No rush of finishing the food and plenty of parking. Some really nice ambience and seating area of your choice.",
      initial: "V",
      bgColor: "#9D174D"
    }
  ];

  return (
    <section id="reviews" className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '50px', gap: '12px' }}>
          <span className="badge-pureveg">
            TESTIMONIALS
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800 }}>
            What Our Guests Say
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '15px' }}>
            With over 6,250 reviews on Google Maps and a 4.7-star rating, here is the honest feedback of visitors who loved our food and minimal ambience.
          </p>
        </div>

        <div className="grid-3" style={{ alignItems: 'stretch' }}>
          
          {/* Aggregated Score Card */}
          <div 
            className="glass-card"
            style={{
              padding: '36px 30px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)',
              gridColumn: 'span 1'
            }}
          >
            <h3 style={{ fontSize: '64px', fontWeight: 800, margin: 0, lineHeight: 1 }}>
              4.7
            </h3>
            
            {/* Stars */}
            <div style={{ display: 'flex', gap: '4px', margin: '14px 0 8px 0', color: '#FBBF24' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={22} fill="currentColor" stroke="none" />
              ))}
            </div>
            
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Based on 6,250+ reviews
            </span>

            <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--border-color)', margin: '24px 0' }} />

            {/* Micro rating bars */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { stars: 5, pct: '88%' },
                { stars: 4, pct: '8%' },
                { stars: 3, pct: '2%' },
                { stars: 2, pct: '1%' },
                { stars: 1, pct: '1%' }
              ].map(bar => (
                <div key={bar.stars} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <span style={{ width: '10px', fontWeight: 600 }}>{bar.stars}</span>
                  <div style={{ flexGrow: 1, height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: bar.pct, height: '100%', backgroundColor: 'var(--accent-gold)', borderRadius: '3px' }} />
                  </div>
                  <span style={{ width: '28px', color: 'var(--text-secondary)', textAlign: 'right' }}>{bar.pct}</span>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-green)',
              fontSize: '12px',
              fontWeight: 700,
              marginTop: '24px'
            }}>
              <CheckCircle size={14} />
              100% Certified Google Business
            </div>
          </div>

          {/* Testimonial Cards */}
          {reviewsList.map((review, idx) => (
            <div 
              key={idx}
              className="glass-card card-hover"
              style={{
                padding: '32px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                backgroundColor: 'var(--bg-secondary)',
                position: 'relative'
              }}
            >
              <Quote 
                size={40} 
                style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  right: '20px', 
                  opacity: 0.05, 
                  color: 'var(--text-primary)' 
                }} 
              />
              
              {/* Header profile details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  backgroundColor: review.bgColor,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '18px'
                }}>
                  {review.initial}
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                    {review.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent-coral)', fontWeight: 700 }}>{review.type}</span>
                    <span>•</span>
                    <span>{review.stats}</span>
                  </div>
                </div>
              </div>

              {/* Review Stars & Date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '2px', color: '#FBBF24' }}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {review.date}
                </span>
              </div>

              {/* Review Text */}
              <p style={{ 
                fontSize: '14px', 
                color: 'var(--text-secondary)', 
                lineHeight: 1.6, 
                flexGrow: 1, 
                margin: 0,
                fontStyle: 'italic'
              }}>
                "{review.text}"
              </p>

            </div>
          ))}
          
        </div>

      </div>
    </section>
  );
}
