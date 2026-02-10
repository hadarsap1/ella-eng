// ========== Web Audio Context (sound effects) ==========

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') {
    ctx.resume().catch(e => console.warn('[audio] resume failed:', e));
  }
  return ctx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', gain = 0.5) {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, c.currentTime);
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + duration);
    osc.connect(g);
    g.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration);
  } catch (e) {
    console.warn('[audio] playTone error:', e);
  }
}

export function playCorrect() {
  playTone(880, 0.15, 'sine', 0.4);
  setTimeout(() => playTone(1100, 0.2, 'sine', 0.4), 100);
}

export function playWrong() {
  playTone(200, 0.3, 'sawtooth', 0.3);
}

export function playClick() {
  playTone(600, 0.08, 'sine', 0.2);
}

export function playStreak() {
  playTone(523, 0.1, 'sine', 0.4);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.4), 80);
  setTimeout(() => playTone(784, 0.1, 'sine', 0.4), 160);
  setTimeout(() => playTone(1047, 0.2, 'sine', 0.4), 240);
}

export function playLevelUp() {
  [523, 659, 784, 1047, 1319].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.4), i * 120);
  });
}

export function playLaunch() {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, c.currentTime + 1);
    g.gain.setValueAtTime(0.4, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 1);
    osc.connect(g);
    g.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 1);
  } catch (e) {
    console.warn('[audio] playLaunch error:', e);
  }
}

// ========== Unlock audio on first user interaction ==========
// Browsers block AudioContext and speechSynthesis until a user gesture.
// This one-time listener primes both systems on the first click/touch/key.

let unlocked = false;

function unlock() {
  if (unlocked) return;
  unlocked = true;

  // 1. Create & resume AudioContext
  try {
    const c = getCtx();
    if (c.state === 'suspended') c.resume();
  } catch { /* ignore */ }

  // 2. Prime speechSynthesis with a silent utterance (unlocks it for future use)
  try {
    if (window.speechSynthesis) {
      const warmup = new SpeechSynthesisUtterance('');
      warmup.volume = 0;
      window.speechSynthesis.speak(warmup);
    }
  } catch { /* ignore */ }

  document.removeEventListener('click', unlock, true);
  document.removeEventListener('touchstart', unlock, true);
  document.removeEventListener('keydown', unlock, true);
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', unlock, true);
  document.addEventListener('touchstart', unlock, true);
  document.addEventListener('keydown', unlock, true);
}

// ========== Text-to-Speech ==========
// Uses Google Dictionary Oxford pronunciation audio (confirmed working).
// Falls back to speechSynthesis if dictionary audio unavailable.
// For multi-word text (sentences), splits into individual words.

const DICT_URL = 'https://ssl.gstatic.com/dictionary/static/sounds/oxford';

// Cache Audio objects to avoid re-downloading the same word
const audioCache = new Map<string, HTMLAudioElement>();

function playDictWord(word: string): Promise<boolean> {
  return new Promise((resolve) => {
    const key = word.toLowerCase().trim();
    if (!key) { resolve(false); return; }

    // Check cache
    const cached = audioCache.get(key);
    if (cached) {
      const clone = cached.cloneNode() as HTMLAudioElement;
      clone.volume = 1;
      clone.onended = () => resolve(true);
      clone.onerror = () => resolve(false);
      clone.play().catch(() => resolve(false));
      return;
    }

    const url = `${DICT_URL}/${key}--_us_1.mp3`;
    const audio = new Audio(url);
    audio.volume = 1;

    audio.oncanplaythrough = () => {
      audioCache.set(key, audio);
      audio.play().catch(() => resolve(false));
    };
    audio.onended = () => resolve(true);
    audio.onerror = () => resolve(false);
    audio.load();

    // Timeout after 4s
    setTimeout(() => resolve(false), 4000);
  });
}

export async function speak(text: string, _lang = 'en-US'): Promise<void> {
  if (typeof window === 'undefined') return;

  const words = text.toLowerCase().trim().split(/\s+/);

  // For single words, play directly
  if (words.length === 1) {
    const ok = await playDictWord(words[0]);
    if (!ok) {
      // Fallback: try speechSynthesis
      await speakNativeFallback(text);
    }
    return;
  }

  // For sentences, play words sequentially with short pauses
  for (const word of words) {
    const ok = await playDictWord(word);
    if (!ok) {
      // Skip words not in dictionary
    }
    // Small pause between words
    await new Promise(r => setTimeout(r, 150));
  }
}

// Last resort fallback to native speechSynthesis
// Window property prevents Chrome from GC-ing the utterance mid-speech
function speakNativeFallback(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      (window as unknown as Record<string, unknown>).__ttsGuard = u;
      u.lang = 'en-US';
      u.rate = 0.85;
      u.volume = 1;
      u.onend = () => { (window as unknown as Record<string, unknown>).__ttsGuard = null; resolve(); };
      u.onerror = () => { (window as unknown as Record<string, unknown>).__ttsGuard = null; resolve(); };
      window.speechSynthesis.speak(u);
      setTimeout(() => { (window as unknown as Record<string, unknown>).__ttsGuard = null; resolve(); }, 5000);
    } catch {
      resolve();
    }
  });
}
