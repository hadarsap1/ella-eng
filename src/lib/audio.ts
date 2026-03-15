// ========== Web Audio Context (sound effects) ==========

let ctx: AudioContext | null = null;
let compressor: DynamicsCompressorNode | null = null;

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

// Limiter to prevent clipping when multiple tones overlap (headphone safety)
function getOutput(): AudioNode {
  const c = getCtx();
  if (!compressor) {
    compressor = c.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-6, c.currentTime);
    compressor.ratio.setValueAtTime(4, c.currentTime);
    compressor.connect(c.destination);
  }
  return compressor;
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
    g.connect(getOutput());
    osc.start();
    osc.stop(c.currentTime + duration);
  } catch (e) {
    console.warn('[audio] playTone error:', e);
  }
}

// Warm, gentle "ding-ding" — C5 to E5 major third
export function playCorrect() {
  playTone(523, 0.12, 'sine', 0.3);
  setTimeout(() => playTone(659, 0.18, 'sine', 0.3), 100);
}

// Gentle descending "bonk" — E4 to C4, soft triangle wave
export function playWrong() {
  playTone(330, 0.12, 'triangle', 0.2);
  setTimeout(() => playTone(262, 0.18, 'triangle', 0.2), 120);
}

export function playClick() {
  playTone(600, 0.08, 'sine', 0.15);
}

// C major arpeggio — non-overlapping for clean sound
export function playStreak() {
  playTone(523, 0.1, 'sine', 0.3);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.3), 100);
  setTimeout(() => playTone(784, 0.1, 'sine', 0.3), 200);
  setTimeout(() => playTone(1047, 0.15, 'sine', 0.3), 300);
}

// Extended arpeggio with gentle crescendo
export function playLevelUp() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.25 + i * 0.03), i * 120);
  });
}

// Gentle sine sweep (200-800Hz) — soft rocket whoosh
export function playLaunch() {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.6);
    g.gain.setValueAtTime(0.25, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.6);
    osc.connect(g);
    g.connect(getOutput());
    osc.start();
    osc.stop(c.currentTime + 0.6);
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
      const warmup = new SpeechSynthesisUtterance(' ');
      warmup.volume = 0;
      window.speechSynthesis.speak(warmup);
    }
  } catch { /* ignore */ }

  document.removeEventListener('click', unlock, true);
  document.removeEventListener('touchstart', unlock, true);
  document.removeEventListener('keydown', unlock, true);
  document.removeEventListener('pointerdown', unlock, true);
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', unlock, true);
  document.addEventListener('touchstart', unlock, true);
  document.addEventListener('keydown', unlock, true);
  document.addEventListener('pointerdown', unlock, true);
}

// ========== Text-to-Speech ==========
// Uses Google Dictionary Oxford pronunciation audio (confirmed working).
// Falls back to speechSynthesis if dictionary audio unavailable.
// For multi-word text (sentences), uses native TTS for natural flow.

const DICT_URL = 'https://ssl.gstatic.com/dictionary/static/sounds/oxford';

// Cache Audio objects to avoid re-downloading the same word
const audioCache = new Map<string, HTMLAudioElement>();

function playDictWord(word: string): Promise<boolean> {
  return new Promise((resolve) => {
    const key = word.toLowerCase().trim();
    if (!key) { resolve(false); return; }

    let resolved = false;
    const done = (val: boolean) => { if (!resolved) { resolved = true; resolve(val); } };

    // Check cache
    const cached = audioCache.get(key);
    if (cached) {
      const clone = cached.cloneNode() as HTMLAudioElement;
      clone.volume = 0.85;
      clone.onended = () => done(true);
      clone.onerror = () => done(false);
      clone.play().catch(() => done(false));
      setTimeout(() => done(false), 4000);
      return;
    }

    const url = `${DICT_URL}/${key}--_us_1.mp3`;
    const audio = new Audio(url);
    audio.volume = 0.85;

    audio.oncanplaythrough = () => {
      audioCache.set(key, audio);
      audio.play().catch(() => done(false));
    };
    audio.onended = () => done(true);
    audio.onerror = () => done(false);
    audio.load();

    // Timeout after 4s
    setTimeout(() => done(false), 4000);
  });
}

export async function speak(text: string, _lang = 'en-US'): Promise<void> {
  if (typeof window === 'undefined') return;

  const words = text.toLowerCase().trim().split(/\s+/);

  // For single words, try dictionary audio then fallback
  if (words.length === 1) {
    const ok = await playDictWord(words[0].replace(/[^a-zA-Z'-]/g, ''));
    if (!ok) {
      await speakNativeFallback(text);
    }
    return;
  }

  // For sentences, use native TTS for natural flow and prosody
  await speakNativeFallback(text);
}

// Native speechSynthesis — slower rate for young learners
// Window property prevents Chrome from GC-ing the utterance mid-speech
function speakNativeFallback(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      (window as unknown as Record<string, unknown>).__ttsGuard = u;
      u.lang = 'en-US';
      u.rate = 0.75;
      u.volume = 1;
      u.onend = () => { (window as unknown as Record<string, unknown>).__ttsGuard = null; resolve(); };
      u.onerror = () => { (window as unknown as Record<string, unknown>).__ttsGuard = null; resolve(); };
      window.speechSynthesis.speak(u);
      setTimeout(() => { (window as unknown as Record<string, unknown>).__ttsGuard = null; resolve(); }, 8000);
    } catch {
      resolve();
    }
  });
}
