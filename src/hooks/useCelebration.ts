import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export function useCelebration() {
  const celebrate = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00d4ff', '#b44dff', '#00ff88', '#ffd700', '#ff4d8d'],
    });
  }, []);

  const bigCelebrate = useCallback(() => {
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00d4ff', '#b44dff', '#00ff88', '#ffd700'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00d4ff', '#b44dff', '#00ff88', '#ffd700'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return { celebrate, bigCelebrate };
}
