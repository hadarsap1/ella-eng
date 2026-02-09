export interface Word {
  english: string;
  hebrew: string;
  letters: string[];
  image?: string;
}

export interface WordPair {
  words: [Word, Word];
  difference: string;
}

export interface Sentence {
  english: string;
  hebrew: string;
  words: string[];
}

export type GameId =
  | 'planet-of-words'
  | 'memory-nebula'
  | 'sound-twins'
  | 'sentence-station'
  | 'listening-asteroid'
  | 'word-builder';

export interface GameInfo {
  id: GameId;
  name: string;
  nameHe: string;
  description: string;
  icon: string;
  color: string;
  minWords: number;
}

export interface GameResult {
  gameId: GameId;
  correct: number;
  total: number;
  xpEarned: number;
  streak: number;
  timestamp: number;
  wordsPlayed: string[];
}

export interface Level {
  level: number;
  title: string;
  xpRequired: number;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (player: Player) => boolean;
}

export interface Player {
  id: string;
  name: string;
  avatarIndex: number;
  xp: number;
  selectedLetters: string[];
  gameResults: GameResult[];
  achievements: string[];
  createdAt: number;
}

export interface GameSession {
  gameId: GameId;
  words: Word[];
  currentIndex: number;
  correct: number;
  total: number;
  streak: number;
  maxStreak: number;
  startTime: number;
}
