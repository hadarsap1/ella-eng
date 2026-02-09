import type { Achievement } from '../types/game';

export const achievements: Achievement[] = [
  {
    id: 'first-game',
    title: 'משחק ראשון',
    description: 'שיחקת את המשחק הראשון שלך!',
    icon: '🎮',
    condition: (p) => p.gameResults.length >= 1,
  },
  {
    id: 'ten-games',
    title: 'שחקן מנוסה',
    description: 'שיחקת 10 משחקים!',
    icon: '🎲',
    condition: (p) => p.gameResults.length >= 10,
  },
  {
    id: 'fifty-games',
    title: 'ותיק חלל',
    description: 'שיחקת 50 משחקים!',
    icon: '🏅',
    condition: (p) => p.gameResults.length >= 50,
  },
  {
    id: 'perfect-game',
    title: 'מושלם!',
    description: 'סיימת משחק בלי טעויות!',
    icon: '💯',
    condition: (p) => p.gameResults.some(r => r.correct === r.total && r.total >= 5),
  },
  {
    id: 'streak-5',
    title: 'רצף על-חללי',
    description: 'השגת רצף של 5 תשובות נכונות!',
    icon: '🔥',
    condition: (p) => p.gameResults.some(r => r.streak >= 5),
  },
  {
    id: 'streak-10',
    title: 'רצף אגדי',
    description: 'השגת רצף של 10 תשובות נכונות!',
    icon: '⚡',
    condition: (p) => p.gameResults.some(r => r.streak >= 10),
  },
  {
    id: 'all-games',
    title: 'חוקר גלקסיה',
    description: 'שיחקת בכל המשחקים!',
    icon: '🌌',
    condition: (p) => {
      const games = new Set(p.gameResults.map(r => r.gameId));
      return games.size >= 6;
    },
  },
  {
    id: 'level-5',
    title: 'צייד אסטרואידים',
    description: 'הגעת לרמה 5!',
    icon: '☄️',
    condition: (p) => p.xp >= 700,
  },
  {
    id: 'level-10',
    title: 'מאסטר חלל',
    description: 'הגעת לרמה 10!',
    icon: '🎯',
    condition: (p) => p.xp >= 3200,
  },
  {
    id: 'words-50',
    title: 'אוסף מילים',
    description: 'למדת 50 מילים שונות!',
    icon: '📚',
    condition: (p) => {
      const words = new Set(p.gameResults.flatMap(r => r.wordsPlayed));
      return words.size >= 50;
    },
  },
  {
    id: 'words-100',
    title: 'מילון חי',
    description: 'למדת 100 מילים שונות!',
    icon: '📖',
    condition: (p) => {
      const words = new Set(p.gameResults.flatMap(r => r.wordsPlayed));
      return words.size >= 100;
    },
  },
  {
    id: 'accuracy-master',
    title: 'דיוק קוסמי',
    description: 'דיוק של 90%+ ב-20 משחקים',
    icon: '🎯',
    condition: (p) => {
      if (p.gameResults.length < 20) return false;
      const total = p.gameResults.reduce((s, r) => s + r.total, 0);
      const correct = p.gameResults.reduce((s, r) => s + r.correct, 0);
      return total > 0 && correct / total >= 0.9;
    },
  },
];
