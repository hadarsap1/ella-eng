import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import type { GameResult } from '../../../types/game';
import { useWordFilter } from '../../../hooks/useWordFilter';
import { useSpeech } from '../../../hooks/useSpeech';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { usePlayerStore } from '../../../stores/usePlayerStore';
import { GameHeader } from '../shared/GameHeader';
import { FeedbackOverlay } from '../shared/FeedbackOverlay';
import { GameComplete } from '../shared/GameComplete';


function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUNDS = 8;
const DISTRACTORS = 3;

interface FuelCell {
  id: string;
  letter: string;
  x: number;
  y: number;
}

export function WordBuilder() {
  const { words } = useWordFilter();
  const { speakWord } = useSpeech();
  const { playCorrect, playWrong, playLaunch } = useSoundEffects();
  const addGameResult = usePlayerStore(s => s.addGameResult);

  const [roundWords] = useState(() => shuffle(words).slice(0, ROUNDS));
  const total = Math.min(ROUNDS, words.length);
  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [cells, setCells] = useState<FuelCell[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectFeedback, setIsCorrectFeedback] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wordsPlayed, setWordsPlayed] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [resultData, setResultData] = useState<{
    xpBefore: number; xpAfter: number; xpEarned: number; newAchievements: string[];
  } | null>(null);

  const currentWord = roundWords[index];

  useEffect(() => {
    if (!complete && currentWord) {
      speakWord(currentWord.english);
      setPlaced([]);
      setLaunching(false);

      // Create fuel cells: word letters + distractors
      const wordLetters = currentWord.english.split('');
      const allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
      const distractorPool = allLetters.filter(l => !wordLetters.includes(l));
      const distractors = shuffle(distractorPool).slice(0, DISTRACTORS);
      const allCells = shuffle([...wordLetters, ...distractors]).map((letter, i) => ({
        id: `${letter}-${i}-${Math.random()}`,
        letter,
        x: 15 + Math.random() * 70,
        y: 10 + Math.random() * 60,
      }));
      setCells(allCells);
    }
  }, [index, complete, currentWord, speakWord]);

  const nextRound = useCallback(() => {
    if (index + 1 >= total) {
      const xpEarned = correct * 15 + maxStreak * 5;
      const result: GameResult = {
        gameId: 'word-builder',
        correct,
        total,
        xpEarned,
        streak: maxStreak,
        timestamp: Date.now(),
        wordsPlayed,
      };
      const res = addGameResult(result);
      setResultData({ ...res, xpEarned });
      setComplete(true);
    } else {
      setIndex(i => i + 1);
    }
  }, [index, total, correct, maxStreak, wordsPlayed, addGameResult]);

  const handleCellClick = (cell: FuelCell) => {
    if (!currentWord || launching) return;

    const expectedLetter = currentWord.english[placed.length]?.toLowerCase();

    if (cell.letter.toLowerCase() === expectedLetter) {
      const newPlaced = [...placed, cell.letter];
      setPlaced(newPlaced);
      setCells(c => c.filter(fc => fc.id !== cell.id));
      playCorrect();

      if (newPlaced.length === currentWord.english.length) {
        // Word complete - launch rocket
        setLaunching(true);
        playLaunch();
        setCorrect(c => c + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        setWordsPlayed(prev => [...prev, currentWord.english]);
        setIsCorrectFeedback(true);
        setShowFeedback(true);

        setTimeout(() => {
          setShowFeedback(false);
          nextRound();
        }, 2000);
      }
    } else {
      playWrong();
      // Wrong letter - shake effect handled by motion
    }
  };

  const rocketProgress = currentWord ? placed.length / currentWord.english.length : 0;

  if (complete && resultData) {
    return (
      <GameComplete
        correct={correct}
        total={total}
        xpEarned={resultData.xpEarned}
        maxStreak={maxStreak}
        xpBefore={resultData.xpBefore}
        xpAfter={resultData.xpAfter}
        newAchievements={resultData.newAchievements}
      />
    );
  }

  if (!currentWord) return null;

  return (
    <div className="game-screen">
      <GameHeader title="רקטת בניית המילים" icon="🚀" current={index} total={total} streak={streak} />

      {/* Rocket */}
      <div className="flex justify-center mb-4">
        <motion.div
          animate={launching ? { y: -300, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={launching ? { duration: 1.5, ease: 'easeIn' } : {}}
          className="relative"
        >
          <div className="text-6xl">🚀</div>
          {/* Fuel gauge */}
          <div className="w-4 h-20 rounded-full mx-auto mt-1 overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.06)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)' }}>
            <motion.div
              className="w-full rounded-full absolute bottom-0 left-0 right-0"
              animate={{ height: `${rocketProgress * 100}%` }}
              style={{ background: 'linear-gradient(to top, #FBBF24, #34D399)' }}
            />
          </div>
        </motion.div>
      </div>

      {/* Listen */}
      <div className="text-center mb-2">
        <button
          onClick={() => speakWord(currentWord.english)}
          className="text-neon-blue hover:text-neon-blue/80 cursor-pointer transition-colors"
        >
          <Volume2 className="w-6 h-6 inline" />
        </button>
        <span className="text-white/50 text-sm font-hebrew mr-2">{currentWord.hebrew}</span>
      </div>

      {/* Letter slots */}
      <div className="flex justify-center gap-2 mb-6">
        {currentWord.english.split('').map((_letter, i) => {
          const filled = i < placed.length;
          return (
            <div
              key={i}
              className="w-10 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-english font-bold transition-all"
              style={
                filled
                  ? { background: 'linear-gradient(165deg, rgba(52,211,153,0.2), rgba(16,185,129,0.12))', borderColor: 'rgba(52,211,153,0.5)', color: '#34D399', boxShadow: '0 4px 16px rgba(52,211,153,0.1)' }
                  : { background: 'linear-gradient(165deg, rgba(35,46,90,0.6), rgba(22,30,66,0.7))', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.2)', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)' }
              }
            >
              {filled ? placed[i] : '?'}
            </div>
          );
        })}
      </div>

      {/* Floating fuel cells */}
      <div
        className="relative h-48 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, rgba(35,46,90,0.5) 0%, rgba(22,30,66,0.6) 100%)',
          border: '1.5px solid rgba(255,255,255,0.07)',
          boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <AnimatePresence>
          {cells.map(cell => (
            <motion.button
              key={cell.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: [0, Math.random() * 20 - 10, 0],
                y: [0, Math.random() * 15 - 7, 0],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                x: { repeat: Infinity, duration: 2 + Math.random() * 2 },
                y: { repeat: Infinity, duration: 3 + Math.random() * 2 },
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => handleCellClick(cell)}
              className="absolute w-11 h-11 rounded-full flex items-center justify-center font-english font-bold text-lg cursor-pointer"
              style={{
                left: `${cell.x}%`,
                top: `${cell.y}%`,
                background: 'linear-gradient(165deg, rgba(91,155,245,0.2), rgba(59,114,219,0.12))',
                border: '2px solid rgba(91,155,245,0.35)',
                color: '#5B9BF5',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 12px rgba(91,155,245,0.1)',
              }}
            >
              {cell.letter}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <FeedbackOverlay show={showFeedback} correct={isCorrectFeedback} />
    </div>
  );
}
