import { motion } from 'framer-motion';
import { LEVEL_LABELS, type Level } from '../data/words';
import { InstallAppButton } from './InstallAppButton';
import { LexieCharacter } from './LexieCharacter';

interface Props {
  onStart: (level: Level) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSettings: () => void;
  onStats: () => void;
  canPlay: boolean;
  starsTotal: number;
}

export function HomeScreen({
  onStart,
  soundEnabled,
  onToggleSound,
  onSettings,
  onStats,
  canPlay,
  starsTotal,
}: Props) {
  return (
    <div className="screen home">
      <div className="home__top-actions">
        <button type="button" className="icon-btn" onClick={onStats} aria-label="Statistieken">
          ★
        </button>
        <button
          type="button"
          className="sound-toggle sound-toggle--inline"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Geluid uit' : 'Geluid aan'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        <button type="button" className="icon-btn" onClick={onSettings} aria-label="Instellingen">
          ⚙
        </button>
      </div>

      <motion.div
        className="home__hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LexieCharacter mood="wave" size={220} />
        <h1 className="home__title">
          <span className="logo-lexie">
            <span>L</span>
            <span>e</span>
            <span>x</span>
            <span>i</span>
            <span>e</span>
          </span>{' '}
          Woordjes
        </h1>
        <p className="home__subtitle">Help Lexie met leuke opdrachten en maak woordjes!</p>
        {starsTotal > 0 && (
          <p className="home__stars-total" aria-label={`${starsTotal} sterren in totaal`}>
            ★ {starsTotal} sterren
          </p>
        )}
      </motion.div>

      <motion.div
        className="home__levels"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
      >
        <p className="home__pick">Kies een niveau</p>
        {!canPlay && (
          <p className="home__warning">Zet eerst minstens één woordje aan in de instellingen.</p>
        )}
        {([1, 2, 3] as Level[]).map((lvl, i) => (
          <motion.button
            key={lvl}
            type="button"
            className={`level-btn level-btn--${lvl}`}
            onClick={() => onStart(lvl)}
            disabled={!canPlay}
            whileHover={canPlay ? { scale: 1.04 } : undefined}
            whileTap={canPlay ? { scale: 0.96 } : undefined}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            <span className="level-btn__stars">{'★'.repeat(lvl)}</span>
            <span className="level-btn__label">{LEVEL_LABELS[lvl]}</span>
            <span className="level-btn__hint">
              {lvl === 1 && '2–3 letters'}
              {lvl === 2 && '3–4 letters'}
              {lvl === 3 && '4–5 letters'}
            </span>
          </motion.button>
        ))}
        <InstallAppButton />
      </motion.div>
    </div>
  );
}
