import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { GameShell } from './components/layout/GameShell';
// Import audio early so unlock listeners register before any game loads
import './lib/audio';
import { WelcomePage } from './pages/WelcomePage';
import { LettersPage } from './pages/LettersPage';
import { GalaxyPage } from './pages/GalaxyPage';
import { MissionControlPage } from './pages/MissionControlPage';

const GamePage = lazy(() => import('./pages/GamePage').then(m => ({ default: m.GamePage })));

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex-1 w-full flex flex-col"
    >
      {children}
    </motion.div>
  );
}

function GameLoader() {
  return (
    <div className="min-h-dvh flex items-center justify-center relative z-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="text-5xl"
      >
        🚀
      </motion.div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><WelcomePage /></PageTransition>} />
        <Route path="/letters" element={<PageTransition><LettersPage /></PageTransition>} />
        <Route path="/galaxy" element={<PageTransition><GalaxyPage /></PageTransition>} />
        <Route path="/game/:id" element={
          <PageTransition>
            <Suspense fallback={<GameLoader />}>
              <GamePage />
            </Suspense>
          </PageTransition>
        } />
        <Route path="/mission-control" element={<PageTransition><MissionControlPage /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <GameShell>
          <AnimatedRoutes />
        </GameShell>
      </HashRouter>
    </MotionConfig>
  );
}
