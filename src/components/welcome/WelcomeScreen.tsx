import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { SpaceButton } from '../ui/SpaceButton';
import { GlowText } from '../ui/GlowText';
import { PlayerSelector } from './PlayerSelector';

const avatars = ['🧑‍🚀', '👩‍🚀', '👨‍🚀', '🤖', '👽', '🦊'];

export function WelcomeScreen() {
  const { players, setActivePlayer, createPlayer } = usePlayerStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'choose' | 'create'>(players.length > 0 ? 'choose' : 'create');
  const [name, setName] = useState('');
  const [avatarIdx, setAvatarIdx] = useState(0);

  const handleCreate = () => {
    if (!name.trim()) return;
    createPlayer(name.trim(), avatarIdx);
    navigate('/letters');
  };

  const handleSelect = (id: string) => {
    setActivePlayer(id);
    const player = players.find(p => p.id === id);
    if (player && player.selectedLetters.length > 0) {
      navigate('/galaxy');
    } else {
      navigate('/letters');
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 relative z-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-4xl font-bold font-english mb-2">
          <GlowText color="blue">Ella</GlowText>
          <GlowText color="purple">Eng</GlowText>
        </h1>
        <p className="text-white/60 font-hebrew text-lg">הרפתקת חלל באנגלית</p>
      </motion.div>

      {mode === 'choose' && players.length > 0 ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-sm space-y-4"
        >
          <PlayerSelector players={players} onSelect={handleSelect} />
          <SpaceButton
            variant="ghost"
            className="w-full"
            onClick={() => setMode('create')}
          >
            + שחקן חדש
          </SpaceButton>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-sm space-y-6"
        >
          <div className="text-center">
            <p className="text-white/70 font-hebrew mb-4">בחר אסטרונאוט</p>
            <div className="flex justify-center gap-3">
              {avatars.map((a, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAvatarIdx(i)}
                  className={`text-3xl p-2 rounded-xl border-2 transition-colors cursor-pointer ${
                    avatarIdx === i
                      ? 'border-neon-blue bg-neon-blue/20'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {a}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="מה השם שלך?"
              maxLength={15}
              className="w-full px-4 py-3 rounded-xl bg-space-light/50 border border-white/10 text-white text-center font-hebrew text-lg placeholder:text-white/30 focus:outline-none focus:border-neon-blue/50"
              dir="rtl"
            />
          </div>

          <SpaceButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            🚀 יוצאים להרפתקה!
          </SpaceButton>

          {players.length > 0 && (
            <SpaceButton
              variant="ghost"
              className="w-full"
              onClick={() => setMode('choose')}
            >
              חזרה לבחירת שחקן
            </SpaceButton>
          )}
        </motion.div>
      )}
    </div>
  );
}
