import { useMemo } from 'react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { getAvailableWords, getAvailablePairs } from '../data/words';
import { getAvailableSentences } from '../data/sentences';

export function useWordFilter() {
  const player = usePlayerStore(s => s.activePlayer());
  const letters = player?.selectedLetters ?? [];

  const words = useMemo(() => getAvailableWords(letters), [letters]);
  const pairs = useMemo(() => getAvailablePairs(letters), [letters]);
  const sentences = useMemo(() => getAvailableSentences(letters), [letters]);

  return { words, pairs, sentences, letters };
}
