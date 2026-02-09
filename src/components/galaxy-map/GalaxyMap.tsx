import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { games } from '../../data/games';
import { useWordFilter } from '../../hooks/useWordFilter';
import { PlanetNode } from './PlanetNode';
import { GlowText } from '../ui/GlowText';
import { SpaceButton } from '../ui/SpaceButton';

export function GalaxyMap() {
  const navigate = useNavigate();
  const { words, pairs, sentences } = useWordFilter();

  const getWordCount = (gameId: string) => {
    switch (gameId) {
      case 'sound-twins': return pairs.length;
      case 'sentence-station': return sentences.length;
      default: return words.length;
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center p-6 relative z-10">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mt-4 mb-8"
      >
        <h2 className="text-2xl font-bold font-hebrew">
          <GlowText color="purple">מפת הגלקסיה</GlowText>
        </h2>
        <p className="text-white/50 text-sm font-hebrew mt-1">בחר משחק להתחיל</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg w-full mb-6">
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

      <div className="flex gap-3 mt-4">
        <SpaceButton
          variant="ghost"
          onClick={() => navigate('/letters')}
        >
          <Settings className="w-4 h-4 inline ml-1" />
          אותיות
        </SpaceButton>
        <SpaceButton
          variant="secondary"
          onClick={() => navigate('/mission-control')}
        >
          📊 מרכז שליטה
        </SpaceButton>
      </div>
    </div>
  );
}
