import { motion } from 'framer-motion';

interface Props {
  title: string;
  icon: string;
  current: number;
  total: number;
  streak: number;
}

export function GameHeader({ title, icon, current, total, streak }: Props) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{icon}</span>
          <span className="font-hebrew font-bold text-white/80 text-lg">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          {streak >= 1 && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))',
                border: '1px solid rgba(251,191,36,0.25)',
              }}
              title={`רצף של ${streak} תשובות נכונות ברצף!`}
            >
              <span className="text-sm">🔥</span>
              <span className="text-sm font-bold text-neon-gold font-english">{streak}</span>
            </motion.div>
          )}
          <span className="text-sm text-white/60 font-english font-bold">{current}/{total}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-2.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.05)' }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="התקדמות במשחק"
      >
        <motion.div
          className="h-full progress-bar-glow"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(progress, 2)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
