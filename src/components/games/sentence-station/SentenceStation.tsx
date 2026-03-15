import { useState, useEffect, useCallback, useRef } from 'react';
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
  const wordsPlayedRef = useRef(wordsPlayed);
  wordsPlayedRef.current = wordsPlayed;
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
        wordsPlayed: wordsPlayedRef.current,
      };
      const res = addGameResult(result);
      setResultData({ ...res, xpEarned });
      setComplete(true);
    } else {
      setIndex(i => i + 1);
    }
  }, [index, total, correct, maxStreak, addGameResult]);

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

  if (!currentSentence) {
    return (
      <div className="game-screen items-center justify-center">
        <p className="text-white/50 font-hebrew text-lg">אין מספיק משפטים. בחר עוד אותיות 🔤</p>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <GameHeader title="תחנת המשפטים" icon="🚉" current={index} total={total} streak={streak} />

      <div className="text-center mb-6">
        <motion.button
          key={index}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          onClick={() => speakWord(currentSentence.english)}
          className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl cursor-pointer group transition-all duration-200"
          style={{
            background: 'linear-gradient(165deg, rgba(52,211,153,0.12), rgba(16,185,129,0.06))',
            border: '1.5px solid rgba(52,211,153,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <Volume2 className="w-8 h-8 text-neon-green/60 group-hover:text-neon-green group-hover:scale-110 transition-all" />
          <span className="text-white/40 font-hebrew font-medium">🔊 שמע את המשפט</span>
        </motion.button>
        <p className="text-lg font-hebrew text-white/70 mt-3">{currentSentence.hebrew}</p>
        <p className="text-sm text-white/25 font-hebrew mt-1 font-medium">🚉 סדר את המילים למשפט נכון באנגלית</p>
      </div>

      {/* Placed words area */}
      <div
        className="min-h-16 p-4 rounded-2xl border-2 border-dashed mb-4 flex flex-wrap gap-2 items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, rgba(30,38,80,0.6) 0%, rgba(15,21,53,0.7) 100%)',
          borderColor: 'rgba(255,255,255,0.15)',
          boxShadow: 'inset 0 2px 15px rgba(0,0,0,0.3)',
        }}
      >
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
                className="px-4 py-2 rounded-lg font-english font-semibold cursor-pointer transition-all"
                style={
                  checked && isCorrectFeedback
                    ? { background: 'linear-gradient(165deg, rgba(52,211,153,0.2), rgba(16,185,129,0.12))', border: '1.5px solid rgba(52,211,153,0.5)', color: '#34D399', boxShadow: '0 4px 16px rgba(52,211,153,0.12)' }
                    : checked && !isCorrectFeedback
                    ? { background: 'linear-gradient(165deg, rgba(244,114,182,0.2), rgba(236,72,153,0.12))', border: '1.5px solid rgba(244,114,182,0.5)', color: '#F472B6', boxShadow: '0 4px 16px rgba(244,114,182,0.12)' }
                    : { background: 'linear-gradient(165deg, rgba(91,155,245,0.15), rgba(59,114,219,0.08))', border: '1.5px solid rgba(91,155,245,0.35)', color: '#5B9BF5', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }
                }
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
              className="px-4 py-2 rounded-lg font-english font-semibold text-white/80 cursor-pointer transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(145deg, rgba(30,38,80,0.8), rgba(15,21,53,0.9))',
                border: '1.5px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
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
            className="ella-btn ella-btn-green px-8 py-3 font-hebrew"
          >
            ✓ בדוק
          </button>
        </motion.div>
      )}

      <FeedbackOverlay show={showFeedback} correct={isCorrectFeedback} />
    </div>
  );
}
