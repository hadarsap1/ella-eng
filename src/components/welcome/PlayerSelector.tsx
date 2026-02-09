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
      <p className="text-white/70 font-hebrew text-center mb-2">בחר שחקן</p>
      {players.map((player, i) => {
        const level = getLevel(player.xp);
        return (
          <motion.button
            key={player.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(player.id)}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-space-light/50 border border-white/10 hover:border-neon-blue/30 transition-colors cursor-pointer text-right"
          >
            <span className="text-3xl">{avatars[player.avatarIndex] || '🧑‍🚀'}</span>
            <div className="flex-1">
              <div className="font-semibold font-hebrew">{player.name}</div>
              <div className="text-sm text-white/50 font-hebrew">
                {level.icon} {level.title} · {player.xp} XP
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
