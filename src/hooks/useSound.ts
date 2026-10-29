import { useCallback, useRef } from 'react';

function playTone(
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.12,
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration);
}

export function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (kind: 'correct' | 'wrong' | 'complete' | 'tap' | 'mission') => {
      if (!enabled) return;
      try {
        const ctx = getCtx();
        if (ctx.state === 'suspended') void ctx.resume();
        const t = ctx.currentTime;

        if (kind === 'tap') {
          playTone(ctx, 520, t, 0.06, 'triangle', 0.08);
        } else if (kind === 'correct') {
          playTone(ctx, 523, t, 0.1, 'sine', 0.1);
          playTone(ctx, 659, t + 0.08, 0.12, 'sine', 0.1);
        } else if (kind === 'wrong') {
          playTone(ctx, 220, t, 0.15, 'square', 0.06);
          playTone(ctx, 180, t + 0.1, 0.18, 'square', 0.05);
        } else if (kind === 'complete') {
          playTone(ctx, 523, t, 0.12, 'sine', 0.1);
          playTone(ctx, 659, t + 0.1, 0.12, 'sine', 0.1);
          playTone(ctx, 784, t + 0.2, 0.12, 'sine', 0.1);
          playTone(ctx, 1046, t + 0.32, 0.25, 'sine', 0.12);
        } else if (kind === 'mission') {
          playTone(ctx, 392, t, 0.15, 'triangle', 0.1);
          playTone(ctx, 523, t + 0.12, 0.2, 'triangle', 0.1);
        }
      } catch {
        // Audio not available
      }
    },
    [enabled, getCtx],
  );

  return { play };
}
