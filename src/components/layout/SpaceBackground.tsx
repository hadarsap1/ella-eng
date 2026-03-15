import { useMemo } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

export function SpaceBackground() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.15 ? 2.5 + Math.random() * 1.5 : 1 + Math.random() * 1,
      opacity: 0.15 + Math.random() * 0.5,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 4,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" style={{ background: '#0B1026' }}>
      {/* Gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(91,155,245,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 85%, rgba(167,139,250,0.05) 0%, transparent 50%),
            radial-gradient(ellipse 70% 40% at 50% 50%, rgba(34,211,238,0.03) 0%, transparent 50%),
            linear-gradient(175deg, #0D1330 0%, #0B1026 35%, #10153A 65%, #0B1026 100%)
          `,
        }}
      />

      {/* Soft aurora */}
      <div
        className="absolute inset-0 animate-pulse-soft"
        style={{
          background: `
            radial-gradient(ellipse 120% 20% at 30% 15%, rgba(91,155,245,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 100% 15% at 70% 80%, rgba(167,139,250,0.03) 0%, transparent 70%)
          `,
          animationDuration: '8s',
        }}
      />

      {/* Stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: star.size > 2
              ? 'radial-gradient(circle, rgba(200,220,255,0.9), rgba(150,180,255,0.3))'
              : `rgba(255,255,255,${star.opacity})`,
            boxShadow: star.size > 2 ? `0 0 ${star.size * 3}px rgba(150,180,255,0.3)` : 'none',
            animation: `star-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {/* Decorative orbs */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          top: '-5%', right: '-5%',
          background: 'radial-gradient(circle, rgba(91,155,245,0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{
          bottom: '10%', left: '-3%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(8,13,31,0.5) 100%)',
        }}
      />
    </div>
  );
}
