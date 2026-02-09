const audioContext = () => new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx) ctx = audioContext();
  return ctx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', gain = 0.3) {
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
}

export function playCorrect() {
  playTone(880, 0.15, 'sine', 0.2);
  setTimeout(() => playTone(1100, 0.2, 'sine', 0.2), 100);
}

export function playWrong() {
  playTone(200, 0.3, 'sawtooth', 0.15);
}

export function playClick() {
  playTone(600, 0.08, 'sine', 0.1);
}

export function playStreak() {
  playTone(523, 0.1, 'sine', 0.2);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.2), 80);
  setTimeout(() => playTone(784, 0.1, 'sine', 0.2), 160);
  setTimeout(() => playTone(1047, 0.2, 'sine', 0.2), 240);
}

export function playLevelUp() {
  [523, 659, 784, 1047, 1319].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.2), i * 120);
  });
}

export function playLaunch() {
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(100, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(2000, c.currentTime + 1);
  g.gain.setValueAtTime(0.2, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 1);
  osc.connect(g);
  g.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 1);
}

export function speak(text: string, lang = 'en-US'): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.85;
    u.pitch = 1.1;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}
