import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SpaceButton } from '../../ui/SpaceButton';
import { GlowText } from '../../ui/GlowText';
import { SpaceCard } from '../../ui/SpaceCard';
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

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 relative z-10">
      {leveledUp && <LevelUpModal level={levelAfter} />}

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-4">
          {accuracy >= 80 ? '🌟' : accuracy >= 50 ? '⭐' : '💫'}
        </div>
        <h2 className="text-3xl font-bold font-hebrew mb-2">
          {accuracy >= 80 ? (
            <GlowText color="gold">מדהים!</GlowText>
          ) : accuracy >= 50 ? (
            <GlowText color="blue">כל הכבוד!</GlowText>
          ) : (
            <GlowText color="purple">תמשיך לתרגל!</GlowText>
          )}
        </h2>
      </motion.div>

      <SpaceCard glow="blue" className="max-w-sm w-full mb-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-neon-blue font-english">{accuracy}%</div>
            <div className="text-sm text-white/50 font-hebrew">דיוק</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-neon-gold font-english">+{xpEarned}</div>
            <div className="text-sm text-white/50 font-hebrew">XP</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-neon-green font-english">{correct}/{total}</div>
            <div className="text-sm text-white/50 font-hebrew">תשובות נכונות</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-neon-pink font-english">{maxStreak}</div>
            <div className="text-sm text-white/50 font-hebrew">רצף מקסימלי</div>
          </div>
        </div>
      </SpaceCard>

      {newAchievements.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6 text-center"
        >
          <p className="text-neon-gold font-hebrew mb-2">🏆 הישגים חדשים!</p>
          {newAchievements.map(id => (
            <div key={id} className="text-sm text-white/70">{id}</div>
          ))}
        </motion.div>
      )}

      <div className="flex gap-3">
        <SpaceButton variant="primary" onClick={() => navigate('/galaxy')}>
          חזרה לגלקסיה
        </SpaceButton>
        <SpaceButton variant="ghost" onClick={() => window.location.reload()}>
          שחק שוב
        </SpaceButton>
      </div>
    </div>
  );
}
