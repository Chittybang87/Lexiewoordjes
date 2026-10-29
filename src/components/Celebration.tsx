import { motion } from 'framer-motion';
import type { Mission } from '../data/words';
import { LexieCharacter } from './LexieCharacter';
import { SceneBackground } from './SceneBackground';

interface MissionDoneProps {
  mission: Mission;
  stars: number;
  onContinue: () => void;
}

export function MissionDone({ mission, stars, onContinue }: MissionDoneProps) {
  return (
    <div className="screen celebration">
      <SceneBackground scene={mission.id} rich />
      <motion.div
        className="celebration__box"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 16 }}
      >
        <LexieCharacter mood="happy" size={180} />
        <h2>Klaar met {mission.naam.toLowerCase()}!</h2>
        <p className="celebration__stars">{'★'.repeat(Math.min(stars, 8))} {stars} sterren</p>
        <motion.button
          type="button"
          className="btn-primary"
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Terug naar de kaart
        </motion.button>
      </motion.div>
    </div>
  );
}

interface RoundDoneProps {
  stars: number;
  onHome: () => void;
  onReplay: () => void;
}

export function RoundDone({ stars, onHome, onReplay }: RoundDoneProps) {
  return (
    <div className="screen celebration celebration--final">
      <SceneBackground scene="park" />
      <motion.div
        className="celebration__box"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
      >
        <LexieCharacter mood="happy" size={200} />
        <h2>Wat goed gedaan!</h2>
        <p>Lexie is super trots op jou.</p>
        <p className="celebration__stars celebration__stars--big">
          {'★'.repeat(Math.min(stars, 12))}
        </p>
        <p className="celebration__total">{stars} sterren verzameld</p>
        <div className="celebration__actions">
          <motion.button
            type="button"
            className="btn-primary"
            onClick={onReplay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Nog eens spelen
          </motion.button>
          <motion.button
            type="button"
            className="btn-secondary"
            onClick={onHome}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Naar start
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
