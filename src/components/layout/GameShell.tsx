import type { ReactNode } from 'react';
import { SpaceBackground } from './SpaceBackground';
import { TopBar } from './TopBar';

export function GameShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full flex flex-col relative">
      <SpaceBackground />
      <TopBar />
      <main className="relative z-10 flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
