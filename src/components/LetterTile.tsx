import { motion } from 'framer-motion';

interface Props {
  letter: string;
  used?: boolean;
  onClick?: () => void;
  variant?: 'choice' | 'slot' | 'filled';
  shake?: boolean;
  index?: number;
}

export function LetterTile({
  letter,
  used = false,
  onClick,
  variant = 'choice',
  shake = false,
  index = 0,
}: Props) {
  const isSlot = variant === 'slot';
  const isFilled = variant === 'filled';
  const isChoice = variant === 'choice';

  return (
    <motion.button
      type="button"
      className={`letter-tile letter-tile--${variant}${used ? ' letter-tile--used' : ''}`}
      onClick={used || isSlot ? undefined : onClick}
      disabled={used || isSlot}
      initial={isChoice ? { scale: 0, opacity: 0 } : false}
      animate={
        shake
          ? { x: [0, -6, 6, -4, 4, 0], scale: 1, opacity: 1 }
          : isFilled
            ? { scale: [0.6, 1.15, 1], opacity: 1 }
            : used
              ? { scale: 0.85, opacity: 0.35 }
              : { scale: 1, opacity: 1 }
      }
      whileTap={!used && isChoice ? { scale: 0.9 } : undefined}
      whileHover={!used && isChoice ? { scale: 1.08, y: -3 } : undefined}
      transition={{ type: 'spring', stiffness: 420, damping: 18, delay: isChoice ? index * 0.03 : 0 }}
      aria-label={isSlot ? 'lege letter' : `letter ${letter}`}
    >
      {isSlot ? '' : letter}
    </motion.button>
  );
}
