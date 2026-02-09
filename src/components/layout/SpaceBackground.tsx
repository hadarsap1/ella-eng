import { useMemo } from 'react';

export function SpaceBackground() {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    })), []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0 bg-gradient-to-b from-space-dark via-space-mid to-space-dark" />
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
      <div
        className="absolute w-32 h-32 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #b44dff 0%, transparent 70%)',
          top: '10%',
          right: '15%',
        }}
      />
      <div
        className="absolute w-48 h-48 rounded-full opacity-8"
        style={{
          background: 'radial-gradient(circle, #00d4ff 0%, transparent 70%)',
          bottom: '20%',
          left: '10%',
        }}
      />
    </div>
  );
}
