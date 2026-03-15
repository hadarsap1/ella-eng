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
    <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 w-full">
      {/* Hero */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, duration: 0.8 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative inline-block mb-6"
        >
          <div className="text-[100px] sm:text-[120px] leading-none" style={{ filter: 'drop-shadow(0 8px 24px rgba(91,155,245,0.2))' }}>🚀</div>
          {/* Engine glow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-14 rounded-full opacity-50"
            style={{ background: 'radial-gradient(ellipse, #FBBF24 0%, #FB923C 40%, transparent 70%)', filter: 'blur(10px)' }} />
        </motion.div>

        <h1 className="text-7xl sm:text-8xl font-extrabold font-english mb-3 tracking-tight leading-none">
          <GlowText color="blue">Ella</GlowText>
          <GlowText color="purple">Eng</GlowText>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white/60 font-hebrew text-xl tracking-wide font-medium"
        >
          הרפתקת חלל באנגלית ✨
        </motion.p>
      </motion.div>

      {mode === 'choose' && players.length > 0 ? (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md space-y-4"
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
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="ella-card-raised p-8 sm:p-10 space-y-8">
            {/* Avatar picker */}
            <div className="text-center">
              <label className="text-white/70 font-hebrew mb-5 text-sm font-medium tracking-wide block">בחר את האסטרונאוט שלך</label>
              <div className="flex justify-center gap-3">
                {avatars.map((a, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.15, y: -4 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setAvatarIdx(i)}
                    aria-label={`אסטרונאוט ${i + 1}`}
                    aria-pressed={avatarIdx === i}
                    className="text-4xl p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer"
                    style={avatarIdx === i ? {
                      borderColor: 'rgba(91,155,245,0.5)',
                      background: 'rgba(91,155,245,0.12)',
                      boxShadow: '0 0 24px rgba(91,155,245,0.15)',
                      transform: 'scale(1.08)',
                    } : {
                      borderColor: 'rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    {a}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Name input */}
            <div>
              <label htmlFor="player-name" className="text-white/70 font-hebrew text-sm font-medium block mb-2">✏️ מה השם שלך?</label>
              <input
                id="player-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="הכנס שם..."
                maxLength={20}
                aria-label="הכנס את השם שלך"
                className="w-full px-6 py-4 rounded-2xl text-white text-center font-hebrew text-xl placeholder:text-white/40 focus:outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: name ? '1.5px solid rgba(91,155,245,0.3)' : '1.5px solid rgba(255,255,255,0.06)',
                  boxShadow: name ? '0 0 16px rgba(91,155,245,0.08)' : 'none',
                }}
                dir="rtl"
              />
            </div>

            {/* Launch button */}
            <SpaceButton
              variant="success"
              size="lg"
              className="w-full text-xl font-extrabold"
              onClick={handleCreate}
              disabled={!name.trim()}
            >
              🚀 יוצאים להרפתקה!
            </SpaceButton>
          </div>

          {players.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-5"
            >
              <SpaceButton
                variant="ghost"
                className="w-full"
                onClick={() => setMode('choose')}
              >
                ← חזרה לבחירת שחקן
              </SpaceButton>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
