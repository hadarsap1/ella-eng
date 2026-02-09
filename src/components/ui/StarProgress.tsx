import { cn } from '../../lib/cn';

interface Props {
  current: number;
  total: number;
  className?: string;
}

export function StarProgress({ current, total, className }: Props) {
  return (
    <div className={cn('flex gap-1.5', className)}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            'w-3 h-3 rounded-full transition-all duration-300',
            i < current
              ? 'bg-neon-gold scale-110'
              : 'bg-white/15'
          )}
        />
      ))}
    </div>
  );
}
