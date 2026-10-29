import { motion } from 'framer-motion';
import { useMemo } from 'react';

const COLORS = ['#F0C040', '#5B9FD4', '#E85A4A', '#6CB88A', '#E07A4E', '#C45C48', '#fff'];

interface Props {
  active: boolean;
}

export function Confetti({ active }: Props) {
  const pieces = useMemo(() => {
    if (!active) return [];
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 1.2 + Math.random() * 0.8,
      color: COLORS[i % COLORS.length],
      size: 8 + Math.random() * 10,
      rotate: Math.random() * 360,
    }));
  }, [active]);

  if (!active) return null;

  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={`${active}-${p.id}`}
          className="confetti__piece"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            borderRadius: p.id % 3 === 0 ? '50%' : 3,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: '110vh',
            opacity: [1, 1, 0],
            rotate: p.rotate + 180,
            x: [0, (Math.random() - 0.5) * 80],
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}
