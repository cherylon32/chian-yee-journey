// A soft lo-fi loop generated live with the Web Audio API: no audio files,
// no licensing. Gentle pad chords + a quiet triangle-wave arpeggio.
// Only ever starts from a click (browsers block autoplay anyway).

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

// Cmaj7 → Am7 → Fmaj7 → G6, each held for two bars
const CHORDS = [
  [60, 64, 67, 71],
  [57, 60, 64, 67],
  [53, 57, 60, 64],
  [55, 59, 62, 64],
];
const ARP = [0, 1, 2, 3, 2, 1, 2, 0];
const STEP = 60 / 78 / 2; // eighth notes at 78 bpm

export class Music {
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private timer = 0;
  private step = 0;
  private nextTime = 0;

  get playing() {
    return !!this.ctx;
  }

  start() {
    if (this.ctx) return;
    const ctx = new AudioContext();
    const out = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1700;
    out.gain.setValueAtTime(0, ctx.currentTime);
    out.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 2);
    out.connect(lp).connect(ctx.destination);
    this.ctx = ctx;
    this.out = out;
    this.step = 0;
    this.nextTime = ctx.currentTime + 0.1;
    this.timer = window.setInterval(() => this.schedule(), 60);
  }

  stop() {
    const ctx = this.ctx;
    if (!ctx || !this.out) return;
    clearInterval(this.timer);
    this.out.gain.cancelScheduledValues(ctx.currentTime);
    this.out.gain.setValueAtTime(this.out.gain.value, ctx.currentTime);
    this.out.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    setTimeout(() => ctx.close(), 600);
    this.ctx = null;
    this.out = null;
  }

  private schedule() {
    const ctx = this.ctx!;
    while (this.nextTime < ctx.currentTime + 0.25) {
      this.play(this.step, this.nextTime);
      this.nextTime += STEP;
      this.step++;
    }
  }

  private note(freq: number, at: number, dur: number, vol: number, type: OscillatorType) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(vol, at + Math.min(0.9, dur * 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(g).connect(this.out!);
    osc.start(at);
    osc.stop(at + dur + 0.05);
  }

  private play(step: number, at: number) {
    const chord = CHORDS[Math.floor(step / 16) % CHORDS.length];
    if (step % 16 === 0) {
      for (const n of chord) {
        this.note(midi(n - 12), at, STEP * 16, 0.035, "sine");
        this.note(midi(n - 12) * 1.003, at, STEP * 16, 0.02, "sine");
      }
      this.note(midi(chord[0] - 24), at, STEP * 16, 0.05, "sine");
    }
    if (step % 2 === 0 || Math.random() < 0.35) {
      this.note(midi(chord[ARP[step % ARP.length]] + 12), at, STEP * 1.8, 0.03, "triangle");
    }
  }
}
