import { useCallback } from 'react';
import { playCorrect, playWrong, playClick, playStreak, playLevelUp, playLaunch } from '../lib/audio';

export function useSoundEffects() {
  return {
    playCorrect: useCallback(playCorrect, []),
    playWrong: useCallback(playWrong, []),
    playClick: useCallback(playClick, []),
    playStreak: useCallback(playStreak, []),
    playLevelUp: useCallback(playLevelUp, []),
    playLaunch: useCallback(playLaunch, []),
  };
}
