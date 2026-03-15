import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { getLevel, getLevelProgress, getNextLevel } from '../../data/levels';
import { games } from '../../data/games';
import { achievements } from '../../data/achievements';
import { SpaceCard } from '../ui/SpaceCard';
import { GlowText } from '../ui/GlowText';
import type { GameId } from '../../types/game';

const avatars = ['🧑‍🚀', '👩‍🚀', '👨‍🚀', '🤖', '👽', '🦊'];

function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  if (data.length === 0) return <p className="text-center text-white/20 text-sm font-hebrew py-8">אין נתונים עדיין</p>;
  return (
    <svg viewBox="0 0 300 160" className="w-full">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(pct => (
        <line key={pct} x1={0} x2={300} y1={130 - pct * 110} y2={130 - pct * 110} stroke="white" strokeOpacity={0.04} />
      ))}
      {data.map((d, i) => {
        const barWidth = Math.min(300 / data.length - 10, 40);
        const x = i * (300 / data.length) + (300 / data.length - barWidth) / 2;
        const height = (d.value / max) * 110;
        const y = 130 - height;
        return (
          <g key={d.label}>
            <defs>
              <linearGradient id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={d.color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={d.color} stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <rect x={x} y={y} width={barWidth} height={height} rx={6} fill={`url(#bar-${i})`} />
            <text x={x + barWidth / 2} y={150} textAnchor="middle" fill="white" opacity={0.6} fontSize={14} fontFamily="Rubik">{d.label}</text>
            <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fill={d.color} fontSize={11} fontFamily="Quicksand" fontWeight="bold">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <div className="text-center">
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto" style={{ filter: `drop-shadow(0 0 8px ${color}30)` }}>
        <circle cx={50} cy={50} r={r} fill="none" stroke="white" strokeOpacity={0.06} strokeWidth={6} />
        <circle
          cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        <text x={50} y={46} textAnchor="middle" fill={color} fontSize={20} fontFamily="Quicksand" fontWeight="bold">{value}%</text>
        <text x={50} y={62} textAnchor="middle" fill="white" opacity={0.4} fontSize={9} fontFamily="Rubik">{label}</text>
      </svg>
    </div>
  );
}

export function MissionControl() {
  const player = usePlayerStore(s => s.activePlayer());

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
      <div className="flex-1 flex items-center justify-center w-full">
        <p className="text-white/50 font-hebrew">אין נתונים עדיין</p>
      </div>
    );
  }

  const level = getLevel(player.xp);
  const next = getNextLevel(player.xp);
  const progress = getLevelProgress(player.xp);
  const earnedAchievements = achievements.filter(a => player.achievements.includes(a.id));

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-5 sm:px-8 py-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-hebrew">
          <GlowText color="purple">מרכז שליטה</GlowText> 📊
        </h2>
      </div>

      {/* Player overview */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <SpaceCard className="mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{avatars[player.avatarIndex] ?? '🧑‍🚀'}</div>
            <div className="flex-1">
              <h3 className="font-bold font-hebrew text-xl">{player.name}</h3>
              <p className="text-white/50 text-sm font-hebrew">{level.icon} {level.title} · רמה {level.level}</p>
              <div className="w-full h-2 bg-white/10 rounded-full mt-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-blue"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="text-xs text-white/50 mt-1 font-hebrew">
                {player.xp} XP {next && `/ ${next.xpRequired} לרמה הבאה`}
              </p>
            </div>
          </div>
        </SpaceCard>
      </motion.div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
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
              <div className="text-xs text-white/60 font-hebrew">{m.label}</div>
            </SpaceCard>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <SpaceCard>
            <h4 className="text-sm font-hebrew text-white/60 mb-2">דיוק כללי</h4>
            <DonutChart value={stats.accuracy} label="דיוק" color="#5B9BF5" />
          </SpaceCard>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <SpaceCard>
            <h4 className="text-sm font-hebrew text-white/60 mb-2">משחקים שנשחקו</h4>
            <BarChart
              data={stats.byGame.map(g => ({
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
        <SpaceCard className="mb-6">
          <h4 className="text-sm font-hebrew text-white/60 mb-3">סטטיסטיקות לפי משחק</h4>
          <div className="space-y-2">
            {stats.byGame.map(g => (
              <div key={g.id} className="flex items-center gap-3">
                <span className="text-xl">{g.icon}</span>
                <span className="font-hebrew text-sm flex-1">{g.name}</span>
                <span className="text-xs text-white/40 font-hebrew">{g.played} משחקים</span>
                <span className="text-xs font-english" style={{ color: g.color }}>{g.accuracy}%</span>
              </div>
            ))}
          </div>
        </SpaceCard>
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
        <SpaceCard>
          <h4 className="text-sm font-hebrew text-white/60 mb-3">🏆 הישגים ({earnedAchievements.length}/{achievements.length})</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {achievements.map(a => {
              const earned = player.achievements.includes(a.id);
              return (
                <div
                  key={a.id}
                  className="text-center p-3 rounded-lg"
                  style={earned ? { background: 'rgba(251,191,36,0.1)' } : { opacity: 0.3 }}
                >
                  <div className="text-2xl mb-1">{a.icon}</div>
                  <div className="text-xs font-hebrew text-white/70 font-medium">{a.title}</div>
                  <div className="text-[10px] font-hebrew text-white/40 mt-0.5 leading-tight">{a.description}</div>
                </div>
              );
            })}
          </div>
        </SpaceCard>
      </motion.div>
    </div>
  );
}
