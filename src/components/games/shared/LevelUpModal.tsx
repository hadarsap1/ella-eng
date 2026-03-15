import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Level } from '../../../types/game';
import { GlowText } from '../../ui/GlowText';

interface Props {
  level: Level;
}

export function LevelUpModal({ level }: Props) {
  const [visible, setVisible] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (visible && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setVisible(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="עלית רמה!"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, delay: 0.2 }}
        onClick={e => e.stopPropagation()}
        className="ella-card-raised rounded-[2rem] p-10 text-center max-w-xs"
        style={{ borderColor: 'rgba(251,191,36,0.3)', boxShadow: '0 0 80px rgba(251,191,36,0.12), 0 0 160px rgba(251,191,36,0.04)' }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-7xl mb-5"
        >
          {level.icon}
        </motion.div>
        <h3 className="text-3xl font-bold font-hebrew mb-2">
          <GlowText color="gold">עלית רמה!</GlowText>
        </h3>
        <p className="text-lg font-hebrew text-white/70 mb-1">רמה {level.level}</p>
        <p className="text-2xl font-bold font-hebrew text-neon-gold mb-5">{level.title}</p>
        <button
          ref={buttonRef}
          onClick={() => setVisible(false)}
          className="ella-btn ella-btn-gold px-8 py-3 font-hebrew font-bold text-lg cursor-pointer"
        >
          🚀 המשך!
        </button>
      </motion.div>
    </motion.div>
  );
}
