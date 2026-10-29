import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import type { Mission, WordItem } from '../data/words';
import type { LexieMood } from '../hooks/useGameState';
import { LetterTile } from './LetterTile';
import { LexieCharacter } from './LexieCharacter';
import { SceneBackground } from './SceneBackground';

interface Props {
  mission: Mission;
  word: WordItem;
  wordIndex: number;
  totalWords: number;
  filled: string[];
  letterChoices: { id: string; letter: string; used: boolean }[];
  lexieMood: LexieMood;
  shake: boolean;
  stars: number;
  onSelectLetter: (id: string) => void;
  wordComplete: boolean;
  onNextWord: () => void;
  onHome: () => void;
}

export function WordGame({
  mission,
  word,
  wordIndex,
  totalWords,
  filled,
  letterChoices,
  lexieMood,
  shake,
  stars,
  onSelectLetter,
  wordComplete,
  onNextWord,
  onHome,
}: Props) {
  const slots = word.woord.split('');

  useEffect(() => {
    if (!wordComplete) return;
    const t = window.setTimeout(onNextWord, 1600);
    return () => window.clearTimeout(t);
  }, [wordComplete, onNextWord]);

  return (
    <div className="screen word-game">
      <SceneBackground scene={mission.id} />

      <header className="word-game__bar">
        <button type="button" className="icon-btn" onClick={onHome} aria-label="Terug naar start">
          ←
        </button>
        <div className="word-game__meta">
          <span>
            {mission.emoji} {mission.naam}
          </span>
          <span>
            {wordIndex + 1}/{totalWords}
          </span>
        </div>
        <div className="word-game__stars" aria-label={`${stars} sterren`}>
          {'★'.repeat(Math.min(stars, 12))}
        </div>
      </header>

      <div className="word-game__stage">
        <LexieCharacter mood={lexieMood} size={130} className="word-game__lexie" />

        <AnimatePresence mode="wait">
          <motion.div
            key={word.id}
            className="word-game__item"
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          >
            <span className="word-game__emoji" role="img" aria-label={word.woord}>
              {word.emoji}
            </span>
            <p className="word-game__hint">Maak het woordje</p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="word-game__slots"
          animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {slots.map((_, i) => {
            const letter = filled[i];
            return (
              <LetterTile
                key={`${word.id}-slot-${i}`}
                letter={letter ?? ''}
                variant={letter ? 'filled' : 'slot'}
              />
            );
          })}
        </motion.div>

        <div className="word-game__choices">
          {letterChoices.map((c, i) => (
            <LetterTile
              key={c.id}
              letter={c.letter}
              used={c.used}
              index={i}
              onClick={() => onSelectLetter(c.id)}
            />
          ))}
        </div>

        <AnimatePresence>
          {wordComplete && (
            <motion.p
              className="word-game__yay"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Goed zo! {word.woord.toUpperCase()}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
