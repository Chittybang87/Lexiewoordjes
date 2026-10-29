import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { LEVEL_LABELS, type Level, type WordItem } from '../data/words';
import type { GameStats } from '../hooks/useStats';
import { LexieCharacter } from './LexieCharacter';

interface Props {
  stats: GameStats;
  words: WordItem[];
  onReset: () => void;
  onBack: () => void;
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Nog niet gespeeld';
  try {
    return new Date(iso).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function StatsScreen({ stats, words, onReset, onBack }: Props) {
  const letterTries = stats.wordsCompleted * 3 + stats.wrongAttempts;
  const accuracy =
    letterTries > 0
      ? Math.min(100, Math.round(((letterTries - stats.wrongAttempts) / letterTries) * 100))
      : null;

  const topWords = useMemo(() => {
    return Object.entries(stats.byWord)
      .map(([id, s]) => {
        const word = words.find((w) => w.id === id);
        return {
          id,
          label: word?.woord ?? id,
          emoji: word?.emoji ?? '⭐',
          completed: s.completed,
          mistakes: s.mistakes,
        };
      })
      .filter((w) => w.completed > 0)
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 8);
  }, [stats.byWord, words]);

  const hardWords = useMemo(() => {
    return Object.entries(stats.byWord)
      .map(([id, s]) => {
        const word = words.find((w) => w.id === id);
        const ratio = s.mistakes / Math.max(1, s.completed);
        return {
          id,
          label: word?.woord ?? id,
          emoji: word?.emoji ?? '⭐',
          mistakes: s.mistakes,
          ratio,
        };
      })
      .filter((w) => w.mistakes > 0)
      .sort((a, b) => b.ratio - a.ratio || b.mistakes - a.mistakes)
      .slice(0, 5);
  }, [stats.byWord, words]);

  return (
    <div className="screen panel-screen">
      <header className="panel-screen__bar">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Terug">
          ←
        </button>
        <h1 className="panel-screen__title">Statistieken</h1>
        <span className="panel-screen__count" aria-hidden>
          ★
        </span>
      </header>

      <motion.div
        className="stats__hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <LexieCharacter mood="happy" size={120} />
        <div>
          <p className="stats__hero-label">Totaal sterren</p>
          <p className="stats__hero-stars">
            <span>★</span> {stats.starsTotal}
          </p>
          <p className="stats__hero-sub">Laatst gespeeld: {formatDate(stats.lastPlayed)}</p>
        </div>
      </motion.div>

      <div className="stats__grid">
        <StatCard label="Woordjes" value={stats.wordsCompleted} />
        <StatCard label="Opdrachten" value={stats.missionsCompleted} />
        <StatCard label="Rondjes" value={stats.roundsCompleted} />
        <StatCard label="Spelletjes" value={stats.gamesStarted} />
      </div>

      <section className="stats__section">
        <h2>Per niveau</h2>
        <div className="stats__levels">
          {([1, 2, 3] as Level[]).map((lvl) => {
            const row = stats.byLevel[lvl];
            return (
              <div key={lvl} className={`stats__level stats__level--${lvl}`}>
                <span className="stats__level-name">
                  {'★'.repeat(lvl)} {LEVEL_LABELS[lvl]}
                </span>
                <span>{row.words} woordjes</span>
                <span>{row.stars} ★</span>
                <span>{row.games}× gespeeld</span>
              </div>
            );
          })}
        </div>
      </section>

      {topWords.length > 0 && (
        <section className="stats__section">
          <h2>Meest gemaakt</h2>
          <ul className="stats__words">
            {topWords.map((w) => (
              <li key={w.id}>
                <span className="stats__word-emoji">{w.emoji}</span>
                <span className="stats__word-label">{w.label}</span>
                <span className="stats__word-count">{w.completed}×</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hardWords.length > 0 && (
        <section className="stats__section">
          <h2>Nog even oefenen</h2>
          <ul className="stats__words">
            {hardWords.map((w) => (
              <li key={w.id}>
                <span className="stats__word-emoji">{w.emoji}</span>
                <span className="stats__word-label">{w.label}</span>
                <span className="stats__word-count">{w.mistakes} fout</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="stats__accuracy">
        {accuracy !== null ? (
          <>
            Raakpercentage: <strong>{accuracy}%</strong>
            <span> · {stats.wrongAttempts} foute tikjes</span>
          </>
        ) : (
          'Nog geen woordjes gemaakt — tijd om te spelen!'
        )}
      </p>

      <button
        type="button"
        className="btn-secondary"
        onClick={() => {
          if (window.confirm('Alle statistieken wissen?')) onReset();
        }}
      >
        Statistieken wissen
      </button>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="stats__card">
      <span className="stats__card-value">{value}</span>
      <span className="stats__card-label">{label}</span>
    </div>
  );
}
