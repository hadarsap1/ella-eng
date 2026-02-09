import { motion } from 'framer-motion';
import type { Level } from '../../../types/game';
import { GlowText } from '../../ui/GlowText';

interface Props {
  level: Level;
}

export function LevelUpModal({ level }: Props) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', damping: 12 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-space-mid border border-neon-gold/30 rounded-3xl p-8 text-center box-glow-gold max-w-xs"
      >
        <div className="text-6xl mb-4">{level.icon}</div>
        <h3 className="text-2xl font-bold font-hebrew mb-2">
          <GlowText color="gold">עלית רמה!</GlowText>
        </h3>
        <p className="text-lg font-hebrew text-white/80 mb-1">רמה {level.level}</p>
        <p className="text-xl font-bold font-hebrew text-neon-gold">{level.title}</p>
      </motion.div>
    </motion.div>
  );
}
