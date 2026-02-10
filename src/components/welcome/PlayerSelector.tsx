import { motion } from 'framer-motion';
import type { Player } from '../../types/game';
import { getLevel } from '../../data/levels';

const avatars = ['🧑‍🚀', '👩‍🚀', '👨‍🚀', '🤖', '👽', '🦊'];

interface Props {
  players: Player[];
  onSelect: (id: string) => void;
}

export function PlayerSelector({ players, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-white/35 font-hebrew text-center text-sm mb-4 font-medium">בחר שחקן</p>
      {players.map((player, i) => {
        const level = getLevel(player.xp);
        return (
          <motion.button
            key={player.id}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1, type: 'spring', damping: 15 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(player.id)}
            className="w-full flex items-center gap-4 p-5 rounded-2xl ella-card-interactive cursor-pointer text-right group"
          >
            <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
              {avatars[player.avatarIndex] || '🧑‍🚀'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold font-hebrew text-lg text-white/90">{player.name}</div>
              <div className="text-sm text-white/35 font-hebrew flex items-center gap-1.5 mt-0.5">
                <span className="text-base">{level.icon}</span>
                <span>{level.title}</span>
                <span className="text-white/15">·</span>
                <span className="text-neon-blue font-english text-xs font-bold">{player.xp} XP</span>
              </div>
            </div>
            <div className="text-white/15 group-hover:text-neon-blue/50 transition-colors text-xl">←</div>
          </motion.button>
        );
      })}
    </div>
  );
}
