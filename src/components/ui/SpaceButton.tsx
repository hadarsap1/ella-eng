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
  primary: 'ella-btn-blue',
  secondary: 'ella-btn-purple',
  success: 'ella-btn-green',
  danger: 'ella-btn-coral',
  ghost: 'ella-btn-ghost',
};

const sizes = {
  sm: 'px-5 py-2.5 text-sm rounded-xl',
  md: 'px-7 py-3.5 text-base rounded-2xl',
  lg: 'px-9 py-4.5 text-lg rounded-2xl',
};

export function SpaceButton({ variant = 'primary', size = 'md', className, children, onClick, disabled }: Props) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'ella-btn font-bold cursor-pointer font-hebrew tracking-wide',
        'disabled:opacity-25 disabled:cursor-not-allowed disabled:shadow-none',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
