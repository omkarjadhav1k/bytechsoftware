import React, { useState, useEffect } from 'react';
import { Star, FileText, ArrowRight, Share2 } from 'lucide-react';
import photos from '../data/photos.json';
import ScrollReveal from './ScrollReveal';
import Tilt from './Tilt';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [customMappings, setCustomMappings] = useState({});

  useEffect(() => {
    // Load custom mappings from local storage
    const saved = localStorage.getItem('custom_dish_mappings');
    if (saved) {
      setCustomMappings(JSON.parse(saved));
    }

    // Listen for custom photo mapper updates in real-time
    const handleUpdate = (e) => {
      setCustomMappings(e.detail || {});
    };
    window.addEventListener('dish-mappings-updated', handleUpdate);
    return () => window.removeEventListener('dish-mappings-updated', handleUpdate);
  }, []);

  // Find actual image filenames from the JSON index that match specific patterns
  const getImageByPattern = (pattern, fallbackIdx) => {
    const match = photos.find(p => p.includes(pattern));
    return match ? `/theterotale/photo/${match}` : `/theterotale/photo/${photos[fallbackIdx % photos.length]}`;
  };

  const menuItems = [
    {
      id: 1,
      name: "Rumali Khakhra",
      category: "starters",
      price: 240,
      rating: 4.8,
      tag: "Best Seller",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
      description: "Paper-thin, giant crispy roti seasoned with signature Marwadi spices, butter, and chopped coriander. Perfect as a group starter."
    },
    {
      id: 2,
      name: "Mexican Cheese Cigar",
      category: "starters",
      price: 280,
      rating: 4.9,
      tag: "Chef's Special",
      image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80",
      description: "Crispy fried rolls stuffed with molten mozzarella, sweet corn, jalapenos, and Mexican herbs. Served with spicy salsa dip."
    },
    {
      id: 3,
      name: "Chocolate Sizzling Brownie",
      category: "desserts",
      price: 260,
      rating: 4.9,
      tag: "Legendary",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
      description: "Hot fudge brownie served on a sizzling iron plate, topped with a scoop of vanilla ice cream and premium dark chocolate sauce."
    },
    {
      id: 4,
      name: "Marwadi Biryani",
      category: "mains",
      price: 340,
      rating: 4.7,
      tag: "Popular",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
      description: "Fragrant basmati rice slow-cooked in handi with saffron, fresh seasonal vegetables, paneer cubes, and traditional Rajasthani spices."
    },
    {
      id: 5,
      name: "Lucknowi Kofta",
      category: "mains",
      price: 320,
      rating: 4.8,
      tag: "Best Seller",
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80",
      description: "Soft paneer and potato dumplings simmered in an ultra-rich, creamy onion-tomato gravy flavored with cardamom and cashews."
    },
    {
      id: 6,
      name: "Veg Nariyali Korma",
      category: "mains",
      price: 310,
      rating: 4.9,
      tag: "Chef's Special",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
      description: "A soothing, aromatic coastal curry loaded with garden vegetables cooked in a rich, velvety coconut milk and cashew base."
    },
    {
      id: 7,
      name: "Mojito Extravaganza",
      category: "desserts",
      price: 180,
      rating: 4.8,
      tag: "Favorite",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
      description: "A refreshing muddle of fresh mint leaves, lime wedges, pure cane sugar, and sparkling water. The absolute favorite drink here."
    },
    {
      id: 8,
      name: "Chinese Platter",
      category: "chinese-mexican",
      price: 380,
      rating: 4.6,
      tag: "Huge Portion",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
      description: "An ultimate combo of Veg Fried Rice, Hakka Noodles, Manchurian gravy, Paneer Chilli, and crispy Spring Rolls."
    },
    {
      id: 9,
      name: "Wonton Soup",
      category: "chinese-mexican",
      price: 190,
      rating: 4.7,
      tag: "Healthy",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
      description: "Clear vegetable broth packed with fresh scallions, bok choy, and hand-folded vegetable wontons steamed to perfection."
    },
    {
      id: 10,
      name: "Classic Masala Dosa",
      category: "starters",
      price: 160,
      rating: 4.7,
      tag: "Classic",
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
      description: "Crispy golden rice crepe filled with tempered potato mash. Served with fresh coconut chutney, tomato chutney, and hot sambar."
    },
    {
      id: 11,
      name: "Butter Roti & Naan Basket",
      category: "mains",
      price: 120,
      rating: 4.5,
      tag: "Essential",
      image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80",
      description: "A warm assortment of fresh clay-oven baked rotis and naans, generously brushed with premium butter."
    },
    {
      id: 12,
      name: "Paneer Tikka Sizzler",
      category: "mains",
      price: 390,
      rating: 4.9,
      tag: "Hot & Popular",
      image: "https://images.unsplash.com/photo-1559487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80",
      description: "Tandoori grilled paneer tikkas, bell peppers, and onions served on a bed of herb rice with buttered vegetables and hot pepper sauce."
    }
  ];

  const categories = [
    { id: 'all', label: 'All Dishes' },
    { id: 'starters', label: 'Starters' },
    { id: 'mains', label: 'Main Course' },
    { id: 'chinese-mexican', label: 'Chinese & Mexican' },
    { id: 'desserts', label: 'Drinks & Desserts' },
  ];

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const handleShare = (dishName) => {
    if (navigator.share) {
      navigator.share({
        title: `The Terotale - ${dishName}`,
        text: `Check out this amazing dish at The Terotale restaurant!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(`Recommendation shared: Let's try ${dishName} at The Terotale!`);
    }
  };

  return (
    <section id="menu" className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '40px', gap: '12px' }}>
          <span className="badge-pureveg">
            OUR FLAVORS
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800 }}>
            Our Regular Menu Highlights
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '15px' }}>
            A versatile pure-vegetarian menu featuring local and global delicacies, crafted with high-quality ingredients by professional chefs.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: '12px', 
            marginBottom: '50px' 
          }}
        >
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="btn"
              style={{
                backgroundColor: activeCategory === cat.id ? 'var(--accent-coral)' : 'var(--bg-secondary)',
                color: activeCategory === cat.id ? '#FFFFFF' : 'var(--text-secondary)',
                border: activeCategory === cat.id ? 'none' : '1px solid var(--border-color)',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid-3">
          {filteredItems.map((item, idx) => {
            const itemImage = customMappings[item.name] || item.image;
            return (
              <ScrollReveal key={item.id} delay={(idx % 3) * 100}>
                <Tilt>
                  <div 
                    className="glass-card card-hover"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      textAlign: 'left',
                      backgroundColor: 'var(--bg-secondary)',
                      position: 'relative',
                      overflow: 'hidden',
                      height: '100%'
                    }}
                  >
                    
                    {/* Circular Food Image Frame */}
                    <div 
                      style={{
                        height: '200px',
                        width: '100%',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        position: 'relative',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <img 
                        src={itemImage} 
                        alt={item.name} 
                        className="img-cover"
                      />
                      
                      {/* Floating Price Tag */}
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        padding: '6px 14px',
                        borderRadius: '50px',
                        fontWeight: 800,
                        fontSize: '15px',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                      }}>
                        ₹{item.price}
                      </div>

                      {/* Rating Badge on Image */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: '#FFF',
                        padding: '4px 10px',
                        borderRadius: '50px',
                        fontWeight: 700,
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)'
                      }}>
                        <Star size={11} fill="#FBBF24" stroke="none" />
                        {item.rating}
                      </div>

                      {/* Left Tag */}
                      {item.tag && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: 'var(--accent-green)',
                          color: '#FFF',
                          padding: '4px 10px',
                          borderRadius: '50px',
                          fontWeight: 700,
                          fontSize: '11px',
                        }}>
                          {item.tag}
                        </div>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {item.description}
                      </p>
                    </div>

                    {/* Card Footer Actions */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-color)'
                    }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-gold)' }}>
                        PURE VEGETARIAN
                      </span>
                      
                      <button
                        onClick={() => handleShare(item.name)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                        className="share-btn"
                      >
                        <Share2 size={14} />
                        Recommend
                      </button>
                    </div>

                  </div>
                </Tilt>
              </ScrollReveal>
            );
          })}
        </div>

        {/* View Full Menu Callout */}
        <div 
          className="glass-card"
          style={{
            marginTop: '50px',
            padding: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            backgroundColor: 'var(--bg-secondary)'
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
              Want to see our full culinary selection?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Download our complete physical menu card containing all soups, beverages, roti varieties, and special sizzlers.
            </p>
          </div>
          
          <a
            href="https://drive.google.com" // Placeholder for drive.google.com as provided in Maps data
            target="_blank"
            rel="noreferrer"
            className="btn btn-gold"
          >
            <FileText size={18} />
            View Full Digital Menu
            <ArrowRight size={16} />
          </a>
        </div>

      </div>
    </section>
  );
}
