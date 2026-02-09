import { useParams, Navigate } from 'react-router-dom';
import type { GameId } from '../types/game';
import { PlanetOfWords } from '../components/games/planet-of-words/PlanetOfWords';
import { MemoryNebula } from '../components/games/memory-nebula/MemoryNebula';
import { SoundTwins } from '../components/games/sound-twins/SoundTwins';
import { SentenceStation } from '../components/games/sentence-station/SentenceStation';
import { ListeningAsteroid } from '../components/games/listening-asteroid/ListeningAsteroid';
import { WordBuilder } from '../components/games/word-builder/WordBuilder';

const gameComponents: Record<GameId, React.ComponentType> = {
  'planet-of-words': PlanetOfWords,
  'memory-nebula': MemoryNebula,
  'sound-twins': SoundTwins,
  'sentence-station': SentenceStation,
  'listening-asteroid': ListeningAsteroid,
  'word-builder': WordBuilder,
};

export function GamePage() {
  const { id } = useParams<{ id: string }>();
  const GameComponent = id ? gameComponents[id as GameId] : null;

  if (!GameComponent) return <Navigate to="/galaxy" replace />;

  return <GameComponent />;
}
