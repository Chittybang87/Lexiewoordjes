import { useCallback, useEffect, useState } from 'react';
import type { Level } from '../data/words';

const STORAGE_KEY = 'lexie-woordjes-stats';

export interface LevelStats {
  words: number;
  stars: number;
  games: number;
}

export interface WordStats {
  completed: number;
  mistakes: number;
}

export interface GameStats {
  wordsCompleted: number;
  missionsCompleted: number;
  roundsCompleted: number;
  starsTotal: number;
  wrongAttempts: number;
  gamesStarted: number;
  byLevel: Record<Level, LevelStats>;
  byWord: Record<string, WordStats>;
  lastPlayed: string | null;
}

const emptyLevel = (): LevelStats => ({ words: 0, stars: 0, games: 0 });

export const EMPTY_STATS: GameStats = {
  wordsCompleted: 0,
  missionsCompleted: 0,
  roundsCompleted: 0,
  starsTotal: 0,
  wrongAttempts: 0,
  gamesStarted: 0,
  byLevel: {
    1: emptyLevel(),
    2: emptyLevel(),
    3: emptyLevel(),
  },
  byWord: {},
  lastPlayed: null,
};

function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATS;
    const parsed = JSON.parse(raw) as Partial<GameStats>;
    return {
      ...EMPTY_STATS,
      ...parsed,
      byLevel: {
        1: { ...emptyLevel(), ...parsed.byLevel?.[1] },
        2: { ...emptyLevel(), ...parsed.byLevel?.[2] },
        3: { ...emptyLevel(), ...parsed.byLevel?.[3] },
      },
      byWord: parsed.byWord ?? {},
    };
  } catch {
    return EMPTY_STATS;
  }
}

function saveStats(stats: GameStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function useStats() {
  const [stats, setStats] = useState<GameStats>(() => loadStats());

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  const recordGameStart = useCallback((level: Level) => {
    setStats((s) => ({
      ...s,
      gamesStarted: s.gamesStarted + 1,
      lastPlayed: new Date().toISOString(),
      byLevel: {
        ...s.byLevel,
        [level]: { ...s.byLevel[level], games: s.byLevel[level].games + 1 },
      },
    }));
  }, []);

  const recordWrong = useCallback((wordId: string) => {
    setStats((s) => {
      const prev = s.byWord[wordId] ?? { completed: 0, mistakes: 0 };
      return {
        ...s,
        wrongAttempts: s.wrongAttempts + 1,
        byWord: {
          ...s.byWord,
          [wordId]: { ...prev, mistakes: prev.mistakes + 1 },
        },
      };
    });
  }, []);

  const recordWordComplete = useCallback((wordId: string, level: Level) => {
    setStats((s) => {
      const prev = s.byWord[wordId] ?? { completed: 0, mistakes: 0 };
      return {
        ...s,
        wordsCompleted: s.wordsCompleted + 1,
        starsTotal: s.starsTotal + 1,
        lastPlayed: new Date().toISOString(),
        byLevel: {
          ...s.byLevel,
          [level]: {
            ...s.byLevel[level],
            words: s.byLevel[level].words + 1,
            stars: s.byLevel[level].stars + 1,
          },
        },
        byWord: {
          ...s.byWord,
          [wordId]: { ...prev, completed: prev.completed + 1 },
        },
      };
    });
  }, []);

  const recordMissionComplete = useCallback(() => {
    setStats((s) => ({
      ...s,
      missionsCompleted: s.missionsCompleted + 1,
      lastPlayed: new Date().toISOString(),
    }));
  }, []);

  const recordRoundComplete = useCallback(() => {
    setStats((s) => ({
      ...s,
      roundsCompleted: s.roundsCompleted + 1,
      lastPlayed: new Date().toISOString(),
    }));
  }, []);

  const resetStats = useCallback(() => {
    setStats(EMPTY_STATS);
  }, []);

  return {
    stats,
    recordGameStart,
    recordWrong,
    recordWordComplete,
    recordMissionComplete,
    recordRoundComplete,
    resetStats,
  };
}
