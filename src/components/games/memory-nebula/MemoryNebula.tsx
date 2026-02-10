import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Word, GameResult } from '../../../types/game';
import { useWordFilter } from '../../../hooks/useWordFilter';
import { useSpeech } from '../../../hooks/useSpeech';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { usePlayerStore } from '../../../stores/usePlayerStore';
import { GameHeader } from '../shared/GameHeader';
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

interface Card {
  id: string;
  wordKey: string;
  display: string;
  lang: 'en' | 'he';
}

export function MemoryNebula() {
  const { words } = useWordFilter();
  const { speakWord } = useSpeech();
  const { playCorrect, playWrong } = useSoundEffects();
  const addGameResult = usePlayerStore(s => s.addGameResult);

  const pairCount = 6;
  const [gameWords] = useState(() => shuffle(words).slice(0, pairCount));
  const [cards] = useState<Card[]>(() => {
    const c: Card[] = [];
    gameWords.forEach((w: Word) => {
      c.push({ id: `en-${w.english}`, wordKey: w.english, display: w.english, lang: 'en' });
      c.push({ id: `he-${w.english}`, wordKey: w.english, display: w.hebrew, lang: 'he' });
    });
    return shuffle(c);
  });

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [complete, setComplete] = useState(false);
  const [resultData, setResultData] = useState<{
    xpBefore: number; xpAfter: number; xpEarned: number; newAchievements: string[];
  } | null>(null);

  const handleComplete = useCallback(() => {
    const accuracy = Math.max(0, pairCount - (attempts - pairCount));
    const xpEarned = pairCount * 10 + Math.max(0, accuracy * 5);
    const result: GameResult = {
      gameId: 'memory-nebula',
      correct: pairCount,
      total: attempts,
      xpEarned,
      streak: 0,
      timestamp: Date.now(),
      wordsPlayed: gameWords.map((w: Word) => w.english),
    };
    const res = addGameResult(result);
    setResultData({ ...res, xpEarned });
    setComplete(true);
  }, [pairCount, attempts, gameWords, addGameResult]);

  useEffect(() => {
    if (matchCount === pairCount) {
      setTimeout(handleComplete, 800);
    }
  }, [matchCount, pairCount, handleComplete]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      const card1 = cards.find(c => c.id === first)!;
      const card2 = cards.find(c => c.id === second)!;

      setAttempts(a => a + 1);

      if (card1.wordKey === card2.wordKey) {
        playCorrect();
        setMatched(m => [...m, card1.wordKey]);
        setMatchCount(c => c + 1);
        setFlipped([]);
      } else {
        playWrong();
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }, [flipped, cards, playCorrect, playWrong]);

  const handleFlip = (cardId: string) => {
    const card = cards.find(c => c.id === cardId)!;
    if (flipped.includes(cardId) || matched.includes(card.wordKey) || flipped.length >= 2) return;

    if (card.lang === 'en') speakWord(card.display);
    setFlipped(f => [...f, cardId]);
  };

  if (complete && resultData) {
    return (
      <GameComplete
        correct={pairCount}
        total={attempts}
        xpEarned={resultData.xpEarned}
        maxStreak={0}
        xpBefore={resultData.xpBefore}
        xpAfter={resultData.xpAfter}
        newAchievements={resultData.newAchievements}
      />
    );
  }

  if (cards.length === 0) {
    return (
      <div className="game-screen items-center justify-center">
        <p className="text-white/50 font-hebrew text-lg">אין מספיק מילים. בחר עוד אותיות 🔤</p>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <GameHeader title="ערפילית הזיכרון" icon="🌀" current={matchCount} total={pairCount} streak={0} />

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.includes(card.wordKey);
          const showFace = isFlipped || isMatched;

          return (
            <motion.button
              key={card.id}
              whileHover={showFace ? {} : { scale: 1.05, y: -2 }}
              whileTap={showFace ? {} : { scale: 0.95 }}
              onClick={() => handleFlip(card.id)}
              className="aspect-square rounded-2xl border-2 flex items-center justify-center text-center p-2 cursor-pointer transition-all duration-200"
              style={
                isMatched
                  ? { background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.4)', boxShadow: '0 0 20px rgba(52,211,153,0.1)' }
                  : isFlipped
                  ? { background: 'rgba(91,155,245,0.1)', borderColor: 'rgba(91,155,245,0.4)', boxShadow: '0 0 20px rgba(91,155,245,0.1)' }
                  : { background: 'linear-gradient(165deg, rgba(35,46,90,0.85), rgba(22,30,66,0.9))', borderColor: 'rgba(255,255,255,0.08)' }
              }
            >
              {showFace ? (
                <span className={cn(
                  'font-semibold',
                  card.lang === 'en' ? 'font-english text-neon-blue text-sm' : 'font-hebrew text-white text-xs'
                )}>
                  {card.display}
                </span>
              ) : (
                <span className="text-2xl">✨</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="text-center mt-4 text-white/40 text-sm font-hebrew">
        ניסיונות: {attempts}
      </div>
    </div>
  );
}
