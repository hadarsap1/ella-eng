import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, User } from 'lucide-react';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { getLevel, getLevelProgress, getNextLevel } from '../../data/levels';
import { cn } from '../../lib/cn';

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
    <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-space-mid/80 backdrop-blur-sm border-b border-white/10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
        aria-label="חזור"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3 flex-1 justify-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">{level.icon}</span>
          <div className="flex flex-col">
            <span className="text-xs text-white/60 font-hebrew">{level.title}</span>
            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-500"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
          {next && (
            <span className="text-xs text-white/40">{player.xp}/{next.xpRequired} XP</span>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate('/galaxy')}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        )}
      >
        <span className="text-lg">{avatars[player.avatarIndex] || '🧑‍🚀'}</span>
        <span className="text-sm font-hebrew">{player.name}</span>
        <User className="w-4 h-4 text-white/50" />
      </button>
    </div>
  );
}
