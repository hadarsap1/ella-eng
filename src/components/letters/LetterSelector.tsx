import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { getAvailableWords } from '../../data/words';
import { SpaceButton } from '../ui/SpaceButton';
import { GlowText } from '../ui/GlowText';

const ALL_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

const presets = [
  { label: '⭐ מתחילים', letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 't', 'n', 's', 'o', 'r'] },
  { label: '🌟 כל האותיות', letters: ALL_LETTERS },
];

export function LetterSelector() {
  const player = usePlayerStore(s => s.activePlayer());
  const setSelectedLetters = usePlayerStore(s => s.setSelectedLetters);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(player?.selectedLetters ?? []);

  useEffect(() => {
    if (player?.selectedLetters.length) {
      setSelected(player.selectedLetters);
    }
  }, [player?.selectedLetters]);

  const toggle = (letter: string) => {
    setSelected(prev =>
      prev.includes(letter) ? prev.filter(l => l !== letter) : [...prev, letter]
    );
  };

  const wordCount = getAvailableWords(selected).length;

  const handleContinue = () => {
    setSelectedLetters(selected);
    navigate('/galaxy');
  };

  return (
    <div className="flex-1 flex flex-col items-center px-5 py-8 w-full">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl font-bold font-hebrew mb-2">
          מפת <GlowText color="blue">הכוכבים</GlowText> ⭐
        </h2>
        <p className="text-white/35 font-hebrew text-sm font-medium">
          בחר אותיות ללמוד · <span className="text-neon-blue font-english font-bold">{wordCount}</span> מילים זמינות
        </p>
      </motion.div>

      {/* Presets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2.5 mb-6"
      >
        {presets.map(p => (
          <SpaceButton key={p.label} variant="ghost" size="sm" onClick={() => setSelected(p.letters)}>
            {p.label}
          </SpaceButton>
        ))}
        {selected.length > 0 && (
          <SpaceButton variant="ghost" size="sm" onClick={() => setSelected([])}>
            🗑️ נקה
          </SpaceButton>
        )}
      </motion.div>

      {/* Letter grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="ella-card-raised p-6 sm:p-7 mb-7 w-full max-w-md"
      >
        <div className="grid grid-cols-7 gap-2.5 sm:gap-3">
          {ALL_LETTERS.map((letter, i) => {
            const isSelected = selected.includes(letter);
            return (
              <motion.button
                key={letter}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.012, type: 'spring', damping: 14 }}
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => toggle(letter)}
                className="aspect-square rounded-2xl font-english font-bold text-lg sm:text-xl uppercase cursor-pointer transition-all duration-150 relative"
                style={isSelected ? {
                  background: 'linear-gradient(135deg, rgba(91,155,245,0.2) 0%, rgba(91,155,245,0.08) 100%)',
                  border: '2px solid rgba(91,155,245,0.5)',
                  color: '#5B9BF5',
                  boxShadow: '0 0 16px rgba(91,155,245,0.15)',
                } : {
                  background: 'rgba(255,255,255,0.03)',
                  border: '2px solid rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.25)',
                }}
              >
                {letter}
                {isSelected && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                    style={{ background: '#5B9BF5', boxShadow: '0 0 6px rgba(91,155,245,0.6)' }} />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Selected summary */}
        <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-xs text-white/25 font-hebrew font-medium">
            {selected.length} / 26 אותיות
          </span>
          <div className="flex gap-1 flex-wrap justify-end max-w-[60%]">
            {selected.map(l => (
              <span key={l} className="text-[11px] font-english text-neon-blue/60 uppercase font-bold">{l}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Continue */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md"
      >
        <SpaceButton
          variant="success"
          size="lg"
          onClick={handleContinue}
          disabled={selected.length < 3}
          className="w-full text-xl font-extrabold"
        >
          {selected.length < 3
            ? `בחר לפחות 3 אותיות (${selected.length}/3)`
            : `🚀 קדימה עם ${wordCount} מילים!`}
        </SpaceButton>
      </motion.div>
    </div>
  );
}
