import { motion } from 'framer-motion';
import { cn } from '../../../lib/cn';

interface Props {
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  selected: string | null;
  correctAnswer: string | null;
  disabled: boolean;
}

export function AnswerOptions({ options, onSelect, selected, correctAnswer, disabled }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt, i) => {
        const isSelected = selected === opt.value;
        const isCorrect = correctAnswer === opt.value;
        const showResult = selected !== null;

        return (
          <motion.button
            key={opt.value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={disabled ? {} : { scale: 1.03 }}
            whileTap={disabled ? {} : { scale: 0.97 }}
            onClick={() => !disabled && onSelect(opt.value)}
            disabled={disabled}
            className={cn(
              'p-4 rounded-xl border-2 text-lg font-semibold transition-all cursor-pointer',
              'font-hebrew text-right',
              showResult && isCorrect && 'bg-neon-green/20 border-neon-green text-neon-green',
              showResult && isSelected && !isCorrect && 'bg-neon-pink/20 border-neon-pink text-neon-pink',
              !showResult && 'bg-space-light/50 border-white/10 text-white hover:border-neon-blue/30 hover:bg-space-light/70',
              showResult && !isSelected && !isCorrect && 'opacity-40',
            )}
          >
            {opt.label}
          </motion.button>
        );
      })}
    </div>
  );
}
