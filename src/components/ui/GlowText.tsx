import { cn } from '../../lib/cn';
import type { ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  color?: 'blue' | 'purple' | 'green' | 'gold';
  children: ReactNode;
}

const colors = {
  blue: 'text-neon-blue text-glow-blue',
  purple: 'text-neon-purple text-glow-purple',
  green: 'text-neon-green text-glow-green',
  gold: 'text-neon-gold text-glow-gold',
};

export function GlowText({ color = 'blue', className, children, ...props }: Props) {
  return (
    <span className={cn(colors[color], className)} {...props}>
      {children}
    </span>
  );
}
