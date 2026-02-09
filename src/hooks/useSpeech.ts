import { useCallback } from 'react';
import { speak } from '../lib/audio';

export function useSpeech() {
  const speakWord = useCallback((text: string) => speak(text, 'en-US'), []);
  return { speakWord };
}
