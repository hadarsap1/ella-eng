import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export function useCelebration() {
  const celebrate = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#5B9BF5', '#A78BFA', '#34D399', '#FBBF24', '#F472B6'],
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
        colors: ['#5B9BF5', '#A78BFA', '#34D399', '#FBBF24'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#5B9BF5', '#A78BFA', '#34D399', '#FBBF24'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return { celebrate, bigCelebrate };
}
