import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { getAvailableWords } from '../../data/words';
import { SpaceButton } from '../ui/SpaceButton';
import { GlowText } from '../ui/GlowText';
import { cn } from '../../lib/cn';

const ALL_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

const presets = [
  { label: 'מתחילים', letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 't', 'n', 's', 'o', 'r'] },
  { label: 'כל האותיות', letters: ALL_LETTERS },
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
    <div className="min-h-dvh flex flex-col items-center p-6 relative z-10">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mt-8 mb-6"
      >
        <h2 className="text-2xl font-bold font-hebrew mb-2">
          בחר אותיות <GlowText color="blue">ללמוד</GlowText>
        </h2>
        <p className="text-white/50 font-hebrew text-sm">
          {wordCount} מילים זמינות
        </p>
      </motion.div>

      <div className="flex gap-2 mb-6">
        {presets.map(p => (
          <SpaceButton
            key={p.label}
            variant="ghost"
            size="sm"
            onClick={() => setSelected(p.letters)}
          >
            {p.label}
          </SpaceButton>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-7 gap-2 max-w-md mb-8"
      >
        {ALL_LETTERS.map((letter, i) => {
          const isSelected = selected.includes(letter);
          return (
            <motion.button
              key={letter}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.02 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggle(letter)}
              className={cn(
                'w-11 h-11 rounded-lg border-2 font-english font-bold text-lg uppercase transition-all cursor-pointer',
                isSelected
                  ? 'bg-neon-blue/20 border-neon-blue text-neon-blue'
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
              )}
            >
              {letter}
            </motion.button>
          );
        })}
      </motion.div>

      <SpaceButton
        variant="success"
        size="lg"
        onClick={handleContinue}
        disabled={selected.length < 3}
        className="w-full max-w-sm"
      >
        {selected.length < 3
          ? `בחר לפחות 3 אותיות (${selected.length}/3)`
          : `🚀 קדימה עם ${wordCount} מילים!`}
      </SpaceButton>
    </div>
  );
}
