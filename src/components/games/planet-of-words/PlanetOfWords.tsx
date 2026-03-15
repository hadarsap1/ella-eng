import { useState, useEffect, useCallback, useRef } from 'react';
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

function makeOptions(target: Word, allWords: Word[]): { label: string; value: string }[] {
  const distractors = shuffle(allWords.filter(w => w.english !== target.english)).slice(0, 3);
  return shuffle([target, ...distractors]).map(w => ({
    label: w.hebrew,
    value: w.english,
  }));
}

const ROUNDS = 10;

export function PlanetOfWords() {
  const { words } = useWordFilter();
  const { speakWord } = useSpeech();
  const { playCorrect, playWrong, playStreak } = useSoundEffects();
  const addGameResult = usePlayerStore(s => s.addGameResult);

  const [roundWords] = useState(() => shuffle(words).slice(0, ROUNDS));
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState(() => roundWords[0] ? makeOptions(roundWords[0], words) : []);
  const [selected, setSelected] = useState<string | null>(null);
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

  const total = Math.min(ROUNDS, words.length);
  const currentWord = roundWords[index];

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
        wordsPlayed: wordsPlayedRef.current,
      };
      const res = addGameResult(result);
      setResultData({ ...res, xpEarned });
      setComplete(true);
    } else {
      const nextIndex = index + 1;
      setOptions(makeOptions(roundWords[nextIndex], words));
      setIndex(nextIndex);
      setSelected(null);
    }
  }, [index, total, correct, maxStreak, words, addGameResult]);

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

  if (!currentWord) {
    return (
      <div className="game-screen items-center justify-center">
        <p className="text-white/50 font-hebrew text-lg">אין מספיק מילים. בחר עוד אותיות 🔤</p>
      </div>
    );
  }

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
    <div className="game-screen">
      <GameHeader title="כוכב המילים" icon="🪐" current={index} total={total} streak={streak} />

      {/* Word display — the hero of the screen */}
      <motion.div
        key={index}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14 }}
        className="flex-1 flex flex-col items-center justify-center"
      >
        <motion.button
          onClick={() => speakWord(currentWord.english)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="game-word-display group cursor-pointer mb-3"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/[0.06] group-hover:bg-white/[0.1] transition-colors">
              <Volume2 className="w-7 h-7 text-neon-blue/60 group-hover:text-neon-blue transition-colors" />
            </div>
            <span className="text-5xl sm:text-7xl font-english font-extrabold text-gradient-blue leading-none">
              {currentWord.english}
            </span>
          </div>
        </motion.button>
        <p className="text-white/70 text-base font-hebrew font-medium">🎯 בחר את התרגום הנכון</p>
      </motion.div>

      {/* Answer options — big, chunky, filling bottom */}
      <div className="pb-2">
        <AnswerOptions
          options={options}
          onSelect={handleSelect}
          selected={selected}
          correctAnswer={selected ? currentWord.english : null}
          disabled={selected !== null}
        />
      </div>

      <FeedbackOverlay show={showFeedback} correct={isCorrectFeedback} />
    </div>
  );
}
