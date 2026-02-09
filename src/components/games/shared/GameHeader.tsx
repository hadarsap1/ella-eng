import { StarProgress } from '../../ui/StarProgress';

interface Props {
  title: string;
  icon: string;
  current: number;
  total: number;
  streak: number;
}

export function GameHeader({ title, icon, current, total, streak }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <span className="font-hebrew font-semibold">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        {streak >= 2 && (
          <div className="flex items-center gap-1 text-neon-gold text-sm font-bold animate-pulse-glow">
            🔥 {streak}
          </div>
        )}
        <StarProgress current={current} total={total} />
        <span className="text-sm text-white/50">{current}/{total}</span>
      </div>
    </div>
  );
}
