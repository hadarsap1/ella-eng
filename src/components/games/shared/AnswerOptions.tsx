import { motion } from 'framer-motion';

interface Props {
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  selected: string | null;
  correctAnswer: string | null;
  disabled: boolean;
}

export function AnswerOptions({ options, onSelect, selected, correctAnswer, disabled }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {options.map((opt, i) => {
        const isSelected = selected === opt.value;
        const isCorrect = correctAnswer === opt.value;
        const showResult = selected !== null;

        let cls = 'option-card';
        if (showResult && isCorrect) cls = 'option-correct';
        else if (showResult && isSelected && !isCorrect) cls = 'option-wrong';
        else if (showResult && !isSelected && !isCorrect) cls = 'option-dimmed';

        return (
          <motion.button
            key={opt.value}
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.07, type: 'spring', damping: 14 }}
            whileHover={disabled ? {} : { scale: 1.04, y: -4 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            onClick={() => !disabled && onSelect(opt.value)}
            disabled={disabled}
            className={`${cls} py-6 sm:py-7 px-4 font-bold text-xl sm:text-2xl cursor-pointer font-hebrew text-center flex items-center justify-center`}
            style={showResult && isCorrect
              ? { color: '#34D399' }
              : showResult && isSelected && !isCorrect
              ? { color: '#F472B6' }
              : showResult
              ? { color: 'rgba(255,255,255,0.15)' }
              : { color: 'rgba(255,255,255,0.9)' }
            }
          >
            {opt.label}
          </motion.button>
        );
      })}
    </div>
  );
}
