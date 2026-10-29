export type WorldPlaceId = 'huis' | 'post' | 'winkel' | 'park' | 'boerderij' | 'bos';

export type Point = { x: number; y: number };

export interface WorldPlace {
  id: WorldPlaceId;
  label: string;
  emoji: string;
  /** Direct mission, or open house screen when 'huis'. */
  kind: 'mission' | 'house';
  missionId?: string;
  /** Map page: 0 = dorp, 1 = buiten. */
  page: 0 | 1;
  /** Landmark position on that page (percent). */
  x: number;
  y: number;
  /** Path Lexie walks from the page start to this place. */
  path: Point[];
}

export interface HouseRoom {
  id: string;
  label: string;
  emoji: string;
  missionId: string;
  available: boolean;
}

/** Where Lexie stands when a map page opens. */
export const MAP_START: Record<0 | 1, Point> = {
  0: { x: 50, y: 88 },
  1: { x: 12, y: 78 },
};

/** Walk path when leaving the village toward the countryside. */
export const PAGE_EXIT_PATH: Point[] = [
  { x: 50, y: 88 },
  { x: 64, y: 82 },
  { x: 80, y: 74 },
  { x: 94, y: 64 },
];

export const WORLD_PLACES: WorldPlace[] = [
  {
    id: 'huis',
    label: 'Het huis',
    emoji: '🏠',
    kind: 'house',
    page: 0,
    x: 18,
    y: 58,
    path: [
      { x: 50, y: 88 },
      { x: 48, y: 76 },
      { x: 42, y: 64 },
      { x: 28, y: 58 },
      { x: 20, y: 58 },
    ],
  },
  {
    id: 'post',
    label: 'De Post',
    emoji: '📮',
    kind: 'mission',
    missionId: 'post',
    page: 0,
    x: 76,
    y: 55,
    path: [
      { x: 50, y: 88 },
      { x: 58, y: 76 },
      { x: 68, y: 62 },
      { x: 76, y: 58 },
    ],
  },
  {
    id: 'winkel',
    label: 'De Winkel',
    emoji: '🛒',
    kind: 'mission',
    missionId: 'winkel',
    page: 0,
    x: 48,
    y: 59,
    path: [
      { x: 50, y: 88 },
      { x: 48, y: 76 },
      { x: 48, y: 66 },
    ],
  },
  {
    id: 'park',
    label: 'Het Park',
    emoji: '🌳',
    kind: 'mission',
    missionId: 'park',
    page: 0,
    x: 86,
    y: 74,
    path: [
      { x: 50, y: 88 },
      { x: 64, y: 84 },
      { x: 78, y: 78 },
      { x: 86, y: 76 },
    ],
  },
  {
    id: 'boerderij',
    label: 'De Boerderij',
    emoji: '🐄',
    kind: 'mission',
    missionId: 'boerderij',
    page: 1,
    x: 30,
    y: 54,
    path: [
      { x: 12, y: 78 },
      { x: 18, y: 70 },
      { x: 26, y: 62 },
    ],
  },
  {
    id: 'bos',
    label: 'Het Bos',
    emoji: '🌲',
    kind: 'mission',
    missionId: 'bos',
    page: 1,
    x: 78,
    y: 56,
    path: [
      { x: 12, y: 78 },
      { x: 32, y: 74 },
      { x: 52, y: 68 },
      { x: 68, y: 62 },
      { x: 78, y: 58 },
    ],
  },
];

export const HOUSE_ROOMS: HouseRoom[] = [
  { id: 'keuken', label: 'Keuken', emoji: '🍳', missionId: 'keuken', available: true },
  { id: 'woonkamer', label: 'Woonkamer', emoji: '🛋️', missionId: 'woonkamer', available: false },
  { id: 'slaapkamer', label: 'Slaapkamer', emoji: '🛏️', missionId: 'slaapkamer', available: false },
];

export const MAP_PAGE_LABELS = ['In het dorp', 'Buiten het dorp'] as const;
