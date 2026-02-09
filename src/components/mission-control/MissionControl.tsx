import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { getLevel, getLevelProgress, getNextLevel } from '../../data/levels';
import { games } from '../../data/games';
import { achievements } from '../../data/achievements';
import { SpaceCard } from '../ui/SpaceCard';
import { GlowText } from '../ui/GlowText';
import type { GameId } from '../../types/game';

function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <svg viewBox="0 0 300 150" className="w-full">
      {data.map((d, i) => {
        const barWidth = 300 / data.length - 8;
        const x = i * (300 / data.length) + 4;
        const height = (d.value / max) * 110;
        const y = 130 - height;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barWidth} height={height} rx={4} fill={d.color} opacity={0.7} />
            <text x={x + barWidth / 2} y={145} textAnchor="middle" fill="white" opacity={0.5} fontSize={9} fontFamily="Rubik">{d.label}</text>
            <text x={x + barWidth / 2} y={y - 4} textAnchor="middle" fill="white" opacity={0.7} fontSize={10} fontFamily="Fredoka">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <div className="text-center">
      <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto">
        <circle cx={50} cy={50} r={r} fill="none" stroke="white" strokeOpacity={0.1} strokeWidth={8} />
        <circle
          cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 50 50)"
        />
        <text x={50} y={48} textAnchor="middle" fill="white" fontSize={18} fontFamily="Fredoka" fontWeight="bold">{value}%</text>
        <text x={50} y={62} textAnchor="middle" fill="white" opacity={0.5} fontSize={9} fontFamily="Rubik">{label}</text>
      </svg>
    </div>
  );
}

export function MissionControl() {
  const player = usePlayerStore(s => s.activePlayer());
  const navigate = useNavigate();

  const stats = useMemo(() => {
    if (!player) return null;
    const results = player.gameResults;
    const totalCorrect = results.reduce((s, r) => s + r.correct, 0);
    const totalQuestions = results.reduce((s, r) => s + r.total, 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const uniqueWords = new Set(results.flatMap(r => r.wordsPlayed)).size;
    const bestStreak = Math.max(0, ...results.map(r => r.streak));

    const byGame = games.map(g => {
      const gameResults = results.filter(r => r.gameId === g.id);
      const gCorrect = gameResults.reduce((s, r) => s + r.correct, 0);
      const gTotal = gameResults.reduce((s, r) => s + r.total, 0);
      return {
        id: g.id as GameId,
        name: g.nameHe,
        icon: g.icon,
        color: g.color,
        played: gameResults.length,
        accuracy: gTotal > 0 ? Math.round((gCorrect / gTotal) * 100) : 0,
      };
    });

    return { totalCorrect, totalQuestions, accuracy, uniqueWords, bestStreak, byGame, gamesPlayed: results.length };
  }, [player]);

  if (!player || !stats) {
    return (
      <div className="min-h-dvh flex items-center justify-center relative z-10">
        <p className="text-white/50 font-hebrew">אין נתונים עדיין</p>
      </div>
    );
  }

  const level = getLevel(player.xp);
  const next = getNextLevel(player.xp);
  const progress = getLevelProgress(player.xp);
  const earnedAchievements = achievements.filter(a => player.achievements.includes(a.id));

  return (
    <div className="max-w-2xl mx-auto p-6 relative z-10">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/galaxy')} className="text-white/50 hover:text-white cursor-pointer transition-colors">
          <ArrowRight className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold font-hebrew">
          <GlowText color="purple">מרכז שליטה</GlowText>
        </h2>
        <div />
      </div>

      {/* Player overview */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <SpaceCard glow="purple" className="mb-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{level.icon}</div>
            <div className="flex-1">
              <h3 className="font-bold font-hebrew text-lg">{player.name}</h3>
              <p className="text-white/50 text-sm font-hebrew">{level.title} · רמה {level.level}</p>
              <div className="w-full h-2 bg-white/10 rounded-full mt-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-blue"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="text-xs text-white/30 mt-1 font-hebrew">
                {player.xp} XP {next && `/ ${next.xpRequired} לרמה הבאה`}
              </p>
            </div>
          </div>
        </SpaceCard>
      </motion.div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'משחקים', value: stats.gamesPlayed, icon: '🎮' },
          { label: 'מילים', value: stats.uniqueWords, icon: '📚' },
          { label: 'רצף מקסימלי', value: stats.bestStreak, icon: '🔥' },
          { label: 'XP כולל', value: player.xp, icon: '⭐' },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <SpaceCard className="text-center">
              <div className="text-2xl mb-1">{m.icon}</div>
              <div className="text-xl font-bold font-english text-neon-blue">{m.value}</div>
              <div className="text-xs text-white/40 font-hebrew">{m.label}</div>
            </SpaceCard>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <SpaceCard>
            <h4 className="text-sm font-hebrew text-white/60 mb-2">דיוק כללי</h4>
            <DonutChart value={stats.accuracy} label="דיוק" color="#00d4ff" />
          </SpaceCard>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <SpaceCard>
            <h4 className="text-sm font-hebrew text-white/60 mb-2">משחקים שנשחקו</h4>
            <BarChart
              data={stats.byGame.filter(g => g.played > 0).map(g => ({
                label: g.icon,
                value: g.played,
                color: g.color,
              }))}
            />
          </SpaceCard>
        </motion.div>
      </div>

      {/* Per-game stats */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        <SpaceCard className="mb-4">
          <h4 className="text-sm font-hebrew text-white/60 mb-3">סטטיסטיקות לפי משחק</h4>
          <div className="space-y-2">
            {stats.byGame.map(g => (
              <div key={g.id} className="flex items-center gap-3">
                <span className="text-xl">{g.icon}</span>
                <span className="font-hebrew text-sm flex-1">{g.name}</span>
                <span className="text-xs text-white/40 font-english">{g.played} games</span>
                <span className="text-xs font-english" style={{ color: g.color }}>{g.accuracy}%</span>
              </div>
            ))}
          </div>
        </SpaceCard>
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
        <SpaceCard glow="gold">
          <h4 className="text-sm font-hebrew text-white/60 mb-3">🏆 הישגים ({earnedAchievements.length}/{achievements.length})</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {achievements.map(a => {
              const earned = player.achievements.includes(a.id);
              return (
                <div
                  key={a.id}
                  className={`text-center p-2 rounded-lg ${earned ? 'bg-neon-gold/10' : 'opacity-30'}`}
                  title={a.description}
                >
                  <div className="text-2xl">{a.icon}</div>
                  <div className="text-xs font-hebrew text-white/60 mt-1">{a.title}</div>
                </div>
              );
            })}
          </div>
        </SpaceCard>
      </motion.div>
    </div>
  );
}
