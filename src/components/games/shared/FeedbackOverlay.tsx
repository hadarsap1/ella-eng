import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  show: boolean;
  correct: boolean;
  message?: string;
}

export function FeedbackOverlay({ show, correct, message }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
        >
          <div className={`text-center p-6 rounded-3xl ${
            correct
              ? 'bg-neon-green/20 border border-neon-green/30'
              : 'bg-neon-pink/20 border border-neon-pink/30'
          }`}>
            <div className="text-5xl mb-2">{correct ? '✅' : '❌'}</div>
            {message && (
              <p className={`font-hebrew text-lg ${correct ? 'text-neon-green' : 'text-neon-pink'}`}>
                {message}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
