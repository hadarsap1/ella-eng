import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import type { ReactNode } from 'react';

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const variants = {
  primary: 'bg-neon-blue/20 border-neon-blue/50 text-neon-blue hover:bg-neon-blue/30 box-glow-blue',
  secondary: 'bg-neon-purple/20 border-neon-purple/50 text-neon-purple hover:bg-neon-purple/30 box-glow-purple',
  success: 'bg-neon-green/20 border-neon-green/50 text-neon-green hover:bg-neon-green/30 box-glow-green',
  danger: 'bg-neon-pink/20 border-neon-pink/50 text-neon-pink hover:bg-neon-pink/30',
  ghost: 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function SpaceButton({ variant = 'primary', size = 'md', className, children, onClick, disabled }: Props) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-xl border font-semibold transition-colors cursor-pointer font-hebrew',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
