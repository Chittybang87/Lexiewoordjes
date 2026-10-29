import { motion } from 'framer-motion';
import type { Mission } from '../data/words';
import { LexieCharacter } from './LexieCharacter';
import { SceneBackground } from './SceneBackground';

interface Props {
  mission: Mission;
  wordCount: number;
  onContinue: () => void;
}

export function MissionIntro({ mission, wordCount, onContinue }: Props) {
  return (
    <div className="screen mission-intro">
      <SceneBackground scene={mission.id} rich />

      <p className="mission-intro__progress">
        {wordCount} woordje{wordCount === 1 ? '' : 's'} hier
      </p>

      <motion.div
        className="mission-intro__content"
        initial={{ scale: 0.85, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.span
          className="mission-intro__emoji"
          animate={{ y: [0, -10, 0], rotate: [0, -6, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {mission.emoji}
        </motion.span>

        <LexieCharacter mood="wave" size={170} />

        <h2 className="mission-intro__title">{mission.titel}</h2>
        <p className="mission-intro__text">{mission.intro}</p>

        <motion.button
          type="button"
          className="btn-primary"
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          Ga op pad!
        </motion.button>
      </motion.div>
    </div>
  );
}
