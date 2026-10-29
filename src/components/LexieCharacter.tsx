import { motion, type TargetAndTransition } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { LexieMood } from '../hooks/useGameState';

const ANIMATIONS: Record<
  LexieMood,
  {
    frames: string[];
    interval: number;
    bounce: TargetAndTransition;
    duration: number;
    repeat: number;
  }
> = {
  idle: {
    frames: ['/characters/lexie-idle.png'],
    interval: 1000,
    bounce: { y: [0, -6, 0], rotate: [0, 1.5, -1.5, 0] },
    duration: 2.6,
    repeat: Infinity,
  },
  wave: {
    frames: ['/characters/lexie-wave.png', '/characters/lexie-wave-2.png'],
    interval: 500,
    bounce: { y: [0, -6, 0] },
    duration: 1.8,
    repeat: Infinity,
  },
  happy: {
    frames: ['/characters/lexie-happy.png', '/characters/lexie-victory.png'],
    interval: 550,
    bounce: { y: [0, -12, 0, -7, 0], rotate: [0, -3, 3, 0], scale: [1, 1.04, 1] },
    duration: 1.1,
    repeat: Infinity,
  },
  wrong: {
    frames: ['/characters/lexie-wrong.png'],
    interval: 1000,
    bounce: { x: [0, -7, 7, -4, 4, 0], rotate: [0, -3, 3, 0] },
    duration: 0.5,
    repeat: 0,
  },
  walk: {
    frames: ['/characters/lexie-run.png', '/characters/lexie-idle.png'],
    interval: 220,
    bounce: { y: [0, -10, 0, -6, 0], rotate: [0, -2, 2, 0] },
    duration: 0.45,
    repeat: Infinity,
  },
};

interface Props {
  mood?: LexieMood;
  size?: number;
  className?: string;
  /** Run sprite faces right; flip for left. */
  facing?: 'left' | 'right';
}

export function LexieCharacter({
  mood = 'idle',
  size = 160,
  className,
  facing = 'right',
}: Props) {
  const anim = ANIMATIONS[mood];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    setFrame(0);
    if (anim.frames.length < 2) return;
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % anim.frames.length);
    }, anim.interval);
    return () => window.clearInterval(id);
  }, [mood, anim.frames, anim.interval]);

  const sizeRem = `${size / 16}rem`;

  return (
    <motion.div
      className={`lexie-sprite${className ? ` ${className}` : ''}`}
      style={{
        /* CSS classes may override via --lexie-size (fluid/mobile-first) */
        width: `var(--lexie-size, ${sizeRem})`,
        height: `var(--lexie-size, ${sizeRem})`,
        scaleX: facing === 'left' ? -1 : 1,
      }}
      animate={anim.bounce}
      transition={{
        duration: anim.duration,
        repeat: anim.repeat,
        ease: [0.45, 0.05, 0.55, 0.95],
      }}
      aria-hidden
    >
      {anim.frames.map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt=""
          className="lexie-sprite__img"
          draggable={false}
          initial={false}
          animate={{ opacity: i === frame % anim.frames.length ? 1 : 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  );
}
