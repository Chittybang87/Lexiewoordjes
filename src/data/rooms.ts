export type Point = { x: number; y: number };

export interface RoomLayout {
  /** Where Lexie starts (near the entrance). */
  start: Point;
  /** Walkable floor band (percent of room height). */
  floorMinY: number;
  /** Stable places for word hotspots, near furniture. */
  spots: Point[];
}

export const ROOM_LAYOUTS: Record<string, RoomLayout> = {
  keuken: {
    start: { x: 50, y: 88 },
    floorMinY: 48,
    spots: [
      { x: 14, y: 62 },
      { x: 30, y: 56 },
      { x: 48, y: 72 },
      { x: 68, y: 58 },
      { x: 86, y: 66 },
      { x: 38, y: 80 },
      { x: 78, y: 78 },
      { x: 20, y: 78 },
    ],
  },
  winkel: {
    start: { x: 50, y: 88 },
    floorMinY: 48,
    spots: [
      /* Left rack shelves */
      { x: 14, y: 34 },
      { x: 22, y: 46 },
      { x: 30, y: 58 },
      /* Mid rack shelves */
      { x: 48, y: 36 },
      { x: 54, y: 48 },
      { x: 58, y: 60 },
      /* Near fridge / checkout */
      { x: 70, y: 55 },
      { x: 82, y: 62 },
    ],
  },
  post: {
    start: { x: 50, y: 88 },
    floorMinY: 48,
    spots: [
      { x: 18, y: 58 },
      { x: 38, y: 52 },
      { x: 62, y: 52 },
      { x: 84, y: 48 },
      { x: 22, y: 74 },
      { x: 48, y: 76 },
      { x: 72, y: 72 },
      { x: 88, y: 78 },
    ],
  },
  park: {
    start: { x: 50, y: 88 },
    floorMinY: 52,
    spots: [
      { x: 16, y: 62 },
      { x: 38, y: 70 },
      { x: 58, y: 58 },
      { x: 78, y: 64 },
      { x: 88, y: 74 },
      { x: 28, y: 80 },
      { x: 65, y: 78 },
      { x: 48, y: 68 },
    ],
  },
  boerderij: {
    start: { x: 50, y: 88 },
    floorMinY: 52,
    spots: [
      { x: 16, y: 64 },
      { x: 34, y: 58 },
      { x: 52, y: 70 },
      { x: 72, y: 60 },
      { x: 88, y: 72 },
      { x: 24, y: 80 },
      { x: 62, y: 78 },
      { x: 44, y: 56 },
    ],
  },
  bos: {
    start: { x: 50, y: 88 },
    floorMinY: 54,
    spots: [
      { x: 14, y: 66 },
      { x: 32, y: 58 },
      { x: 50, y: 70 },
      { x: 70, y: 62 },
      { x: 86, y: 72 },
      { x: 22, y: 80 },
      { x: 58, y: 78 },
      { x: 42, y: 54 },
    ],
  },
};

export function layoutFor(missionId: string): RoomLayout {
  return ROOM_LAYOUTS[missionId] ?? ROOM_LAYOUTS.park;
}
