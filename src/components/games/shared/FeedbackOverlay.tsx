import { motion, AnimatePresence } from 'framer-motion';

const encouragements = ['!כמעט', 'בפעם הבאה!', 'ממשיכים!', '!לא נורא'];

interface Props {
  show: boolean;
  correct: boolean;
  message?: string;
}

export function FeedbackOverlay({ show, correct, message }: Props) {
  const defaultMessage = correct
    ? undefined
    : encouragements[Math.floor(Math.random() * encouragements.length)];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
        >
          {/* Background flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ backgroundColor: correct ? '#34D399' : '#FBBF24' }}
          />

          {/* Feedback card */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            className="text-center p-8 rounded-3xl"
            style={correct ? {
              background: 'linear-gradient(165deg, rgba(52,211,153,0.15), rgba(16,185,129,0.1))',
              border: '2px solid rgba(52,211,153,0.3)',
              boxShadow: '0 0 50px rgba(52,211,153,0.15), 0 8px 32px rgba(0,0,0,0.3)',
            } : {
              background: 'linear-gradient(165deg, rgba(251,191,36,0.15), rgba(245,158,11,0.1))',
              border: '2px solid rgba(251,191,36,0.3)',
              boxShadow: '0 0 50px rgba(251,191,36,0.15), 0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <motion.div
              initial={{ rotate: -20, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              className="text-6xl mb-3"
            >
              {correct ? '⭐' : '🤔'}
            </motion.div>
            <p className={`font-hebrew text-lg font-bold ${correct ? 'text-neon-green' : 'text-neon-gold'}`}>
              {message || defaultMessage || (correct ? '!מצוין' : '')}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
