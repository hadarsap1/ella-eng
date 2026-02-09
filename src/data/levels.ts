import type { Level } from '../types/game';

export const levels: Level[] = [
  { level: 1, title: "קאדט חלל", xpRequired: 0, icon: "🌱" },
  { level: 2, title: "חוקר כוכבים", xpRequired: 100, icon: "⭐" },
  { level: 3, title: "טייס חלל", xpRequired: 250, icon: "🚀" },
  { level: 4, title: "נווט גלקטי", xpRequired: 450, icon: "🧭" },
  { level: 5, title: "צייד אסטרואידים", xpRequired: 700, icon: "☄️" },
  { level: 6, title: "מפקד תחנה", xpRequired: 1000, icon: "🛸" },
  { level: 7, title: "גיבור נבולה", xpRequired: 1400, icon: "🌟" },
  { level: 8, title: "אביר כוכבים", xpRequired: 1900, icon: "⚔️" },
  { level: 9, title: "שומר גלקסיה", xpRequired: 2500, icon: "🛡️" },
  { level: 10, title: "מאסטר חלל", xpRequired: 3200, icon: "🎯" },
  { level: 11, title: "אלוף קוסמי", xpRequired: 4000, icon: "🏆" },
  { level: 12, title: "אגדת חלל", xpRequired: 5000, icon: "💫" },
  { level: 13, title: "יוצר עולמות", xpRequired: 6200, icon: "🌌" },
  { level: 14, title: "אל כוכבים", xpRequired: 7600, icon: "👑" },
  { level: 15, title: "נצחי", xpRequired: 9999, icon: "✨" },
];

export function getLevel(xp: number): Level {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xpRequired) return levels[i];
  }
  return levels[0];
}

export function getNextLevel(xp: number): Level | null {
  const current = getLevel(xp);
  const idx = levels.findIndex(l => l.level === current.level);
  return idx < levels.length - 1 ? levels[idx + 1] : null;
}

export function getLevelProgress(xp: number): number {
  const current = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 1;
  return (xp - current.xpRequired) / (next.xpRequired - current.xpRequired);
}
