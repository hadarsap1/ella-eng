import type { Sentence } from '../types/game';

export const allSentences: Sentence[] = [
  // 2-word sentences
  { english: "The cat sat.", hebrew: "החתול ישב.", words: ["the", "cat", "sat"] },
  { english: "I am big.", hebrew: "אני גדול.", words: ["i", "am", "big"] },
  { english: "A red hat.", hebrew: "כובע אדום.", words: ["a", "red", "hat"] },
  { english: "The dog ran.", hebrew: "הכלב רץ.", words: ["the", "dog", "ran"] },
  { english: "It is hot.", hebrew: "זה חם.", words: ["it", "is", "hot"] },
  { english: "I can run.", hebrew: "אני יכול לרוץ.", words: ["i", "can", "run"] },
  { english: "The sun is up.", hebrew: "השמש למעלה.", words: ["the", "sun", "is", "up"] },
  { english: "A big cat.", hebrew: "חתול גדול.", words: ["a", "big", "cat"] },
  { english: "I am not sad.", hebrew: "אני לא עצוב.", words: ["i", "am", "not", "sad"] },
  { english: "The man ran.", hebrew: "האיש רץ.", words: ["the", "man", "ran"] },

  // Extended sentences
  { english: "A fat cat.", hebrew: "חתול שמן.", words: ["a", "fat", "cat"] },
  { english: "The big dog.", hebrew: "הכלב הגדול.", words: ["the", "big", "dog"] },
  { english: "I can sit.", hebrew: "אני יכול לשבת.", words: ["i", "can", "sit"] },
  { english: "A red bed.", hebrew: "מיטה אדומה.", words: ["a", "red", "bed"] },
  { english: "The pig sat.", hebrew: "החזיר ישב.", words: ["the", "pig", "sat"] },
  { english: "I am fun.", hebrew: "אני כיפי.", words: ["i", "am", "fun"] },
  { english: "A big box.", hebrew: "קופסה גדולה.", words: ["a", "big", "box"] },
  { english: "The fox ran.", hebrew: "השועל רץ.", words: ["the", "fox", "ran"] },
  { english: "I got a hat.", hebrew: "קיבלתי כובע.", words: ["i", "got", "a", "hat"] },
  { english: "It is not hot.", hebrew: "זה לא חם.", words: ["it", "is", "not", "hot"] },
  { english: "The hen is red.", hebrew: "התרנגולת אדומה.", words: ["the", "hen", "is", "red"] },
  { english: "I can dig.", hebrew: "אני יכול לחפור.", words: ["i", "can", "dig"] },
  { english: "A big fish.", hebrew: "דג גדול.", words: ["a", "big", "fish"] },
  { english: "The rat ran.", hebrew: "החולדה רצה.", words: ["the", "rat", "ran"] },
  { english: "I am six.", hebrew: "אני בן שש.", words: ["i", "am", "six"] },
  { english: "A hot dog.", hebrew: "נקניקייה.", words: ["a", "hot", "dog"] },
  { english: "The cup is red.", hebrew: "הכוס אדומה.", words: ["the", "cup", "is", "red"] },
  { english: "I can jump.", hebrew: "אני יכול לקפוץ.", words: ["i", "can", "jump"] },
  { english: "A big hand.", hebrew: "יד גדולה.", words: ["a", "big", "hand"] },
  { english: "The duck sat.", hebrew: "הברווז ישב.", words: ["the", "duck", "sat"] },
  { english: "I am not big.", hebrew: "אני לא גדול.", words: ["i", "am", "not", "big"] },
  { english: "A pink hat.", hebrew: "כובע ורוד.", words: ["a", "pink", "hat"] },
  { english: "The king sat.", hebrew: "המלך ישב.", words: ["the", "king", "sat"] },
  { english: "I can look.", hebrew: "אני יכול להסתכל.", words: ["i", "can", "look"] },
  { english: "A tall man.", hebrew: "איש גבוה.", words: ["a", "tall", "man"] },
  { english: "The bird sang.", hebrew: "הציפור שרה.", words: ["the", "bird", "sang"] },
  { english: "I am happy.", hebrew: "אני שמח.", words: ["i", "am", "happy"] },
  { english: "A big ring.", hebrew: "טבעת גדולה.", words: ["a", "big", "ring"] },
  { english: "The girl ran.", hebrew: "הילדה רצה.", words: ["the", "girl", "ran"] },
  { english: "I got a dog.", hebrew: "קיבלתי כלב.", words: ["i", "got", "a", "dog"] },
  { english: "A red fox.", hebrew: "שועל אדום.", words: ["a", "red", "fox"] },
  { english: "It is fun.", hebrew: "זה כיף.", words: ["it", "is", "fun"] },
  { english: "The bat is big.", hebrew: "העטלף גדול.", words: ["the", "bat", "is", "big"] },
  { english: "I can fix it.", hebrew: "אני יכול לתקן.", words: ["i", "can", "fix", "it"] },
  { english: "A fat pig.", hebrew: "חזיר שמן.", words: ["a", "fat", "pig"] },
  { english: "The fish is big.", hebrew: "הדג גדול.", words: ["the", "fish", "is", "big"] },
  { english: "I got a pen.", hebrew: "קיבלתי עט.", words: ["i", "got", "a", "pen"] },
  { english: "A big wall.", hebrew: "קיר גדול.", words: ["a", "big", "wall"] },
  { english: "The pot is hot.", hebrew: "הסיר חם.", words: ["the", "pot", "is", "hot"] },
  { english: "I can cook.", hebrew: "אני יכול לבשל.", words: ["i", "can", "cook"] },
  { english: "A tall tree.", hebrew: "עץ גבוה.", words: ["a", "tall", "tree"] },
  { english: "The frog sat.", hebrew: "הצפרדע ישבה.", words: ["the", "frog", "sat"] },
  { english: "I am a king.", hebrew: "אני מלך.", words: ["i", "am", "a", "king"] },
  { english: "A big ship.", hebrew: "ספינה גדולה.", words: ["a", "big", "ship"] },
  { english: "The ball is red.", hebrew: "הכדור אדום.", words: ["the", "ball", "is", "red"] },
  { english: "I got a book.", hebrew: "קיבלתי ספר.", words: ["i", "got", "a", "book"] },
  { english: "A fat hen.", hebrew: "תרנגולת שמנה.", words: ["a", "fat", "hen"] },
  { english: "The fan is on.", hebrew: "המאוורר דולק.", words: ["the", "fan", "is", "on"] },
  { english: "I can sing.", hebrew: "אני יכול לשיר.", words: ["i", "can", "sing"] },
  { english: "A hot sun.", hebrew: "שמש חמה.", words: ["a", "hot", "sun"] },
  { english: "The milk is in.", hebrew: "החלב בפנים.", words: ["the", "milk", "is", "in"] },
  { english: "I got a van.", hebrew: "קיבלתי טנדר.", words: ["i", "got", "a", "van"] },
  { english: "A big duck.", hebrew: "ברווז גדול.", words: ["a", "big", "duck"] },
  { english: "The dog got up.", hebrew: "הכלב קם.", words: ["the", "dog", "got", "up"] },
  { english: "I can mix it.", hebrew: "אני יכול לערבב.", words: ["i", "can", "mix", "it"] },
  { english: "A red truck.", hebrew: "משאית אדומה.", words: ["a", "red", "truck"] },
  { english: "It is a zoo.", hebrew: "זה גן חיות.", words: ["it", "is", "a", "zoo"] },
  { english: "The nut is big.", hebrew: "האגוז גדול.", words: ["the", "nut", "is", "big"] },
  { english: "I got a fig.", hebrew: "קיבלתי תאנה.", words: ["i", "got", "a", "fig"] },
  { english: "A big band.", hebrew: "להקה גדולה.", words: ["a", "big", "band"] },
  { english: "The dog is fun.", hebrew: "הכלב כיפי.", words: ["the", "dog", "is", "fun"] },
  { english: "I can run up.", hebrew: "אני יכול לרוץ למעלה.", words: ["i", "can", "run", "up"] },
  { english: "A fat bug.", hebrew: "חרק שמן.", words: ["a", "fat", "bug"] },
  { english: "The sand is hot.", hebrew: "החול חם.", words: ["the", "sand", "is", "hot"] },
  { english: "I am not fat.", hebrew: "אני לא שמן.", words: ["i", "am", "not", "fat"] },
  { english: "A big hut.", hebrew: "בקתה גדולה.", words: ["a", "big", "hut"] },
  { english: "The cat is in.", hebrew: "החתול בפנים.", words: ["the", "cat", "is", "in"] },
  { english: "I got a cup.", hebrew: "קיבלתי כוס.", words: ["i", "got", "a", "cup"] },
  { english: "A pink ring.", hebrew: "טבעת ורודה.", words: ["a", "pink", "ring"] },
  { english: "The ship is big.", hebrew: "הספינה גדולה.", words: ["the", "ship", "is", "big"] },
  { english: "I can cut it.", hebrew: "אני יכול לחתוך.", words: ["i", "can", "cut", "it"] },
  { english: "A big land.", hebrew: "ארץ גדולה.", words: ["a", "big", "land"] },
  { english: "The man is tall.", hebrew: "האיש גבוה.", words: ["the", "man", "is", "tall"] },
];

export function getAvailableSentences(selectedLetters: string[]): Sentence[] {
  const lower = selectedLetters.map(l => l.toLowerCase());
  const commonWords = ['the', 'a', 'i', 'is', 'am', 'it', 'in', 'on', 'up', 'not', 'of', 'an', 'as', 'at'];

  return allSentences.filter(sentence =>
    sentence.words.every(word => {
      if (commonWords.includes(word.toLowerCase())) return true;
      const letters = word.toLowerCase().split('');
      return letters.every(l => lower.includes(l));
    })
  );
}
