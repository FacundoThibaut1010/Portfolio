// Tiny synthesized UI sounds (Web Audio, no files): a short "terminal" blip for clicks
// and a soft mechanical tick for typing. Off when the user mutes them.

let ctx: AudioContext | null = null;
let enabled = true;

export const setSoundEnabled = (on: boolean) => { enabled = on; };

const audio = () => {
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

/** Click: two quick square-wave chirps, like a retro terminal confirming a command. */
export function playClick() {
  if (!enabled) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const out = a.createGain();
  out.gain.value = 0.045;
  out.connect(a.destination);

  [0, 0.045].forEach((delay, i) => {
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(i === 0 ? 1320 : 1760, t + delay);
    osc.frequency.exponentialRampToValueAtTime(i === 0 ? 880 : 1320, t + delay + 0.035);
    g.gain.setValueAtTime(0.0001, t + delay);
    g.gain.exponentialRampToValueAtTime(1, t + delay + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.04);
    osc.connect(g).connect(out);
    osc.start(t + delay);
    osc.stop(t + delay + 0.05);
  });
}

/** Typing: a very short filtered noise burst (mechanical key). */
export function playKey() {
  if (!enabled) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const len = Math.floor(a.sampleRate * 0.025);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const src = a.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = 0.9 + Math.random() * 0.25;
  const bp = a.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2400;
  bp.Q.value = 0.9;
  const g = a.createGain();
  g.gain.value = 0.06;
  src.connect(bp).connect(g).connect(a.destination);
  src.start(t);
}
