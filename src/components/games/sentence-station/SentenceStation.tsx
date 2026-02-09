import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import type { GameResult, Sentence } from '../../../types/game';
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

export function SentenceStation() {
  const { sentences } = useWordFilter();
  const { speakWord } = useSpeech();
  const { playCorrect, playWrong, playStreak } = useSoundEffects();
  const addGameResult = usePlayerStore(s => s.addGameResult);

  const [roundSentences] = useState(() => shuffle(sentences).slice(0, ROUNDS));
  const total = Math.min(ROUNDS, sentences.length);
  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectFeedback, setIsCorrectFeedback] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wordsPlayed, setWordsPlayed] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const [checked, setChecked] = useState(false);
  const [resultData, setResultData] = useState<{
    xpBefore: number; xpAfter: number; xpEarned: number; newAchievements: string[];
  } | null>(null);

  const currentSentence: Sentence | undefined = roundSentences[index];

  useEffect(() => {
    if (currentSentence) {
      setAvailable(shuffle([...currentSentence.words]));
      setPlaced([]);
      setChecked(false);
    }
  }, [index, currentSentence]);

  const nextRound = useCallback(() => {
    if (index + 1 >= total) {
      const xpEarned = correct * 15 + maxStreak * 5;
      const result: GameResult = {
        gameId: 'sentence-station',
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

  const handleWordClick = (word: string, fromPlaced: boolean) => {
    if (checked) return;
    if (fromPlaced) {
      setPlaced(p => { const i = p.indexOf(word); const n = [...p]; n.splice(i, 1); return n; });
      setAvailable(a => [...a, word]);
    } else {
      setAvailable(a => { const i = a.indexOf(word); const n = [...a]; n.splice(i, 1); return n; });
      setPlaced(p => [...p, word]);
    }
  };

  const handleCheck = () => {
    if (!currentSentence || placed.length !== currentSentence.words.length) return;
    setChecked(true);

    const isRight = placed.every((w, i) => w.toLowerCase() === currentSentence.words[i].toLowerCase());
    setIsCorrectFeedback(isRight);
    setShowFeedback(true);
    setWordsPlayed(prev => [...prev, ...currentSentence.words]);

    if (isRight) {
      setCorrect(c => c + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      if (newStreak >= 3) playStreak();
      else playCorrect();
    } else {
      setStreak(0);
      playWrong();
    }

    setTimeout(() => {
      setShowFeedback(false);
      nextRound();
    }, 1500);
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

  if (!currentSentence) return null;

  return (
    <div className="max-w-lg mx-auto p-6 relative z-10">
      <GameHeader title="תחנת המשפטים" icon="🚉" current={index} total={total} streak={streak} />

      <div className="text-center mb-6">
        <button
          onClick={() => speakWord(currentSentence.english)}
          className="inline-flex items-center gap-2 text-neon-green hover:text-neon-green/80 transition-colors cursor-pointer"
        >
          <Volume2 className="w-5 h-5" />
        </button>
        <p className="text-lg font-hebrew text-white/70 mt-2">{currentSentence.hebrew}</p>
        <p className="text-sm text-white/40 font-hebrew mt-1">סדר את המילים למשפט נכון באנגלית</p>
      </div>

      {/* Placed words area */}
      <div className="min-h-16 p-3 rounded-xl border-2 border-dashed border-white/20 bg-space-light/30 mb-4 flex flex-wrap gap-2 items-center justify-center">
        <AnimatePresence mode="popLayout">
          {placed.length === 0 ? (
            <span className="text-white/20 font-hebrew text-sm">גרור מילים לכאן</span>
          ) : (
            placed.map((word, i) => (
              <motion.button
                key={`placed-${word}-${i}`}
                layout
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => handleWordClick(word, true)}
                className={cn(
                  'px-4 py-2 rounded-lg font-english font-semibold cursor-pointer transition-colors',
                  checked && isCorrectFeedback && 'bg-neon-green/20 border border-neon-green text-neon-green',
                  checked && !isCorrectFeedback && 'bg-neon-pink/20 border border-neon-pink text-neon-pink',
                  !checked && 'bg-neon-blue/20 border border-neon-blue/50 text-neon-blue',
                )}
              >
                {word}
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <AnimatePresence mode="popLayout">
          {available.map((word, i) => (
            <motion.button
              key={`avail-${word}-${i}`}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleWordClick(word, false)}
              className="px-4 py-2 rounded-lg bg-space-light/50 border border-white/10 font-english font-semibold text-white/80 hover:border-neon-green/30 cursor-pointer transition-colors"
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {placed.length === currentSentence.words.length && !checked && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <button
            onClick={handleCheck}
            className="px-8 py-3 rounded-xl bg-neon-green/20 border border-neon-green/50 text-neon-green font-hebrew font-semibold hover:bg-neon-green/30 transition-colors cursor-pointer"
          >
            ✓ בדוק
          </button>
        </motion.div>
      )}

      <FeedbackOverlay show={showFeedback} correct={isCorrectFeedback} />
    </div>
  );
}
