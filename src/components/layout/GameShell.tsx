import type { ReactNode } from 'react';
import { SpaceBackground } from './SpaceBackground';
import { TopBar } from './TopBar';

export function GameShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh relative">
      <SpaceBackground />
      <TopBar />
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
