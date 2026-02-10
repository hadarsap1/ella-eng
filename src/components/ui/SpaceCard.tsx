import { cn } from '../../lib/cn';
import type { ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  raised?: boolean;
  children: ReactNode;
}

export function SpaceCard({ raised = false, className, children, style, ...props }: Props) {
  return (
    <div
      className={cn(
        raised ? 'ella-card-raised' : 'ella-card',
        'p-5',
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
