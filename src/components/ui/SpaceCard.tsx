import { cn } from '../../lib/cn';
import type { ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  glow?: 'blue' | 'purple' | 'green' | 'gold' | 'none';
  children: ReactNode;
}

const glows = {
  blue: 'box-glow-blue border-neon-blue/30',
  purple: 'box-glow-purple border-neon-purple/30',
  green: 'box-glow-green border-neon-green/30',
  gold: 'box-glow-gold border-neon-gold/30',
  none: 'border-white/10',
};

export function SpaceCard({ glow = 'none', className, children, ...props }: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl border bg-space-light/50 backdrop-blur-sm p-4',
        glows[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
