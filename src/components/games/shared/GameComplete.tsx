import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SpaceButton } from '../../ui/SpaceButton';
import { GlowText } from '../../ui/GlowText';
import { useCelebration } from '../../../hooks/useCelebration';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { getLevel } from '../../../data/levels';
import { LevelUpModal } from './LevelUpModal';

interface Props {
  correct: number;
  total: number;
  xpEarned: number;
  maxStreak: number;
  xpBefore: number;
  xpAfter: number;
  newAchievements: string[];
}

export function GameComplete({ correct, total, xpEarned, maxStreak, xpBefore, xpAfter, newAchievements }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { celebrate, bigCelebrate } = useCelebration();
  const { playLevelUp } = useSoundEffects();

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const levelBefore = getLevel(xpBefore);
  const levelAfter = getLevel(xpAfter);
  const leveledUp = levelAfter.level > levelBefore.level;

  useEffect(() => {
    if (accuracy >= 80) bigCelebrate();
    else if (accuracy >= 50) celebrate();
    if (leveledUp) playLevelUp();
  }, [accuracy, leveledUp, bigCelebrate, celebrate, playLevelUp]);

  const emoji = accuracy >= 80 ? '🌟' : accuracy >= 50 ? '⭐' : '💫';
  const message = accuracy >= 80 ? 'מדהים!' : accuracy >= 50 ? 'כל הכבוד!' : 'תמשיך לתרגל!';
  const glowColor = accuracy >= 80 ? 'gold' as const : accuracy >= 50 ? 'blue' as const : 'purple' as const;

  const stats = [
    { value: `${accuracy}%`, label: 'דיוק', color: '#5B9BF5' },
    { value: `+${xpEarned}`, label: 'XP', color: '#FBBF24' },
    { value: `${correct}/${total}`, label: 'תשובות נכונות', color: '#34D399' },
    { value: `${maxStreak}`, label: 'רצף מקסימלי', color: '#F472B6' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 w-full">
      {leveledUp && <LevelUpModal level={levelAfter} />}

      {/* Big emoji */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, delay: 0.2 }}
        className="text-7xl sm:text-8xl mb-6"
        style={{ filter: 'drop-shadow(0 4px 20px rgba(251,191,36,0.2))' }}
      >
        {emoji}
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-4xl font-extrabold font-hebrew mb-8"
      >
        <GlowText color={glowColor}>{message}</GlowText>
      </motion.h2>

      {/* Stats card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="ella-card-raised rounded-3xl p-7 max-w-sm w-full mb-6"
      >
        <div className="grid grid-cols-2 gap-6 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1, type: 'spring', damping: 12 }}
            >
              <div className="text-3xl font-extrabold font-english" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-white/60 font-hebrew mt-1 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* New achievements */}
      {newAchievements.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-6 ella-card rounded-2xl px-5 py-3"
          style={{ borderColor: 'rgba(251,191,36,0.2)' }}
        >
          <p className="text-neon-gold font-hebrew text-sm text-center font-bold">🏆 הישגים חדשים!</p>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex gap-3"
      >
        <SpaceButton variant="primary" onClick={() => navigate('/galaxy')}>
          חזרה לגלקסיה
        </SpaceButton>
        <SpaceButton variant="ghost" onClick={() => navigate(location.pathname, { replace: true, state: { key: Date.now() } })}>
          🔄 שחק שוב
        </SpaceButton>
      </motion.div>
    </div>
  );
}
