export function playSound(kind: 'message' | 'nudge' = 'message'): void {
  try {
    const context = new AudioContext();
    const notes = kind === 'nudge' ? [440, 330, 440] : [660, 880];
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.connect(gain); gain.connect(context.destination);
      oscillator.frequency.value = frequency;
      const time = context.currentTime + index * 0.12;
      gain.gain.setValueAtTime(0.035, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      oscillator.start(time); oscillator.stop(time + 0.21);
    });
    window.setTimeout(() => { void context.close(); }, 700);
  } catch { /* Sound is optional when the browser does not support audio. */ }
}
