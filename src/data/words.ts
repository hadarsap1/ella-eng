import type { Word, WordPair } from '../types/game';

export const allWords: Word[] = [
  // Simple 2-3 letter words
  { english: "at", hebrew: "ב-", letters: ["a", "t"] },
  { english: "an", hebrew: "אחד", letters: ["a", "n"] },
  { english: "am", hebrew: "אני", letters: ["a", "m"] },
  { english: "as", hebrew: "כמו", letters: ["a", "s"] },
  { english: "it", hebrew: "זה", letters: ["i", "t"] },
  { english: "in", hebrew: "בתוך", letters: ["i", "n"] },
  { english: "is", hebrew: "הוא/היא", letters: ["i", "s"] },
  { english: "if", hebrew: "אם", letters: ["i", "f"] },
  { english: "on", hebrew: "על", letters: ["o", "n"] },
  { english: "of", hebrew: "של", letters: ["o", "f"] },
  { english: "up", hebrew: "למעלה", letters: ["u", "p"] },
  { english: "us", hebrew: "אותנו", letters: ["u", "s"] },

  // CVC - "at" family
  { english: "cat", hebrew: "חתול", letters: ["c", "a", "t"] },
  { english: "bat", hebrew: "עטלף", letters: ["b", "a", "t"] },
  { english: "hat", hebrew: "כובע", letters: ["h", "a", "t"] },
  { english: "mat", hebrew: "מחצלת", letters: ["m", "a", "t"] },
  { english: "rat", hebrew: "חולדה", letters: ["r", "a", "t"] },
  { english: "sat", hebrew: "ישב", letters: ["s", "a", "t"] },
  { english: "fat", hebrew: "שמן", letters: ["f", "a", "t"] },
  { english: "pat", hebrew: "לטפוח", letters: ["p", "a", "t"] },

  // CVC - "og" family
  { english: "dog", hebrew: "כלב", letters: ["d", "o", "g"] },
  { english: "log", hebrew: "בול עץ", letters: ["l", "o", "g"] },
  { english: "fog", hebrew: "ערפל", letters: ["f", "o", "g"] },
  { english: "jog", hebrew: "לרוץ לאט", letters: ["j", "o", "g"] },
  { english: "hog", hebrew: "חזיר גדול", letters: ["h", "o", "g"] },

  // CVC - "an" family
  { english: "man", hebrew: "איש", letters: ["m", "a", "n"] },
  { english: "men", hebrew: "אנשים", letters: ["m", "e", "n"] },
  { english: "can", hebrew: "יכול", letters: ["c", "a", "n"] },
  { english: "pan", hebrew: "מחבת", letters: ["p", "a", "n"] },
  { english: "fan", hebrew: "מאוורר", letters: ["f", "a", "n"] },
  { english: "ran", hebrew: "רץ", letters: ["r", "a", "n"] },
  { english: "van", hebrew: "טנדר", letters: ["v", "a", "n"] },
  { english: "tan", hebrew: "שיזוף", letters: ["t", "a", "n"] },

  // CVC - "en" family
  { english: "pen", hebrew: "עט", letters: ["p", "e", "n"] },
  { english: "ten", hebrew: "עשר", letters: ["t", "e", "n"] },
  { english: "hen", hebrew: "תרנגולת", letters: ["h", "e", "n"] },
  { english: "den", hebrew: "מאורה", letters: ["d", "e", "n"] },

  // CVC - "ed" family
  { english: "bed", hebrew: "מיטה", letters: ["b", "e", "d"] },
  { english: "red", hebrew: "אדום", letters: ["r", "e", "d"] },
  { english: "led", hebrew: "הוביל", letters: ["l", "e", "d"] },

  // CVC - "ig" family
  { english: "big", hebrew: "גדול", letters: ["b", "i", "g"] },
  { english: "pig", hebrew: "חזיר", letters: ["p", "i", "g"] },
  { english: "dig", hebrew: "לחפור", letters: ["d", "i", "g"] },
  { english: "wig", hebrew: "פאה", letters: ["w", "i", "g"] },
  { english: "fig", hebrew: "תאנה", letters: ["f", "i", "g"] },

  // CVC - "ot" family
  { english: "hot", hebrew: "חם", letters: ["h", "o", "t"] },
  { english: "pot", hebrew: "סיר", letters: ["p", "o", "t"] },
  { english: "dot", hebrew: "נקודה", letters: ["d", "o", "t"] },
  { english: "got", hebrew: "קיבל", letters: ["g", "o", "t"] },
  { english: "lot", hebrew: "הרבה", letters: ["l", "o", "t"] },
  { english: "not", hebrew: "לא", letters: ["n", "o", "t"] },

  // CVC - "up/ut" family
  { english: "cup", hebrew: "כוס", letters: ["c", "u", "p"] },
  { english: "pup", hebrew: "גור", letters: ["p", "u", "p"] },
  { english: "cut", hebrew: "לחתוך", letters: ["c", "u", "t"] },
  { english: "but", hebrew: "אבל", letters: ["b", "u", "t"] },
  { english: "nut", hebrew: "אגוז", letters: ["n", "u", "t"] },
  { english: "hut", hebrew: "בקתה", letters: ["h", "u", "t"] },

  // CVC - "un" family
  { english: "sun", hebrew: "שמש", letters: ["s", "u", "n"] },
  { english: "run", hebrew: "לרוץ", letters: ["r", "u", "n"] },
  { english: "fun", hebrew: "כיף", letters: ["f", "u", "n"] },
  { english: "bun", hebrew: "לחמנייה", letters: ["b", "u", "n"] },
  { english: "gun", hebrew: "אקדח", letters: ["g", "u", "n"] },

  // CVC - "ox/ix" family
  { english: "box", hebrew: "קופסה", letters: ["b", "o", "x"] },
  { english: "fox", hebrew: "שועל", letters: ["f", "o", "x"] },
  { english: "six", hebrew: "שש", letters: ["s", "i", "x"] },
  { english: "mix", hebrew: "לערבב", letters: ["m", "i", "x"] },
  { english: "fix", hebrew: "לתקן", letters: ["f", "i", "x"] },

  // CVC - misc
  { english: "yes", hebrew: "כן", letters: ["y", "e", "s"] },
  { english: "yet", hebrew: "עדיין", letters: ["y", "e", "t"] },
  { english: "zip", hebrew: "רוכסן", letters: ["z", "i", "p"] },
  { english: "zoo", hebrew: "גן חיות", letters: ["z", "o", "o"] },

  // 4 letter words - "ook" family
  { english: "book", hebrew: "ספר", letters: ["b", "o", "o", "k"] },
  { english: "look", hebrew: "להסתכל", letters: ["l", "o", "o", "k"] },
  { english: "cook", hebrew: "לבשל", letters: ["c", "o", "o", "k"] },
  { english: "hook", hebrew: "וו", letters: ["h", "o", "o", "k"] },

  // "all" family
  { english: "ball", hebrew: "כדור", letters: ["b", "a", "l", "l"] },
  { english: "tall", hebrew: "גבוה", letters: ["t", "a", "l", "l"] },
  { english: "call", hebrew: "לקרוא", letters: ["c", "a", "l", "l"] },
  { english: "fall", hebrew: "ליפול", letters: ["f", "a", "l", "l"] },
  { english: "wall", hebrew: "קיר", letters: ["w", "a", "l", "l"] },

  // "ee" family
  { english: "tree", hebrew: "עץ", letters: ["t", "r", "e", "e"] },
  { english: "free", hebrew: "חופשי", letters: ["f", "r", "e", "e"] },

  // "ish" family
  { english: "fish", hebrew: "דג", letters: ["f", "i", "s", "h"] },
  { english: "dish", hebrew: "צלחת", letters: ["d", "i", "s", "h"] },
  { english: "wish", hebrew: "משאלה", letters: ["w", "i", "s", "h"] },

  // "op" family
  { english: "ship", hebrew: "ספינה", letters: ["s", "h", "i", "p"] },
  { english: "shop", hebrew: "חנות", letters: ["s", "h", "o", "p"] },
  { english: "stop", hebrew: "לעצור", letters: ["s", "t", "o", "p"] },

  // misc 4-letter
  { english: "frog", hebrew: "צפרדע", letters: ["f", "r", "o", "g"] },
  { english: "from", hebrew: "מ-", letters: ["f", "r", "o", "m"] },

  // "and" family
  { english: "hand", hebrew: "יד", letters: ["h", "a", "n", "d"] },
  { english: "sand", hebrew: "חול", letters: ["s", "a", "n", "d"] },
  { english: "land", hebrew: "ארץ", letters: ["l", "a", "n", "d"] },
  { english: "band", hebrew: "להקה", letters: ["b", "a", "n", "d"] },

  // misc
  { english: "bird", hebrew: "ציפור", letters: ["b", "i", "r", "d"] },
  { english: "girl", hebrew: "ילדה", letters: ["g", "i", "r", "l"] },
  { english: "milk", hebrew: "חלב", letters: ["m", "i", "l", "k"] },
  { english: "silk", hebrew: "משי", letters: ["s", "i", "l", "k"] },
  { english: "jump", hebrew: "לקפוץ", letters: ["j", "u", "m", "p"] },
  { english: "just", hebrew: "רק", letters: ["j", "u", "s", "t"] },

  // "ing" family
  { english: "king", hebrew: "מלך", letters: ["k", "i", "n", "g"] },
  { english: "ring", hebrew: "טבעת", letters: ["r", "i", "n", "g"] },
  { english: "sing", hebrew: "לשיר", letters: ["s", "i", "n", "g"] },
  { english: "wing", hebrew: "כנף", letters: ["w", "i", "n", "g"] },

  // "uck" family
  { english: "duck", hebrew: "ברווז", letters: ["d", "u", "c", "k"] },
  { english: "luck", hebrew: "מזל", letters: ["l", "u", "c", "k"] },
  { english: "truck", hebrew: "משאית", letters: ["t", "r", "u", "c", "k"] },

  // "ink" family
  { english: "pink", hebrew: "ורוד", letters: ["p", "i", "n", "k"] },
  { english: "think", hebrew: "לחשוב", letters: ["t", "h", "i", "n", "k"] },

  // CVC - "ad" family
  { english: "bad", hebrew: "רע", letters: ["b", "a", "d"] },
  { english: "sad", hebrew: "עצוב", letters: ["s", "a", "d"] },

  // CVC - "ag" family
  { english: "bag", hebrew: "תיק", letters: ["b", "a", "g"] },

  // CVC - "eg" family
  { english: "beg", hebrew: "להתחנן", letters: ["b", "e", "g"] },
  { english: "peg", hebrew: "יתד", letters: ["p", "e", "g"] },

  // CVC - "ap" family
  { english: "cap", hebrew: "כיפה", letters: ["c", "a", "p"] },
  { english: "map", hebrew: "מפה", letters: ["m", "a", "p"] },
  { english: "tap", hebrew: "ברז", letters: ["t", "a", "p"] },

  // CVC - "op" family
  { english: "mop", hebrew: "מגב", letters: ["m", "o", "p"] },
  { english: "top", hebrew: "חלק עליון", letters: ["t", "o", "p"] },
  { english: "hop", hebrew: "לדלג", letters: ["h", "o", "p"] },
  { english: "cop", hebrew: "שוטר", letters: ["c", "o", "p"] },

  // CVC - "ip" family
  { english: "hip", hebrew: "ירך", letters: ["h", "i", "p"] },

  // CVC - "it" family
  { english: "sit", hebrew: "לשבת", letters: ["s", "i", "t"] },
  { english: "hit", hebrew: "להכות", letters: ["h", "i", "t"] },
  { english: "bit", hebrew: "קצת", letters: ["b", "i", "t"] },
  { english: "pit", hebrew: "בור", letters: ["p", "i", "t"] },

  // CVC - "et" family
  { english: "pet", hebrew: "חיית מחמד", letters: ["p", "e", "t"] },
  { english: "set", hebrew: "לקבוע", letters: ["s", "e", "t"] },

  // CVC - "in" family
  { english: "pin", hebrew: "סיכה", letters: ["p", "i", "n"] },
  { english: "tin", hebrew: "פח", letters: ["t", "i", "n"] },

  // CVC - "on" family
  { english: "son", hebrew: "בן", letters: ["s", "o", "n"] },

  // CVC - "ug/og" family
  { english: "bug", hebrew: "חרק", letters: ["b", "u", "g"] },
  { english: "bog", hebrew: "ביצה", letters: ["b", "o", "g"] },

  // CVC - "ot" extras
  { english: "bot", hebrew: "רובוט", letters: ["b", "o", "t"] },

  // Past tense / misc used in sentences
  { english: "sang", hebrew: "שר", letters: ["s", "a", "n", "g"] },

  // 5+ letter words
  { english: "apple", hebrew: "תפוח", letters: ["a", "p", "p", "l", "e"] },
  { english: "happy", hebrew: "שמח", letters: ["h", "a", "p", "p", "y"] },
];

export const similarWordPairs: WordPair[] = [
  // Vowel changes - a/e
  { words: [{ english: "man", hebrew: "איש", letters: ["m", "a", "n"] }, { english: "men", hebrew: "אנשים", letters: ["m", "e", "n"] }], difference: "a/e" },
  { words: [{ english: "pan", hebrew: "מחבת", letters: ["p", "a", "n"] }, { english: "pen", hebrew: "עט", letters: ["p", "e", "n"] }], difference: "a/e" },
  { words: [{ english: "bad", hebrew: "רע", letters: ["b", "a", "d"] }, { english: "bed", hebrew: "מיטה", letters: ["b", "e", "d"] }], difference: "a/e" },
  { words: [{ english: "bag", hebrew: "תיק", letters: ["b", "a", "g"] }, { english: "beg", hebrew: "להתחנן", letters: ["b", "e", "g"] }], difference: "a/e" },
  // a/u
  { words: [{ english: "cat", hebrew: "חתול", letters: ["c", "a", "t"] }, { english: "cut", hebrew: "לחתוך", letters: ["c", "u", "t"] }], difference: "a/u" },
  { words: [{ english: "bat", hebrew: "עטלף", letters: ["b", "a", "t"] }, { english: "but", hebrew: "אבל", letters: ["b", "u", "t"] }], difference: "a/u" },
  { words: [{ english: "cap", hebrew: "כיפה", letters: ["c", "a", "p"] }, { english: "cup", hebrew: "כוס", letters: ["c", "u", "p"] }], difference: "a/u" },
  { words: [{ english: "ran", hebrew: "רץ", letters: ["r", "a", "n"] }, { english: "run", hebrew: "לרוץ", letters: ["r", "u", "n"] }], difference: "a/u" },
  // o/a
  { words: [{ english: "hot", hebrew: "חם", letters: ["h", "o", "t"] }, { english: "hat", hebrew: "כובע", letters: ["h", "a", "t"] }], difference: "o/a" },
  { words: [{ english: "pot", hebrew: "סיר", letters: ["p", "o", "t"] }, { english: "pat", hebrew: "לטפוח", letters: ["p", "a", "t"] }], difference: "o/a" },
  { words: [{ english: "mop", hebrew: "מגב", letters: ["m", "o", "p"] }, { english: "map", hebrew: "מפה", letters: ["m", "a", "p"] }], difference: "o/a" },
  { words: [{ english: "top", hebrew: "למעלה", letters: ["t", "o", "p"] }, { english: "tap", hebrew: "ברז", letters: ["t", "a", "p"] }], difference: "o/a" },
  // i/a
  { words: [{ english: "big", hebrew: "גדול", letters: ["b", "i", "g"] }, { english: "bag", hebrew: "תיק", letters: ["b", "a", "g"] }], difference: "i/a" },
  { words: [{ english: "sit", hebrew: "לשבת", letters: ["s", "i", "t"] }, { english: "sat", hebrew: "ישב", letters: ["s", "a", "t"] }], difference: "i/a" },
  { words: [{ english: "hit", hebrew: "להכות", letters: ["h", "i", "t"] }, { english: "hat", hebrew: "כובע", letters: ["h", "a", "t"] }], difference: "i/a" },
  { words: [{ english: "pin", hebrew: "סיכה", letters: ["p", "i", "n"] }, { english: "pan", hebrew: "מחבת", letters: ["p", "a", "n"] }], difference: "i/a" },
  // i/e
  { words: [{ english: "pig", hebrew: "חזיר", letters: ["p", "i", "g"] }, { english: "peg", hebrew: "יתד", letters: ["p", "e", "g"] }], difference: "i/e" },
  { words: [{ english: "pit", hebrew: "בור", letters: ["p", "i", "t"] }, { english: "pet", hebrew: "חיית מחמד", letters: ["p", "e", "t"] }], difference: "i/e" },
  { words: [{ english: "sit", hebrew: "לשבת", letters: ["s", "i", "t"] }, { english: "set", hebrew: "לקבוע", letters: ["s", "e", "t"] }], difference: "i/e" },
  { words: [{ english: "tin", hebrew: "פח", letters: ["t", "i", "n"] }, { english: "ten", hebrew: "עשר", letters: ["t", "e", "n"] }], difference: "i/e" },
  // u/o
  { words: [{ english: "sun", hebrew: "שמש", letters: ["s", "u", "n"] }, { english: "son", hebrew: "בן", letters: ["s", "o", "n"] }], difference: "u/o" },
  { words: [{ english: "cup", hebrew: "כוס", letters: ["c", "u", "p"] }, { english: "cop", hebrew: "שוטר", letters: ["c", "o", "p"] }], difference: "u/o" },
  { words: [{ english: "bug", hebrew: "חרק", letters: ["b", "u", "g"] }, { english: "bog", hebrew: "ביצה", letters: ["b", "o", "g"] }], difference: "u/o" },
  { words: [{ english: "hut", hebrew: "בקתה", letters: ["h", "u", "t"] }, { english: "hot", hebrew: "חם", letters: ["h", "o", "t"] }], difference: "u/o" },
  // i/o
  { words: [{ english: "ship", hebrew: "ספינה", letters: ["s", "h", "i", "p"] }, { english: "shop", hebrew: "חנות", letters: ["s", "h", "o", "p"] }], difference: "i/o" },
  { words: [{ english: "hip", hebrew: "ירך", letters: ["h", "i", "p"] }, { english: "hop", hebrew: "לקפוץ", letters: ["h", "o", "p"] }], difference: "i/o" },
  { words: [{ english: "bit", hebrew: "קצת", letters: ["b", "i", "t"] }, { english: "bot", hebrew: "רובוט", letters: ["b", "o", "t"] }], difference: "i/o" },
  // Consonant changes
  { words: [{ english: "fish", hebrew: "דג", letters: ["f", "i", "s", "h"] }, { english: "dish", hebrew: "צלחת", letters: ["d", "i", "s", "h"] }], difference: "f/d" },
  { words: [{ english: "cat", hebrew: "חתול", letters: ["c", "a", "t"] }, { english: "bat", hebrew: "עטלף", letters: ["b", "a", "t"] }], difference: "c/b" },
  { words: [{ english: "dog", hebrew: "כלב", letters: ["d", "o", "g"] }, { english: "fog", hebrew: "ערפל", letters: ["f", "o", "g"] }], difference: "d/f" },
  { words: [{ english: "hat", hebrew: "כובע", letters: ["h", "a", "t"] }, { english: "mat", hebrew: "מחצלת", letters: ["m", "a", "t"] }], difference: "h/m" },
  { words: [{ english: "fan", hebrew: "מאוורר", letters: ["f", "a", "n"] }, { english: "van", hebrew: "טנדר", letters: ["v", "a", "n"] }], difference: "f/v" },
  { words: [{ english: "ball", hebrew: "כדור", letters: ["b", "a", "l", "l"] }, { english: "call", hebrew: "לקרוא", letters: ["c", "a", "l", "l"] }], difference: "b/c" },
  { words: [{ english: "fall", hebrew: "ליפול", letters: ["f", "a", "l", "l"] }, { english: "wall", hebrew: "קיר", letters: ["w", "a", "l", "l"] }], difference: "f/w" },
  { words: [{ english: "king", hebrew: "מלך", letters: ["k", "i", "n", "g"] }, { english: "ring", hebrew: "טבעת", letters: ["r", "i", "n", "g"] }], difference: "k/r" },
  { words: [{ english: "sing", hebrew: "לשיר", letters: ["s", "i", "n", "g"] }, { english: "wing", hebrew: "כנף", letters: ["w", "i", "n", "g"] }], difference: "s/w" },
  { words: [{ english: "log", hebrew: "בול עץ", letters: ["l", "o", "g"] }, { english: "jog", hebrew: "לרוץ", letters: ["j", "o", "g"] }], difference: "l/j" },
  { words: [{ english: "red", hebrew: "אדום", letters: ["r", "e", "d"] }, { english: "bed", hebrew: "מיטה", letters: ["b", "e", "d"] }], difference: "r/b" },
  { words: [{ english: "box", hebrew: "קופסה", letters: ["b", "o", "x"] }, { english: "fox", hebrew: "שועל", letters: ["f", "o", "x"] }], difference: "b/f" },
  { words: [{ english: "six", hebrew: "שש", letters: ["s", "i", "x"] }, { english: "mix", hebrew: "לערבב", letters: ["m", "i", "x"] }], difference: "s/m" },
];

export function getAvailableWords(selectedLetters: string[]): Word[] {
  const lower = selectedLetters.map(l => l.toLowerCase());
  return allWords.filter(w => w.letters.every(l => lower.includes(l.toLowerCase())));
}

export function getAvailablePairs(selectedLetters: string[]): WordPair[] {
  const lower = selectedLetters.map(l => l.toLowerCase());
  return similarWordPairs.filter(p =>
    p.words.every(w => w.letters.every(l => lower.includes(l.toLowerCase())))
  );
}
