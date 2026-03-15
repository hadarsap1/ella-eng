import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Heart, Lightbulb } from 'lucide-react';
import type { GameResult } from '../../../types/game';
import { useWordFilter } from '../../../hooks/useWordFilter';
import { useSpeech } from '../../../hooks/useSpeech';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { usePlayerStore } from '../../../stores/usePlayerStore';
import { GameHeader } from '../shared/GameHeader';
import { FeedbackOverlay } from '../shared/FeedbackOverlay';
import { GameComplete } from '../shared/GameComplete';
import { cn } from '../../../lib/cn';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUNDS = 8;
const MAX_LIVES = 3;

export function ListeningAsteroid() {
  const { words, letters: selectedLetters } = useWordFilter();
  const { speakWord } = useSpeech();
  const { playCorrect, playWrong, playStreak } = useSoundEffects();
  const addGameResult = usePlayerStore(s => s.addGameResult);

  const [roundWords] = useState(() => shuffle(words).slice(0, ROUNDS));
  const total = Math.min(ROUNDS, words.length);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [lives, setLives] = useState(MAX_LIVES);
  const [hintUsed, setHintUsed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectFeedback, setIsCorrectFeedback] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wordsPlayed, setWordsPlayed] = useState<string[]>([]);
  const wordsPlayedRef = useRef(wordsPlayed);
  wordsPlayedRef.current = wordsPlayed;
  const [complete, setComplete] = useState(false);
  const [wordComplete, setWordComplete] = useState(false);
  const [resultData, setResultData] = useState<{
    xpBefore: number; xpAfter: number; xpEarned: number; newAchievements: string[];
  } | null>(null);

  const currentWord = roundWords[index];

  // Keyboard letters: selected letters + letters in current word, deduplicated
  const keyboardLetters = [...new Set([
    ...selectedLetters.map(l => l.toLowerCase()),
    ...(currentWord?.letters.map(l => l.toLowerCase()) ?? []),
  ])].sort();

  useEffect(() => {
    if (!complete && currentWord) {
      speakWord(currentWord.english);
      setTyped([]);
      setLives(MAX_LIVES);
      setHintUsed(false);
      setWordComplete(false);
    }
  }, [index, complete, currentWord, speakWord]);

  const nextRound = useCallback(() => {
    if (index + 1 >= total) {
      const xpEarned = correct * 15 + maxStreak * 5;
      const result: GameResult = {
        gameId: 'listening-asteroid',
        correct,
        total,
        xpEarned,
        streak: maxStreak,
        timestamp: Date.now(),
        wordsPlayed: wordsPlayedRef.current,
      };
      const res = addGameResult(result);
      setResultData({ ...res, xpEarned });
      setComplete(true);
    } else {
      setIndex(i => i + 1);
    }
  }, [index, total, correct, maxStreak, addGameResult]);

  const handleKey = (letter: string) => {
    if (!currentWord || wordComplete) return;

    const targetLetter = currentWord.english[typed.length]?.toLowerCase();

    if (letter.toLowerCase() === targetLetter) {
      const newTyped = [...typed, letter.toLowerCase()];
      setTyped(newTyped);

      if (newTyped.length === currentWord.english.length) {
        // Word complete
        setWordComplete(true);
        setIsCorrectFeedback(true);
        setShowFeedback(true);
        setCorrect(c => c + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        if (newStreak >= 3) playStreak();
        else playCorrect();
        setWordsPlayed(prev => [...prev, currentWord.english]);

        setTimeout(() => {
          setShowFeedback(false);
          nextRound();
        }, 1200);
      } else {
        playCorrect();
      }
    } else {
      playWrong();
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setWordComplete(true);
        setIsCorrectFeedback(false);
        setShowFeedback(true);
        setStreak(0);
        setWordsPlayed(prev => [...prev, currentWord.english]);

        setTimeout(() => {
          setShowFeedback(false);
          nextRound();
        }, 1500);
      }
    }
  };

  const handleHint = () => {
    if (!currentWord || hintUsed || wordComplete) return;
    setHintUsed(true);
    const nextLetter = currentWord.english[typed.length]?.toLowerCase();
    if (nextLetter) {
      const newTyped = [...typed, nextLetter];
      setTyped(newTyped);

      if (newTyped.length === currentWord.english.length) {
        setWordComplete(true);
        setIsCorrectFeedback(true);
        setShowFeedback(true);
        setCorrect(c => c + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        if (newStreak >= 3) playStreak();
        else playCorrect();
        setWordsPlayed(prev => [...prev, currentWord.english]);

        setTimeout(() => {
          setShowFeedback(false);
          nextRound();
        }, 1200);
      }
    }
  };

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

  if (!currentWord) {
    return (
      <div className="game-screen items-center justify-center">
        <p className="text-white/50 font-hebrew text-lg">אין מספיק מילים. בחר עוד אותיות 🔤</p>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <GameHeader title="אסטרואיד ההאזנה" icon="🌠" current={index} total={total} streak={streak} />

      {/* Listen button */}
      <div className="text-center mb-6">
        <motion.button
          key={index}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          onClick={() => speakWord(currentWord.english)}
          className="inline-flex items-center gap-3 px-8 py-6 rounded-2xl cursor-pointer group transition-all duration-200"
          style={{
            background: 'linear-gradient(165deg, rgba(251,191,36,0.12), rgba(245,158,11,0.06))',
            border: '1.5px solid rgba(251,191,36,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <Volume2 className="w-10 h-10 text-neon-gold/60 group-hover:text-neon-gold group-hover:scale-110 transition-all" />
          <span className="text-white/60 font-hebrew font-medium">🔊 לחץ לשמוע</span>
        </motion.button>
      </div>

      {/* Lives & hint */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {Array.from({ length: MAX_LIVES }, (_, i) => (
            <Heart
              key={i}
              className={cn('w-6 h-6', i < lives ? 'text-neon-pink fill-neon-pink' : 'text-white/20')}
            />
          ))}
        </div>
        <button
          onClick={handleHint}
          disabled={hintUsed || wordComplete}
          className={cn(
            'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-hebrew cursor-pointer transition-colors',
            hintUsed ? 'text-white/20' : 'text-neon-gold hover:bg-neon-gold/10'
          )}
        >
          <Lightbulb className="w-4 h-4" />
          רמז
        </button>
      </div>

      {/* Letter slots */}
      <div className="flex justify-center gap-2 mb-8">
        {currentWord.english.split('').map((_letter, i) => {
          const filled = i < typed.length;
          return (
            <motion.div
              key={i}
              initial={filled ? { scale: 1.3 } : {}}
              animate={{ scale: 1 }}
              className="w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-english font-bold transition-all"
              style={
                wordComplete && !isCorrectFeedback
                  ? { background: 'linear-gradient(165deg, rgba(244,114,182,0.2), rgba(236,72,153,0.12))', borderColor: 'rgba(244,114,182,0.5)', color: '#F472B6', boxShadow: '0 4px 16px rgba(244,114,182,0.1)' }
                  : filled
                  ? { background: 'linear-gradient(165deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))', borderColor: 'rgba(251,191,36,0.5)', color: '#FBBF24', boxShadow: '0 4px 16px rgba(251,191,36,0.1)' }
                  : { background: 'linear-gradient(165deg, rgba(35,46,90,0.6), rgba(22,30,66,0.7))', borderColor: 'rgba(255,255,255,0.12)', color: 'transparent', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)' }
              }
            >
              {filled ? typed[i] : '_'}
            </motion.div>
          );
        })}
      </div>

      {/* Show correct answer on failure */}
      {wordComplete && !isCorrectFeedback && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-neon-pink font-english text-lg mb-4"
        >
          {currentWord.english} = {currentWord.hebrew}
        </motion.p>
      )}

      {/* Virtual keyboard */}
      <div className="flex flex-wrap gap-3 justify-center">
        {keyboardLetters.map(letter => (
          <motion.button
            key={letter}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKey(letter)}
            disabled={wordComplete}
            aria-label={letter}
            className={cn(
              'w-14 h-14 rounded-xl font-english font-bold text-xl uppercase cursor-pointer transition-all',
              wordComplete && 'opacity-30 cursor-not-allowed',
            )}
            style={{
              background: 'linear-gradient(165deg, rgba(35,46,90,0.85), rgba(22,30,66,0.9))',
              border: '1.5px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.85)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            }}
          >
            {letter}
          </motion.button>
        ))}
      </div>

      <FeedbackOverlay show={showFeedback} correct={isCorrectFeedback} />
    </div>
  );
}
