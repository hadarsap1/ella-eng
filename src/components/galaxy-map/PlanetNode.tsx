import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import type { GameInfo } from '../../types/game';

interface Props {
  game: GameInfo;
  index: number;
  locked: boolean;
  wordCount: number;
  onClick: () => void;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function PlanetNode({ game, index, locked, wordCount, onClick }: Props) {
  const color = game.color;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', damping: 12 }}
      whileHover={locked ? {} : { scale: 1.04, y: -8 }}
      whileTap={locked ? {} : { scale: 0.96 }}
      onClick={onClick}
      disabled={locked}
      className="relative flex flex-col items-center gap-4 p-6 sm:p-8 lg:p-10 rounded-3xl cursor-pointer group"
      style={locked ? {
        background: 'rgba(20, 26, 55, 0.4)',
        border: '1.5px solid rgba(255,255,255,0.03)',
        opacity: 0.35,
        cursor: 'not-allowed',
      } : {
        background: `linear-gradient(165deg, ${hexToRgba(color, 0.12)} 0%, ${hexToRgba(color, 0.04)} 100%)`,
        border: `1.5px solid ${hexToRgba(color, 0.2)}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${hexToRgba(color, 0.05)}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Hover glow */}
      {!locked && (
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `0 0 50px ${hexToRgba(color, 0.15)}, inset 0 0 40px ${hexToRgba(color, 0.06)}`,
            border: `1.5px solid ${hexToRgba(color, 0.35)}`,
            borderRadius: '24px',
          }}
        />
      )}

      {/* Icon — big and bouncy */}
      <motion.div
        animate={locked ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
        className="text-6xl sm:text-7xl lg:text-8xl relative"
        style={{ filter: locked ? 'grayscale(1)' : `drop-shadow(0 6px 16px ${hexToRgba(color, 0.25)})` }}
      >
        {locked ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-white/15" />
          </div>
        ) : game.icon}
      </motion.div>

      {/* Name */}
      <div className="text-center relative z-10">
        <div
          className="font-english font-bold text-base sm:text-lg lg:text-xl leading-tight"
          style={{ color: locked ? 'rgba(255,255,255,0.2)' : color }}
        >
          {game.name}
        </div>
        <div className="text-xs sm:text-sm text-white/60 font-hebrew mt-1 font-medium">{game.nameHe}</div>
        {!locked && <div className="text-xs text-white/40 font-hebrew mt-0.5">{game.description}</div>}
      </div>

      {/* Badge */}
      <div
        className="text-xs sm:text-sm font-hebrew font-bold px-4 py-2 rounded-full"
        style={{
          background: locked ? 'rgba(255,255,255,0.03)' : hexToRgba(color, 0.1),
          color: locked ? 'rgba(255,255,255,0.15)' : color,
          border: locked ? 'none' : `1px solid ${hexToRgba(color, 0.15)}`,
        }}
      >
        {locked ? `🔒 צריך ${game.minWords} מילים` : `${wordCount} מילים`}
      </div>
    </motion.button>
  );
}
