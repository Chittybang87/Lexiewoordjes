export type Level = 1 | 2 | 3;

export interface WordItem {
  id: string;
  woord: string;
  emoji: string;
  niveau: Level;
  opdrachtId: string;
}

export interface Mission {
  id: string;
  naam: string;
  titel: string;
  intro: string;
  emoji: string;
  gradient: string;
}

export const MISSIONS: Mission[] = [
  {
    id: 'keuken',
    naam: 'Keuken',
    titel: 'Naar de keuken!',
    intro: 'Lexie helpt in de keuken. Kun jij de woordjes maken?',
    emoji: '🍳',
    gradient: 'linear-gradient(160deg, #FFF5E6 0%, #FFE0B8 40%, #E8A86A 100%)',
  },
  {
    id: 'winkel',
    naam: 'Winkel',
    titel: 'Naar de winkel!',
    intro: 'Lexie doet boodschappen met haar tasje. Wat moet erin?',
    emoji: '🛒',
    gradient: 'linear-gradient(160deg, #E8F5EC 0%, #B8E0C8 40%, #6CB88A 100%)',
  },
  {
    id: 'post',
    naam: 'Post',
    titel: 'Naar de post!',
    intro: 'Lexie brengt een pakje weg. Welke woordjes horen bij de post?',
    emoji: '📮',
    gradient: 'linear-gradient(160deg, #FFE8EE 0%, #FFC0D0 40%, #E888A0 100%)',
  },
  {
    id: 'park',
    naam: 'Park',
    titel: 'Naar het park!',
    intro: 'Lexie speelt in het park. Maak de woordjes die je ziet!',
    emoji: '🌳',
    gradient: 'linear-gradient(160deg, #E8F4FC 0%, #A8D4F0 40%, #5BA4D0 100%)',
  },
];

export const WORDS: WordItem[] = [
  // Keuken – niveau 1 (2–3)
  { id: 'k-ei', woord: 'ei', emoji: '🥚', niveau: 1, opdrachtId: 'keuken' },
  { id: 'k-pan', woord: 'pan', emoji: '🍳', niveau: 1, opdrachtId: 'keuken' },
  { id: 'k-kop', woord: 'kop', emoji: '☕', niveau: 1, opdrachtId: 'keuken' },
  // Keuken – niveau 2 (3–4)
  { id: 'k-bord', woord: 'bord', emoji: '🍽️', niveau: 2, opdrachtId: 'keuken' },
  { id: 'k-kaas', woord: 'kaas', emoji: '🧀', niveau: 2, opdrachtId: 'keuken' },
  { id: 'k-melk', woord: 'melk', emoji: '🥛', niveau: 2, opdrachtId: 'keuken' },
  { id: 'k-soep', woord: 'soep', emoji: '🥣', niveau: 2, opdrachtId: 'keuken' },
  // Keuken – niveau 3 (4–5)
  { id: 'k-lepel', woord: 'lepel', emoji: '🥄', niveau: 3, opdrachtId: 'keuken' },
  { id: 'k-boter', woord: 'boter', emoji: '🧈', niveau: 3, opdrachtId: 'keuken' },
  { id: 'k-taart', woord: 'taart', emoji: '🎂', niveau: 3, opdrachtId: 'keuken' },

  // Winkel – niveau 1
  { id: 'w-tas', woord: 'tas', emoji: '🛍️', niveau: 1, opdrachtId: 'winkel' },
  { id: 'w-ui', woord: 'ui', emoji: '🧅', niveau: 1, opdrachtId: 'winkel' },
  { id: 'w-jam', woord: 'jam', emoji: '🍓', niveau: 1, opdrachtId: 'winkel' },
  // Winkel – niveau 2
  { id: 'w-peer', woord: 'peer', emoji: '🍐', niveau: 2, opdrachtId: 'winkel' },
  { id: 'w-melk', woord: 'melk', emoji: '🥛', niveau: 2, opdrachtId: 'winkel' },
  { id: 'w-vis', woord: 'vis', emoji: '🐟', niveau: 2, opdrachtId: 'winkel' },
  { id: 'w-kaas', woord: 'kaas', emoji: '🧀', niveau: 2, opdrachtId: 'winkel' },
  // Winkel – niveau 3
  { id: 'w-brood', woord: 'brood', emoji: '🍞', niveau: 3, opdrachtId: 'winkel' },
  { id: 'w-appel', woord: 'appel', emoji: '🍎', niveau: 3, opdrachtId: 'winkel' },
  { id: 'w-worst', woord: 'worst', emoji: '🌭', niveau: 3, opdrachtId: 'winkel' },
  { id: 'w-druif', woord: 'druif', emoji: '🍇', niveau: 3, opdrachtId: 'winkel' },

  // Post – niveau 1
  { id: 'p-pen', woord: 'pen', emoji: '✒️', niveau: 1, opdrachtId: 'post' },
  { id: 'p-zak', woord: 'zak', emoji: '👝', niveau: 1, opdrachtId: 'post' },
  { id: 'p-bus', woord: 'bus', emoji: '🚌', niveau: 1, opdrachtId: 'post' },
  // Post – niveau 2
  { id: 'p-doos', woord: 'doos', emoji: '📦', niveau: 2, opdrachtId: 'post' },
  { id: 'p-post', woord: 'post', emoji: '📮', niveau: 2, opdrachtId: 'post' },
  { id: 'p-pak', woord: 'pak', emoji: '📭', niveau: 2, opdrachtId: 'post' },
  // Post – niveau 3
  { id: 'p-brief', woord: 'brief', emoji: '✉️', niveau: 3, opdrachtId: 'post' },
  { id: 'p-kaart', woord: 'kaart', emoji: '💌', niveau: 3, opdrachtId: 'post' },
  { id: 'p-stempel', woord: 'zegel', emoji: '🔖', niveau: 3, opdrachtId: 'post' },
  { id: 'p-pakje', woord: 'pakje', emoji: '🎁', niveau: 3, opdrachtId: 'post' },
  { id: 'p-adres', woord: 'adres', emoji: '🏠', niveau: 3, opdrachtId: 'post' },

  // Park – niveau 1
  { id: 'pk-bal', woord: 'bal', emoji: '⚽', niveau: 1, opdrachtId: 'park' },
  { id: 'pk-zon', woord: 'zon', emoji: '☀️', niveau: 1, opdrachtId: 'park' },
  { id: 'pk-tak', woord: 'tak', emoji: '🪵', niveau: 1, opdrachtId: 'park' },
  // Park – niveau 2
  { id: 'pk-boom', woord: 'boom', emoji: '🌳', niveau: 2, opdrachtId: 'park' },
  { id: 'pk-bank', woord: 'bank', emoji: '🪑', niveau: 2, opdrachtId: 'park' },
  { id: 'pk-park', woord: 'park', emoji: '🏞️', niveau: 2, opdrachtId: 'park' },
  { id: 'pk-duif', woord: 'duif', emoji: '🕊️', niveau: 2, opdrachtId: 'park' },
  // Park – niveau 3
  { id: 'pk-vogel', woord: 'vogel', emoji: '🐦', niveau: 3, opdrachtId: 'park' },
  { id: 'pk-bloem', woord: 'bloem', emoji: '🌸', niveau: 3, opdrachtId: 'park' },
  { id: 'pk-wolk', woord: 'wolk', emoji: '☁️', niveau: 3, opdrachtId: 'park' },
];

/** Lookalike distractors for harder levels */
const LOOKALIKES: Record<string, string[]> = {
  b: ['d', 'p'],
  d: ['b', 'p'],
  p: ['b', 'd'],
  m: ['n', 'w'],
  n: ['m', 'u'],
  u: ['n', 'v'],
  v: ['w', 'u'],
  w: ['v', 'm'],
  a: ['e', 'o'],
  e: ['a', 'i'],
  i: ['l', 'j'],
  l: ['i', 't'],
  o: ['a', 'c'],
  c: ['o', 'e'],
  r: ['n', 'm'],
  s: ['z', 'c'],
  z: ['s', 'x'],
  k: ['h', 'x'],
  t: ['l', 'f'],
  g: ['q', 'y'],
  h: ['k', 'n'],
  f: ['t', 'v'],
  j: ['i', 'y'],
};

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export function letterPoolSize(level: Level): number {
  if (level === 1) return 8;
  if (level === 2) return 10;
  return 12;
}

export function wordsForMission(
  missionId: string,
  level: Level,
  pool: WordItem[] = WORDS,
): WordItem[] {
  const matching = pool.filter(
    (w) => w.opdrachtId === missionId && w.niveau === level,
  );
  // Fallback: if too few exact matches, include easier words
  if (matching.length >= 3) return shuffle([...matching]).slice(0, 4);

  const fallback = pool.filter(
    (w) => w.opdrachtId === missionId && w.niveau <= level,
  );
  if (fallback.length > 0) return shuffle([...fallback]).slice(0, Math.min(4, fallback.length));

  // Last resort: any words at this level from the active pool
  const anyLevel = pool.filter((w) => w.niveau <= level);
  return shuffle([...anyLevel]).slice(0, Math.min(4, anyLevel.length));
}

export function buildLetterChoices(woord: string, level: Level): string[] {
  const letters = woord.toLowerCase().split('');
  const poolSize = letterPoolSize(level);
  const pool: string[] = [...letters];

  // Prefer lookalikes on level 2+
  if (level >= 2) {
    for (const ch of letters) {
      const alike = LOOKALIKES[ch] ?? [];
      for (const a of alike) {
        if (pool.length >= poolSize) break;
        if (!pool.includes(a) || level === 3) pool.push(a);
      }
    }
  }

  // Fill remaining with random alphabet letters
  const remaining = ALPHABET.filter((c) => !pool.includes(c));
  shuffle(remaining);
  while (pool.length < poolSize && remaining.length > 0) {
    pool.push(remaining.pop()!);
  }

  // Ensure we have enough instances of needed letters already in pool
  return shuffle(pool).slice(0, poolSize);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const LEVEL_LABELS: Record<Level, string> = {
  1: 'Makkelijk',
  2: 'Gewoon',
  3: 'Lastig',
};
