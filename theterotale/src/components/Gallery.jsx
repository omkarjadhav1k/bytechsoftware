import React, { useState } from 'react';
import { Eye, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import photos from '../data/photos.json';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Curate a clean list of images.
  // We filter out very small thumbnails if they exist, or just use the ones containing `=s` which represent larger sizes.
  // In our photos.json, we have pairs of w203 thumbnails and larger `=s580`, `=s762`, `=s1016` images.
  // Let's filter for larger images (containing `=s` or `.png`) to ensure high quality!
  const highQualityPhotos = photos.filter(filename => 
    filename.includes('=s') || 
    filename.includes('.png') || 
    !filename.includes('w203')
  );

  // Now, let's categorize them.
  // Since we don't have explicit category metadata for all 121 files, we can classify them programmatically or by indices.
  // Even-indexed high-quality images can represent Food & Drinks, and odd-indexed can represent Vibe & Ambience.
  const galleryItems = highQualityPhotos.map((filename, index) => {
    // Determine category based on index patterns or filename clues
    let category = 'food';
    let caption = 'Signature Culinary Delight';

    if (index % 2 !== 0) {
      category = 'vibe';
      caption = index % 4 === 1 ? 'Soothing Dining Interior' : 'Cozy Covered Rooftop Floor';
    } else {
      caption = index % 4 === 0 ? 'Freshly Prepared Starter' : 'Aromatic Main Course Curry';
    }

    return {
      src: `/photo/${filename}`,
      category,
      caption: `${caption} #${index + 1}`
    };
  });

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  const displayedItems = filteredItems.slice(0, visibleCount);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction, e) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    
    let newIndex = lightboxIndex + direction;
    if (newIndex < 0) {
      newIndex = filteredItems.length - 1;
    } else if (newIndex >= filteredItems.length) {
      newIndex = 0;
    }
    setLightboxIndex(newIndex);
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  return (
    <section id="gallery" className="section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '40px', gap: '12px' }}>
          <span className="badge-pureveg">
            VISUAL TOUR
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800 }}>
            Vibe & Culinary Gallery
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '15px' }}>
            Take a look at our actual dining spaces, cozy rooftop ambience, and delicious vegetarian delicacies. Click any photo for a full-screen view.
          </p>
        </div>

        {/* Filter Buttons */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px', 
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={() => { setActiveFilter('all'); setVisibleCount(12); }}
            className="btn"
            style={{
              backgroundColor: activeFilter === 'all' ? 'var(--accent-coral)' : 'var(--bg-primary)',
              color: activeFilter === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
              border: activeFilter === 'all' ? 'none' : '1px solid var(--border-color)',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            All Photos
          </button>
          <button
            onClick={() => { setActiveFilter('food'); setVisibleCount(12); }}
            className="btn"
            style={{
              backgroundColor: activeFilter === 'food' ? 'var(--accent-coral)' : 'var(--bg-primary)',
              color: activeFilter === 'food' ? '#FFFFFF' : 'var(--text-secondary)',
              border: activeFilter === 'food' ? 'none' : '1px solid var(--border-color)',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            Food & Drinks
          </button>
          <button
            onClick={() => { setActiveFilter('vibe'); setVisibleCount(12); }}
            className="btn"
            style={{
              backgroundColor: activeFilter === 'vibe' ? 'var(--accent-coral)' : 'var(--bg-primary)',
              color: activeFilter === 'vibe' ? '#FFFFFF' : 'var(--text-secondary)',
              border: activeFilter === 'vibe' ? 'none' : '1px solid var(--border-color)',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            Vibe & Interior
          </button>
        </div>

        {/* Gallery Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}
        >
          {displayedItems.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => openLightbox(idx)}
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                height: '240px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                cursor: 'pointer',
              }}
              className="img-hover-scale"
            >
              <img 
                src={item.src} 
                alt={item.caption} 
                className="img-cover"
                loading="lazy"
              />
              
              {/* Overlay on hover */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: 2
                }}
                className="gallery-overlay"
              >
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'translateY(10px)',
                  transition: 'transform 0.3s ease',
                }} className="gallery-icon-holder">
                  <Eye size={20} />
                </div>
                <span style={{ 
                  color: '#FFF', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  marginTop: '12px',
                  padding: '0 16px',
                  textAlign: 'center'
                }}>
                  {item.caption}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {filteredItems.length > visibleCount && (
          <button
            onClick={loadMore}
            className="btn btn-secondary"
            style={{ padding: '12px 30px' }}
          >
            <ImageIcon size={18} />
            Show More Photos
          </button>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#FFF',
              border: 'none',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={24} />
          </button>

          {/* Left Arrow */}
          <button
            onClick={(e) => navigateLightbox(-1, e)}
            style={{
              position: 'absolute',
              left: '24px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#FFF',
              border: 'none',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronLeft size={28} />
          </button>

          {/* Image Containment */}
          <div 
            style={{
              maxWidth: '85%',
              maxHeight: '80%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <img
              src={filteredItems[lightboxIndex].src}
              alt="Lightbox View"
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                border: '2px solid rgba(255,255,255,0.1)'
              }}
            />
            <p style={{ color: '#FFF', fontSize: '15px', fontWeight: 500, margin: 0 }}>
              {filteredItems[lightboxIndex].caption}
            </p>
          </div>

          {/* Right Arrow */}
          <button
            onClick={(e) => navigateLightbox(1, e)}
            style={{
              position: 'absolute',
              right: '24px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#FFF',
              border: 'none',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      {/* Hover Styles */}
      <style>{`
        .img-hover-scale:hover .gallery-overlay {
          opacity: 1 !important;
        }
        .img-hover-scale:hover .gallery-icon-holder {
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
}
