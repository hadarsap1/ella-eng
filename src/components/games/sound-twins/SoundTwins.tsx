import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import type { GameResult, WordPair } from '../../../types/game';
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

const ROUNDS = 10;

export function SoundTwins() {
  const { pairs } = useWordFilter();
  const { speakWord } = useSpeech();
  const { playCorrect, playWrong, playStreak } = useSoundEffects();
  const addGameResult = usePlayerStore(s => s.addGameResult);

  const [roundPairs] = useState(() => shuffle(pairs).slice(0, ROUNDS));
  const total = Math.min(ROUNDS, pairs.length);
  const [index, setIndex] = useState(0);
  const [targetIdx, setTargetIdx] = useState(() => Math.random() < 0.5 ? 0 : 1);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectFeedback, setIsCorrectFeedback] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wordsPlayed, setWordsPlayed] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const [resultData, setResultData] = useState<{
    xpBefore: number; xpAfter: number; xpEarned: number; newAchievements: string[];
  } | null>(null);

  const currentPair: WordPair | undefined = roundPairs[index];

  useEffect(() => {
    if (!complete && currentPair) {
      speakWord(currentPair.words[targetIdx].english);
    }
  }, [index, complete, currentPair, targetIdx, speakWord]);

  const nextRound = useCallback(() => {
    if (index + 1 >= total) {
      const xpEarned = correct * 12 + maxStreak * 5;
      const result: GameResult = {
        gameId: 'sound-twins',
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
      setTargetIdx(Math.random() < 0.5 ? 0 : 1);
      setSelected(null);
    }
  }, [index, total, correct, maxStreak, wordsPlayed, addGameResult]);

  const handleSelect = (wordIdx: number) => {
    if (selected !== null) return;
    setSelected(wordIdx);
    const isRight = wordIdx === targetIdx;
    setIsCorrectFeedback(isRight);
    setShowFeedback(true);

    if (currentPair) {
      setWordsPlayed(prev => [...prev, currentPair.words[targetIdx].english]);
    }

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
    }, 1200);
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

  if (!currentPair) return null;

  return (
    <div className="max-w-lg mx-auto p-6 relative z-10">
      <GameHeader title="תאומי הצליל" icon="👯" current={index} total={total} streak={streak} />

      <div className="text-center mb-8">
        <motion.button
          key={index}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          onClick={() => speakWord(currentPair.words[targetIdx].english)}
          className="inline-flex items-center gap-3 px-8 py-6 rounded-2xl bg-space-light/50 border border-neon-pink/20 hover:bg-space-light/70 transition-colors cursor-pointer"
        >
          <Volume2 className="w-10 h-10 text-neon-pink" />
          <span className="text-white/50 font-hebrew">לחץ לשמוע שוב</span>
        </motion.button>
        <p className="text-white/40 text-sm mt-3 font-hebrew">
          איזו מילה שמעת? ({currentPair.difference})
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {currentPair.words.map((word, i) => {
          const isSelected = selected === i;
          const isCorrectAnswer = selected !== null && i === targetIdx;
          const isWrong = isSelected && !isCorrectAnswer;

          return (
            <motion.button
              key={word.english}
              whileHover={selected !== null ? {} : { scale: 1.03 }}
              whileTap={selected !== null ? {} : { scale: 0.97 }}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={cn(
                'p-6 rounded-2xl border-2 text-center transition-all cursor-pointer',
                isCorrectAnswer && 'bg-neon-green/20 border-neon-green',
                isWrong && 'bg-neon-pink/20 border-neon-pink',
                selected === null && 'bg-space-light/50 border-white/10 hover:border-neon-pink/30',
                selected !== null && !isSelected && !isCorrectAnswer && 'opacity-40',
              )}
            >
              <div className="text-2xl font-english font-bold mb-2">{word.english}</div>
              <div className="text-sm text-white/60 font-hebrew">{word.hebrew}</div>
            </motion.button>
          );
        })}
      </div>

      <FeedbackOverlay show={showFeedback} correct={isCorrectFeedback} />
    </div>
  );
}
