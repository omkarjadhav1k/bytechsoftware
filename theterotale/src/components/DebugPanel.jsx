import React, { useState, useEffect } from 'react';
import { Settings, X, Check, Copy } from 'lucide-react';
import photos from '../data/photos.json';

export default function DebugPanel() {
  const [showPanel, setShowPanel] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDishId, setActiveDishId] = useState(null);
  const [customMappings, setCustomMappings] = useState({});
  const [copied, setCopied] = useState(false);

  // The default list of dishes to map
  const dishes = [
    { id: 1, name: "Rumali Khakhra" },
    { id: 2, name: "Mexican Cheese Cigar" },
    { id: 3, name: "Chocolate Sizzling Brownie" },
    { id: 4, name: "Marwadi Biryani" },
    { id: 5, name: "Lucknowi Kofta" },
    { id: 6, name: "Veg Nariyali Korma" },
    { id: 7, name: "Mojito Extravaganza" },
    { id: 8, name: "Chinese Platter" },
    { id: 9, name: "Wonton Soup" },
    { id: 10, name: "Classic Masala Dosa" },
    { id: 11, name: "Butter Roti & Naan Basket" },
    { id: 12, name: "Paneer Tikka Sizzler" },
  ];

  useEffect(() => {
    // Only show if debug=true is in the query string
    if (window.location.search.includes('debug=true')) {
      setShowPanel(true);
    }

    // Load initial mappings from local storage
    const saved = localStorage.getItem('custom_dish_mappings');
    if (saved) {
      setCustomMappings(JSON.parse(saved));
    }
  }, []);

  if (!showPanel) return null;

  const handleMapPhoto = (dishName, filename) => {
    const updated = {
      ...customMappings,
      [dishName]: `/photo/${filename}`
    };
    setCustomMappings(updated);
    localStorage.setItem('custom_dish_mappings', JSON.stringify(updated));
    
    // Dispatch a custom event to notify the Menu component in real-time
    window.dispatchEvent(new CustomEvent('dish-mappings-updated', { detail: updated }));
    setActiveDishId(null);
  };

  const clearAllMappings = () => {
    if (window.confirm("Are you sure you want to reset all image mappings back to defaults?")) {
      setCustomMappings({});
      localStorage.removeItem('custom_dish_mappings');
      window.dispatchEvent(new CustomEvent('dish-mappings-updated', { detail: {} }));
    }
  };

  const copyMappingJson = () => {
    // Convert mapping to a clean snippet the developer can paste
    const snippet = JSON.stringify(customMappings, null, 2);
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter out tiny thumbnails in the selector to make it easy to see
  const highResPhotos = photos.filter(p => !p.includes('w203'));

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: 'var(--accent-coral)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(230, 95, 43, 0.4)',
            fontSize: '13px',
          }}
        >
          <Settings size={16} className="animate-spin-slow" />
          Photo Mapper Panel
        </button>
      )}

      {/* Main Drawer Overlay */}
      {isOpen && (
        <div 
          className="glass-card"
          style={{
            width: '450px',
            maxWidth: '90vw',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-secondary)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{ 
            padding: '18px 24px', 
            borderBottom: '1px solid var(--border-color)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: 'var(--bg-primary)'
          }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Photo Mapper Tool</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Map the actual photos from your folder to dishes</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Dish List Selection */}
          {activeDishId === null ? (
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
              {dishes.map(dish => {
                const mappedSrc = customMappings[dish.name];
                return (
                  <div 
                    key={dish.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-primary)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {mappedSrc ? (
                        <img 
                          src={mappedSrc} 
                          alt="" 
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                          Default
                        </div>
                      )}
                      <span style={{ fontWeight: 700, fontSize: '13px', textAlign: 'left' }}>{dish.name}</span>
                    </div>
                    <button
                      onClick={() => setActiveDishId(dish.id)}
                      className="btn"
                      style={{ padding: '6px 12px', fontSize: '11px', backgroundColor: 'var(--accent-gold)' }}
                    >
                      Change Photo
                    </button>
                  </div>
                );
              })}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  onClick={copyMappingJson}
                  className="btn btn-primary"
                  style={{ flexGrow: 1, padding: '10px', fontSize: '11px' }}
                >
                  <Copy size={14} />
                  {copied ? "Copied!" : "Copy JSON Config"}
                </button>
                <button
                  onClick={clearAllMappings}
                  className="btn btn-secondary"
                  style={{ padding: '10px', fontSize: '11px' }}
                >
                  Reset All
                </button>
              </div>
            </div>
          ) : (
            // Photo Selection Panel
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ 
                padding: '12px 20px', 
                borderBottom: '1px solid var(--border-color)', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>
                  Select photo for: <strong>{dishes.find(d => d.id === activeDishId)?.name}</strong>
                </span>
                <button 
                  onClick={() => setActiveDishId(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--accent-coral)' }}
                >
                  Back
                </button>
              </div>

              {/* Photo Selector Grid */}
              <div style={{ padding: '16px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', flexGrow: 1 }}>
                {highResPhotos.map((photo, index) => {
                  const dishName = dishes.find(d => d.id === activeDishId)?.name;
                  const isCurrent = customMappings[dishName] === `/photo/${photo}`;
                  
                  return (
                    <div 
                      key={index}
                      onClick={() => handleMapPhoto(dishName, photo)}
                      style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        height: '90px',
                        border: isCurrent ? '3px solid var(--accent-coral)' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                      }}
                    >
                      <img 
                        src={`/photo/${photo}`} 
                        alt="" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: '#FFF',
                        fontSize: '9px',
                        padding: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {photo.slice(0, 10)}...
                      </div>
                      {isCurrent && (
                        <div style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          backgroundColor: 'var(--accent-coral)',
                          color: '#FFF',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
