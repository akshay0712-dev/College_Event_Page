import React, { useMemo } from "react";

const BackgroundParticles = ({ count = 60 }) => {
  // Generate particles only once
  const particles = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    count = isMobile ? 40 : 60 ;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 2, // 2px - 8px
      left: Math.random() * 100, // random horizontal position
      duration: Math.random() * 20 + 10, // animation speed
      delay: Math.random() * 20,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-800] overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            opacity: p.opacity,
            animation: `float ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundParticles;
