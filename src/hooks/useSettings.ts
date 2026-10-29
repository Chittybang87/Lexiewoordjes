import { useCallback, useEffect, useMemo, useState } from 'react';
import { WORDS, type Level, type WordItem } from '../data/words';

const STORAGE_KEY = 'lexie-woordjes-settings';

export interface WordOverride {
  enabled: boolean;
  emoji?: string;
  woord?: string;
}

export interface AppSettings {
  wordOverrides: Record<string, WordOverride>;
  customWords: WordItem[];
}

const DEFAULT_SETTINGS: AppSettings = {
  wordOverrides: {},
  customWords: [],
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      wordOverrides: parsed.wordOverrides ?? {},
      customWords: Array.isArray(parsed.customWords) ? parsed.customWords : [],
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: AppSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function applyOverride(word: WordItem, override?: WordOverride): WordItem | null {
  if (override?.enabled === false) return null;
  return {
    ...word,
    emoji: override?.emoji ?? word.emoji,
    woord: (override?.woord ?? word.woord).toLowerCase().trim() || word.woord,
  };
}

export function resolveWords(settings: AppSettings): WordItem[] {
  const fromDefaults = WORDS.map((w) => applyOverride(w, settings.wordOverrides[w.id])).filter(
    (w): w is WordItem => w !== null,
  );
  const fromCustom = settings.customWords
    .map((w) => applyOverride(w, settings.wordOverrides[w.id]))
    .filter((w): w is WordItem => w !== null);
  return [...fromDefaults, ...fromCustom];
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const activeWords = useMemo(() => resolveWords(settings), [settings]);

  const isEnabled = useCallback(
    (id: string) => settings.wordOverrides[id]?.enabled !== false,
    [settings.wordOverrides],
  );

  const getDisplayWord = useCallback(
    (word: WordItem): WordItem => {
      const o = settings.wordOverrides[word.id];
      return {
        ...word,
        emoji: o?.emoji ?? word.emoji,
        woord: o?.woord ?? word.woord,
      };
    },
    [settings.wordOverrides],
  );

  const setWordEnabled = useCallback((id: string, enabled: boolean) => {
    setSettings((s) => ({
      ...s,
      wordOverrides: {
        ...s.wordOverrides,
        [id]: { ...s.wordOverrides[id], enabled },
      },
    }));
  }, []);

  const setWordEmoji = useCallback((id: string, emoji: string) => {
    setSettings((s) => ({
      ...s,
      wordOverrides: {
        ...s.wordOverrides,
        [id]: { ...s.wordOverrides[id], enabled: s.wordOverrides[id]?.enabled ?? true, emoji },
      },
    }));
  }, []);

  const setWordText = useCallback((id: string, woord: string) => {
    const cleaned = woord.toLowerCase().replace(/[^a-zàáäâèéëêìíïîòóöôùúüûÿñç]/gi, '');
    setSettings((s) => ({
      ...s,
      wordOverrides: {
        ...s.wordOverrides,
        [id]: {
          ...s.wordOverrides[id],
          enabled: s.wordOverrides[id]?.enabled ?? true,
          woord: cleaned || s.wordOverrides[id]?.woord,
        },
      },
      customWords: s.customWords.map((w) =>
        w.id === id ? { ...w, woord: cleaned || w.woord } : w,
      ),
    }));
  }, []);

  const addCustomWord = useCallback((woord: string, emoji: string, opdrachtId: string, niveau: Level) => {
    const cleaned = woord.toLowerCase().replace(/[^a-zàáäâèéëêìíïîòóöôùúüûÿñç]/gi, '');
    if (!cleaned || cleaned.length < 2 || cleaned.length > 6) return false;
    const id = `custom-${Date.now()}-${cleaned}`;
    const item: WordItem = { id, woord: cleaned, emoji, niveau, opdrachtId };
    setSettings((s) => ({
      ...s,
      customWords: [...s.customWords, item],
      wordOverrides: {
        ...s.wordOverrides,
        [id]: { enabled: true, emoji, woord: cleaned },
      },
    }));
    return true;
  }, []);

  const removeCustomWord = useCallback((id: string) => {
    setSettings((s) => {
      const { [id]: _removed, ...rest } = s.wordOverrides;
      return {
        ...s,
        customWords: s.customWords.filter((w) => w.id !== id),
        wordOverrides: rest,
      };
    });
  }, []);

  const resetWords = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const allEditableWords = useMemo(() => {
    return [...WORDS, ...settings.customWords].map(getDisplayWord);
  }, [settings.customWords, getDisplayWord]);

  return {
    settings,
    activeWords,
    allEditableWords,
    isEnabled,
    getDisplayWord,
    setWordEnabled,
    setWordEmoji,
    setWordText,
    addCustomWord,
    removeCustomWord,
    resetWords,
  };
}
