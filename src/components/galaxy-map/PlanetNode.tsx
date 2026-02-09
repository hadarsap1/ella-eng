import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import type { GameInfo } from '../../types/game';
import { cn } from '../../lib/cn';

interface Props {
  game: GameInfo;
  index: number;
  locked: boolean;
  wordCount: number;
  onClick: () => void;
}

export function PlanetNode({ game, index, locked, wordCount, onClick }: Props) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      whileHover={locked ? {} : { scale: 1.05 }}
      whileTap={locked ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={locked}
      className={cn(
        'relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all cursor-pointer',
        locked
          ? 'bg-white/5 border-white/5 opacity-40 cursor-not-allowed'
          : 'bg-space-light/60 hover:bg-space-light/80'
      )}
      style={{
        borderColor: locked ? undefined : `${game.color}30`,
        boxShadow: locked ? undefined : `0 0 20px ${game.color}15`,
      }}
    >
      <div
        className="text-4xl animate-float"
        style={{ animationDelay: `${index * 0.5}s` }}
      >
        {locked ? <Lock className="w-8 h-8 text-white/30" /> : game.icon}
      </div>
      <div className="text-center">
        <div className="font-english font-semibold text-sm" style={{ color: locked ? undefined : game.color }}>
          {game.name}
        </div>
        <div className="text-xs text-white/50 font-hebrew">{game.nameHe}</div>
      </div>
      {!locked && (
        <div className="text-xs text-white/30 font-hebrew">
          {wordCount} מילים
        </div>
      )}
      {locked && (
        <div className="text-xs text-white/30 font-hebrew">
          צריך {game.minWords} מילים
        </div>
      )}
    </motion.button>
  );
}
