import React, { useState, useRef } from 'react';

export default function Tilt({ children, maxTilt = 10 }) {
  const [tiltStyle, setTiltStyle] = useState({});
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const card = ref.current;
    const box = card.getBoundingClientRect();
    
    // Get cursor X and Y coordinates relative to card center
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Calculate tilt angles (divide by half-width/height to scale between -1 and 1)
    const tiltX = -(y / (box.height / 2)) * maxTilt;
    const tiltY = (x / (box.width / 2)) * maxTilt;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease',
        ...tiltStyle,
      }}
    >
      {children}
    </div>
  );
}
