import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { getLevel, getLevelProgress, getNextLevel } from '../../data/levels';

const avatars = ['🧑‍🚀', '👩‍🚀', '👨‍🚀', '🤖', '👽', '🦊'];

export function TopBar() {
  const player = usePlayerStore(s => s.activePlayer());
  const navigate = useNavigate();
  const location = useLocation();

  if (!player || location.pathname === '/') return null;

  const level = getLevel(player.xp);
  const next = getNextLevel(player.xp);
  const progress = getLevelProgress(player.xp);

  return (
    <div
      className="relative z-10 flex items-center gap-4 px-5 sm:px-8 py-4"
      style={{
        background: 'linear-gradient(180deg, rgba(11, 16, 38, 0.97) 0%, rgba(11, 16, 38, 0.85) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="w-11 h-11 flex items-center justify-center rounded-xl ella-btn-ghost cursor-pointer"
        aria-label="חזור"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Level + XP */}
      <div className="flex items-center gap-3 flex-1">
        <span className="text-2xl sm:text-3xl">{level.icon}</span>
        <div className="flex-1 max-w-[260px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-white/50 font-hebrew font-medium">{level.title}</span>
            {next && (
              <span className="text-xs text-neon-blue font-english font-bold">{player.xp}/{next.xpRequired}</span>
            )}
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full progress-bar-glow transition-all duration-700 ease-out"
              style={{ width: `${Math.max(progress * 100, 3)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Player badge */}
      <button
        onClick={() => navigate('/galaxy')}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl ella-btn-ghost cursor-pointer"
      >
        <span className="text-2xl sm:text-3xl">{avatars[player.avatarIndex] || '🧑‍🚀'}</span>
        <span className="text-sm font-hebrew text-white/60 font-bold hidden sm:inline">{player.name}</span>
      </button>
    </div>
  );
}
