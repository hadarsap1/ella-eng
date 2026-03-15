import { useState, useEffect, useCallback, useRef } from 'react';
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
  const wordsPlayedRef = useRef(wordsPlayed);
  wordsPlayedRef.current = wordsPlayed;
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
        wordsPlayed: wordsPlayedRef.current,
      };
      const res = addGameResult(result);
      setResultData({ ...res, xpEarned });
      setComplete(true);
    } else {
      setIndex(i => i + 1);
      setTargetIdx(Math.random() < 0.5 ? 0 : 1);
      setSelected(null);
    }
  }, [index, total, correct, maxStreak, addGameResult]);

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

  if (!currentPair) {
    return (
      <div className="game-screen items-center justify-center">
        <p className="text-white/50 font-hebrew text-lg">אין מספיק זוגות מילים. בחר עוד אותיות 🔤</p>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <GameHeader title="תאומי הצליל" icon="👯" current={index} total={total} streak={streak} />

      <div className="text-center mb-8">
        <motion.button
          key={index}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          onClick={() => speakWord(currentPair.words[targetIdx].english)}
          className="inline-flex items-center gap-4 px-10 py-7 rounded-3xl cursor-pointer group transition-all duration-200"
          style={{
            background: 'linear-gradient(165deg, rgba(244,114,182,0.12), rgba(236,72,153,0.06))',
            border: '1.5px solid rgba(244,114,182,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <Volume2 className="w-10 h-10 text-neon-pink/60 group-hover:text-neon-pink group-hover:scale-110 transition-all" />
          <span className="text-white/40 font-hebrew font-medium">🔊 לחץ לשמוע שוב</span>
        </motion.button>
        <p className="text-white/25 text-sm mt-4 font-hebrew font-medium">
          👯 איזו מילה שמעת? ({currentPair.difference})
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
                'p-6 sm:p-7 rounded-2xl text-center transition-all duration-200 cursor-pointer',
              )}
              style={
                isCorrectAnswer
                  ? { background: 'linear-gradient(165deg, rgba(52,211,153,0.2), rgba(16,185,129,0.12))', border: '2px solid rgba(52,211,153,0.5)', boxShadow: '0 4px 24px rgba(52,211,153,0.15)' }
                  : isWrong
                  ? { background: 'linear-gradient(165deg, rgba(244,114,182,0.2), rgba(236,72,153,0.12))', border: '2px solid rgba(244,114,182,0.5)', boxShadow: '0 4px 24px rgba(244,114,182,0.15)' }
                  : selected === null
                  ? { background: 'linear-gradient(165deg, rgba(35,46,90,0.85), rgba(22,30,66,0.9))', border: '1.5px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }
                  : { background: 'rgba(20,26,55,0.5)', border: '1.5px solid rgba(255,255,255,0.03)', opacity: 0.4 }
              }
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
