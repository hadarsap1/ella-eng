import { cn } from '../../lib/cn';
import type { ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  color?: 'blue' | 'purple' | 'green' | 'gold' | 'coral';
  children: ReactNode;
}

const gradients = {
  blue: 'text-gradient-blue',
  purple: 'text-gradient-purple',
  green: 'text-gradient-green',
  gold: 'text-gradient-gold',
  coral: 'text-gradient-coral',
};

export function GlowText({ color = 'blue', className, children, ...props }: Props) {
  return (
    <span className={cn(gradients[color], className)} {...props}>
      {children}
    </span>
  );
}
