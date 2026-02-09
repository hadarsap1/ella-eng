import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import type { Word, GameResult } from '../../../types/game';
import { useWordFilter } from '../../../hooks/useWordFilter';
import { useSpeech } from '../../../hooks/useSpeech';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { usePlayerStore } from '../../../stores/usePlayerStore';
import { GameHeader } from '../shared/GameHeader';
import { AnswerOptions } from '../shared/AnswerOptions';
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

function pickRound(words: Word[]): { target: Word; options: { label: string; value: string }[] } {
  const shuffled = shuffle(words);
  const target = shuffled[0];
  const distractors = shuffled.filter(w => w.english !== target.english).slice(0, 3);
  const options = shuffle([target, ...distractors]).map(w => ({
    label: w.hebrew,
    value: w.english,
  }));
  return { target, options };
}

const ROUNDS = 10;

export function PlanetOfWords() {
  const { words } = useWordFilter();
  const { speakWord } = useSpeech();
  const { playCorrect, playWrong, playStreak } = useSoundEffects();
  const addGameResult = usePlayerStore(s => s.addGameResult);

  const [roundWords] = useState(() => shuffle(words).slice(0, ROUNDS));
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState(() => pickRound(words));
  const [selected, setSelected] = useState<string | null>(null);
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

  const total = Math.min(ROUNDS, words.length);
  const currentWord = roundWords[index] || round.target;

  useEffect(() => {
    if (!complete && currentWord) {
      speakWord(currentWord.english);
    }
  }, [index, complete, currentWord, speakWord]);

  const nextRound = useCallback(() => {
    if (index + 1 >= total) {
      const xpEarned = correct * 10 + maxStreak * 5;
      const result: GameResult = {
        gameId: 'planet-of-words',
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
      const newRound = pickRound(words);
      setRound(newRound);
      setIndex(i => i + 1);
      setSelected(null);
    }
  }, [index, total, correct, maxStreak, wordsPlayed, words, addGameResult]);

  const handleSelect = (value: string) => {
    if (selected) return;
    setSelected(value);
    const isRight = value === currentWord.english;
    setIsCorrectFeedback(isRight);
    setShowFeedback(true);
    setWordsPlayed(prev => [...prev, currentWord.english]);

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

  return (
    <div className="max-w-lg mx-auto p-6 relative z-10">
      <GameHeader title="כוכב המילים" icon="🪐" current={index} total={total} streak={streak} />

      <motion.div
        key={index}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <button
          onClick={() => speakWord(currentWord.english)}
          className="inline-flex items-center gap-3 px-8 py-6 rounded-2xl bg-space-light/50 border border-neon-blue/20 hover:bg-space-light/70 transition-colors cursor-pointer"
        >
          <Volume2 className="w-8 h-8 text-neon-blue" />
          <span className="text-4xl font-english font-bold text-neon-blue">
            {currentWord.english}
          </span>
        </button>
        <p className="text-white/40 text-sm mt-3 font-hebrew">בחר את התרגום הנכון</p>
      </motion.div>

      <AnswerOptions
        options={round.options}
        onSelect={handleSelect}
        selected={selected}
        correctAnswer={selected ? currentWord.english : null}
        disabled={selected !== null}
      />

      <FeedbackOverlay show={showFeedback} correct={isCorrectFeedback} />
    </div>
  );
}
