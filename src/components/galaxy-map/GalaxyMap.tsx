import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { games } from '../../data/games';
import { useWordFilter } from '../../hooks/useWordFilter';
import { PlanetNode } from './PlanetNode';
import { GlowText } from '../ui/GlowText';
import { SpaceButton } from '../ui/SpaceButton';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { getLevel } from '../../data/levels';

export function GalaxyMap() {
  const navigate = useNavigate();
  const { words, pairs, sentences } = useWordFilter();
  const player = usePlayerStore(s => s.activePlayer());
  const level = player ? getLevel(player.xp) : null;

  const getWordCount = (gameId: string) => {
    switch (gameId) {
      case 'sound-twins': return pairs.length;
      case 'sentence-station': return sentences.length;
      default: return words.length;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-8 w-full">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold font-hebrew mb-3">
          <GlowText color="purple">מפת הגלקסיה</GlowText> 🌌
        </h2>
        {level && (
          <p className="text-white/35 text-base sm:text-lg font-hebrew font-medium">
            <span className="text-xl">{level.icon}</span> {level.title} · בחר משחק
          </p>
        )}
      </motion.div>

      {/* Game grid — fills available width */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full max-w-4xl mb-10">
        {games.map((game, i) => {
          const available = getWordCount(game.id);
          const locked = available < game.minWords;
          return (
            <PlanetNode
              key={game.id}
              game={game}
              index={i}
              locked={locked}
              wordCount={available}
              onClick={() => !locked && navigate(`/game/${game.id}`)}
            />
          );
        })}
      </div>

      {/* Bottom actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4"
      >
        <SpaceButton variant="ghost" onClick={() => navigate('/letters')}>
          <Settings className="w-4 h-4 inline ml-1.5" />
          אותיות
        </SpaceButton>
        <SpaceButton variant="secondary" onClick={() => navigate('/mission-control')}>
          📊 מרכז שליטה
        </SpaceButton>
      </motion.div>
    </div>
  );
}
