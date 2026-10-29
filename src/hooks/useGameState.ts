import { useCallback, useMemo, useRef, useState } from 'react';
import {
  buildLetterChoices,
  MISSIONS,
  WORDS,
  type Level,
  type Mission,
  type WordItem,
  wordsForMission,
} from '../data/words';

export type Screen =
  | 'home'
  | 'world-map'
  | 'house'
  | 'mission-intro'
  | 'explore'
  | 'playing'
  | 'mission-done'
  | 'settings'
  | 'stats';
export type LexieMood = 'idle' | 'happy' | 'wrong' | 'wave' | 'walk';

type LetterChoice = { id: string; letter: string; used: boolean };

export interface GameStatsHooks {
  onGameStart?: (level: Level) => void;
  onWrong?: (wordId: string) => void;
  onWordComplete?: (wordId: string, level: Level) => void;
  onMissionComplete?: () => void;
  onRoundComplete?: () => void;
}

function makeChoices(woord: string, level: Level): LetterChoice[] {
  return buildLetterChoices(woord, level).map((letter, i) => ({
    id: `${letter}-${i}-${Math.random().toString(36).slice(2, 6)}`,
    letter,
    used: false,
  }));
}

export function useGameState(wordPool: WordItem[] = WORDS, statsHooks: GameStatsHooks = {}) {
  const [screen, setScreen] = useState<Screen>('home');
  const [level, setLevel] = useState<Level>(1);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [words, setWords] = useState<WordItem[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [filled, setFilled] = useState<string[]>([]);
  const [letterChoices, setLetterChoices] = useState<LetterChoice[]>([]);
  const [stars, setStars] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lexieMood, setLexieMood] = useState<LexieMood>('wave');
  const [shake, setShake] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const filledRef = useRef(filled);
  const choicesRef = useRef(letterChoices);
  const wordRef = useRef<WordItem | null>(null);
  const wordsRef = useRef(words);
  const wordIndexRef = useRef(wordIndex);
  const levelRef = useRef(level);
  const screenRef = useRef(screen);
  const poolRef = useRef(wordPool);
  const statsRef = useRef(statsHooks);

  filledRef.current = filled;
  choicesRef.current = letterChoices;
  screenRef.current = screen;
  wordsRef.current = words;
  wordIndexRef.current = wordIndex;
  levelRef.current = level;
  poolRef.current = wordPool;
  statsRef.current = statsHooks;

  const currentMission: Mission | null = useMemo(() => {
    if (!activeMissionId) return null;
    return MISSIONS.find((m) => m.id === activeMissionId) ?? null;
  }, [activeMissionId]);

  const currentWord: WordItem | null = words[wordIndex] ?? null;
  wordRef.current = currentWord;

  const flashMood = useCallback((mood: LexieMood, ms = 700) => {
    setLexieMood(mood);
    window.setTimeout(() => setLexieMood('idle'), ms);
  }, []);

  const canVisitMission = useCallback((missionId: string) => {
    const lvl = levelRef.current;
    return poolRef.current.some((w) => w.opdrachtId === missionId && w.niveau <= lvl);
  }, []);

  const startGame = useCallback((chosenLevel: Level) => {
    const pool = poolRef.current;
    if (pool.length === 0) return;
    setLevel(chosenLevel);
    setActiveMissionId(null);
    setWords([]);
    setWordIndex(0);
    setFilled([]);
    filledRef.current = [];
    setLetterChoices([]);
    choicesRef.current = [];
    setStars(0);
    setShowConfetti(false);
    setLexieMood('wave');
    setScreen('world-map');
    statsRef.current.onGameStart?.(chosenLevel);
  }, []);

  const openHouse = useCallback(() => {
    setLexieMood('wave');
    setScreen('house');
  }, []);

  const goToMap = useCallback(() => {
    setShowConfetti(false);
    setShake(false);
    setActiveMissionId(null);
    setLexieMood('wave');
    setScreen('world-map');
  }, []);

  const startMission = useCallback((missionId: string) => {
    const pool = poolRef.current;
    const currentLevel = levelRef.current;
    const missionWords = wordsForMission(missionId, currentLevel, pool);
    if (missionWords.length === 0) return false;

    setActiveMissionId(missionId);
    setWords(missionWords);
    setWordIndex(0);
    setFilled([]);
    filledRef.current = [];
    const choices = makeChoices(missionWords[0].woord, currentLevel);
    choicesRef.current = choices;
    setLetterChoices(choices);
    setShowConfetti(false);
    setLexieMood('wave');
    setScreen('mission-intro');
    return true;
  }, []);

  const beginPlaying = useCallback(() => {
    setLexieMood('idle');
    setScreen('explore');
  }, []);

  const beginSpelling = useCallback(() => {
    setLexieMood('idle');
    setScreen('playing');
  }, []);

  const goHome = useCallback(() => {
    setScreen('home');
    setActiveMissionId(null);
    setLexieMood('wave');
    setShowConfetti(false);
    setShake(false);
  }, []);

  const openSettings = useCallback(() => setScreen('settings'), []);
  const openStats = useCallback(() => setScreen('stats'), []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((s) => !s);
  }, []);

  const selectLetter = useCallback(
    (choiceId: string): 'correct' | 'wrong' | 'word-done' | 'noop' => {
      const word = wordRef.current;
      if (!word || screenRef.current !== 'playing') return 'noop';

      const choice = choicesRef.current.find((c) => c.id === choiceId);
      if (!choice || choice.used) return 'noop';

      const target = word.woord.toLowerCase();
      const nextPos = filledRef.current.length;
      const expected = target[nextPos];

      if (choice.letter !== expected) {
        setShake(true);
        flashMood('wrong', 600);
        window.setTimeout(() => setShake(false), 450);
        statsRef.current.onWrong?.(word.id);
        return 'wrong';
      }

      const newFilled = [...filledRef.current, choice.letter];
      filledRef.current = newFilled;
      setFilled(newFilled);

      const newChoices = choicesRef.current.map((c) =>
        c.id === choiceId ? { ...c, used: true } : c,
      );
      choicesRef.current = newChoices;
      setLetterChoices(newChoices);

      if (newFilled.length === target.length) {
        setStars((s) => s + 1);
        setShowConfetti(true);
        flashMood('happy', 1200);
        statsRef.current.onWordComplete?.(word.id, levelRef.current);
        return 'word-done';
      }

      flashMood('happy', 400);
      return 'correct';
    },
    [flashMood],
  );

  const advanceAfterWord = useCallback(() => {
    setShowConfetti(false);
    const currentWords = wordsRef.current;
    const idx = wordIndexRef.current;
    const currentLevel = levelRef.current;

    if (idx + 1 < currentWords.length) {
      const next = currentWords[idx + 1];
      setWordIndex(idx + 1);
      setFilled([]);
      filledRef.current = [];
      const choices = makeChoices(next.woord, currentLevel);
      choicesRef.current = choices;
      setLetterChoices(choices);
      setLexieMood('idle');
      setScreen('explore');
      return;
    }

    setLexieMood('happy');
    statsRef.current.onMissionComplete?.();
    setScreen('mission-done');
  }, []);

  const finishMissionToMap = useCallback(() => {
    setShowConfetti(false);
    setActiveMissionId(null);
    setLexieMood('wave');
    setScreen('world-map');
  }, []);

  return {
    screen,
    level,
    currentMission,
    words,
    wordIndex,
    currentWord,
    filled,
    letterChoices,
    stars,
    soundEnabled,
    lexieMood,
    shake,
    showConfetti,
    startGame,
    startMission,
    openHouse,
    goToMap,
    beginPlaying,
    beginSpelling,
    goHome,
    openSettings,
    openStats,
    toggleSound,
    selectLetter,
    advanceAfterWord,
    finishMissionToMap,
    canVisitMission,
    canPlay: wordPool.length > 0,
  };
}
