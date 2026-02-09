import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, GameResult } from '../types/game';
import { achievements } from '../data/achievements';

interface PlayerState {
  players: Player[];
  activePlayerId: string | null;
  activePlayer: () => Player | null;
  createPlayer: (name: string, avatarIndex: number) => string;
  setActivePlayer: (id: string) => void;
  setSelectedLetters: (letters: string[]) => void;
  addGameResult: (result: GameResult) => { xpBefore: number; xpAfter: number; newAchievements: string[] };
  deletePlayer: (id: string) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      players: [],
      activePlayerId: null,

      activePlayer: () => {
        const { players, activePlayerId } = get();
        return players.find(p => p.id === activePlayerId) ?? null;
      },

      createPlayer: (name, avatarIndex) => {
        const id = crypto.randomUUID();
        const player: Player = {
          id,
          name,
          avatarIndex,
          xp: 0,
          selectedLetters: [],
          gameResults: [],
          achievements: [],
          createdAt: Date.now(),
        };
        set(s => ({ players: [...s.players, player], activePlayerId: id }));
        return id;
      },

      setActivePlayer: (id) => set({ activePlayerId: id }),

      setSelectedLetters: (letters) => set(s => ({
        players: s.players.map(p =>
          p.id === s.activePlayerId ? { ...p, selectedLetters: letters } : p
        ),
      })),

      addGameResult: (result) => {
        const player = get().activePlayer();
        if (!player) return { xpBefore: 0, xpAfter: 0, newAchievements: [] };

        const xpBefore = player.xp;
        const xpAfter = xpBefore + result.xpEarned;

        const updatedPlayer: Player = {
          ...player,
          xp: xpAfter,
          gameResults: [...player.gameResults, result],
        };

        // Check achievements
        const newAchievements = achievements
          .filter(a => !updatedPlayer.achievements.includes(a.id) && a.condition(updatedPlayer))
          .map(a => a.id);

        updatedPlayer.achievements = [...updatedPlayer.achievements, ...newAchievements];

        set(s => ({
          players: s.players.map(p => p.id === s.activePlayerId ? updatedPlayer : p),
        }));

        return { xpBefore, xpAfter, newAchievements };
      },

      deletePlayer: (id) => set(s => ({
        players: s.players.filter(p => p.id !== id),
        activePlayerId: s.activePlayerId === id ? null : s.activePlayerId,
      })),
    }),
    { name: 'ellaeng-v2-players' }
  )
);
