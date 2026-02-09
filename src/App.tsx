import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameShell } from './components/layout/GameShell';
import { WelcomePage } from './pages/WelcomePage';
import { LettersPage } from './pages/LettersPage';
import { GalaxyPage } from './pages/GalaxyPage';
import { GamePage } from './pages/GamePage';
import { MissionControlPage } from './pages/MissionControlPage';

export default function App() {
  return (
    <BrowserRouter>
      <GameShell>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/letters" element={<LettersPage />} />
          <Route path="/galaxy" element={<GalaxyPage />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/mission-control" element={<MissionControlPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GameShell>
    </BrowserRouter>
  );
}
