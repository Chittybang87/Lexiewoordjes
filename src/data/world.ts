export type WorldPlaceId = 'huis' | 'post' | 'winkel' | 'park' | 'boerderij' | 'bos';

export interface WorldPlace {
  id: WorldPlaceId;
  label: string;
  emoji: string;
  /** Direct mission, or open house screen when 'huis'. */
  kind: 'mission' | 'house';
  missionId?: string;
}

export interface HouseRoom {
  id: string;
  label: string;
  emoji: string;
  missionId: string;
  available: boolean;
}

/** Locations in carousel order (Duplo-style scroll wheel). */
export const WORLD_PLACES: WorldPlace[] = [
  {
    id: 'huis',
    label: 'Het huis',
    emoji: '🏠',
    kind: 'house',
  },
  {
    id: 'post',
    label: 'De Post',
    emoji: '📮',
    kind: 'mission',
    missionId: 'post',
  },
  {
    id: 'winkel',
    label: 'De Winkel',
    emoji: '🛒',
    kind: 'mission',
    missionId: 'winkel',
  },
  {
    id: 'park',
    label: 'Het Park',
    emoji: '🌳',
    kind: 'mission',
    missionId: 'park',
  },
  {
    id: 'boerderij',
    label: 'De Boerderij',
    emoji: '🐄',
    kind: 'mission',
    missionId: 'boerderij',
  },
  {
    id: 'bos',
    label: 'Het Bos',
    emoji: '🌲',
    kind: 'mission',
    missionId: 'bos',
  },
];

export const HOUSE_ROOMS: HouseRoom[] = [
  { id: 'keuken', label: 'Keuken', emoji: '🍳', missionId: 'keuken', available: true },
  { id: 'woonkamer', label: 'Woonkamer', emoji: '🛋️', missionId: 'woonkamer', available: false },
  { id: 'slaapkamer', label: 'Slaapkamer', emoji: '🛏️', missionId: 'slaapkamer', available: false },
];
