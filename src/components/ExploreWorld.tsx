import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useMemo, useRef, useState, type MouseEvent } from 'react';
import type { Mission, WordItem } from '../data/words';
import { LexieCharacter } from './LexieCharacter';
import { SceneBackground } from './SceneBackground';

type Point = { x: number; y: number };

/** Stable floor spots (percent) so items feel placed in the room. */
const SPOTS: Point[] = [
  { x: 18, y: 58 },
  { x: 38, y: 48 },
  { x: 62, y: 52 },
  { x: 82, y: 60 },
  { x: 28, y: 72 },
  { x: 55, y: 68 },
  { x: 75, y: 74 },
  { x: 12, y: 78 },
];

const START: Point = { x: 50, y: 84 };

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function assignSpots(words: WordItem[]): Record<string, Point> {
  const used = new Set<number>();
  const map: Record<string, Point> = {};
  for (const w of words) {
    let i = hashId(w.id) % SPOTS.length;
    let guard = 0;
    while (used.has(i) && guard < SPOTS.length) {
      i = (i + 1) % SPOTS.length;
      guard++;
    }
    used.add(i);
    map[w.id] = SPOTS[i];
  }
  return map;
}

function dist(a: Point, b: Point) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

interface Props {
  mission: Mission;
  words: WordItem[];
  target: WordItem;
  wordIndex: number;
  totalWords: number;
  stars: number;
  onFound: () => void;
  onHome: () => void;
  onTapSound?: () => void;
  onWrongSound?: () => void;
}

export function ExploreWorld({
  mission,
  words,
  target,
  wordIndex,
  totalWords,
  stars,
  onFound,
  onHome,
  onTapSound,
  onWrongSound,
}: Props) {
  const spots = useMemo(() => assignSpots(words), [words]);
  const [pos, setPos] = useState<Point>(START);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [walking, setWalking] = useState(false);
  const [mood, setMood] = useState<'idle' | 'walk' | 'wrong' | 'happy'>('idle');
  const [hint, setHint] = useState(`Zoek ${target.emoji}`);
  const [walkDuration, setWalkDuration] = useState(0.8);
  const busy = useRef(false);
  const posRef = useRef(pos);
  posRef.current = pos;

  const walkTo = useCallback(
    (dest: Point, onArrive?: () => void) => {
      const from = posRef.current;
      const d = dist(from, dest);
      if (d < 1.5) {
        onArrive?.();
        return;
      }
      const duration = Math.min(2.2, Math.max(0.45, d / 38));
      setWalkDuration(duration);
      if (dest.x !== from.x) setFacing(dest.x < from.x ? 'left' : 'right');
      setWalking(true);
      setMood('walk');
      setPos(dest);
      window.setTimeout(() => {
        setWalking(false);
        setMood('idle');
        onArrive?.();
      }, duration * 1000);
    },
    [],
  );

  const handleSpot = useCallback(
    (word: WordItem) => {
      if (busy.current || walking) return;
      const dest = spots[word.id];
      if (!dest) return;
      onTapSound?.();
      busy.current = true;

      if (word.id === target.id) {
        setHint(`Ja! Naar ${word.emoji}…`);
        walkTo(dest, () => {
          setMood('happy');
          setHint(`Maak het woordje!`);
          window.setTimeout(() => {
            busy.current = false;
            onFound();
          }, 450);
        });
        return;
      }

      setHint(`Niet die… zoek ${target.emoji}`);
      walkTo(dest, () => {
        setMood('wrong');
        onWrongSound?.();
        window.setTimeout(() => {
          setMood('idle');
          busy.current = false;
          setHint(`Zoek ${target.emoji}`);
        }, 700);
      });
    },
    [onFound, onTapSound, onWrongSound, spots, target, walkTo, walking],
  );

  const handleFloor = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (busy.current || walking) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (y < 42) return;
      onTapSound?.();
      busy.current = true;
      walkTo({ x: Math.min(92, Math.max(8, x)), y: Math.min(90, Math.max(46, y)) }, () => {
        busy.current = false;
      });
    },
    [onTapSound, walkTo, walking],
  );

  return (
    <div className="screen explore">
      <SceneBackground scene={mission.id} softVeil />

      <header className="explore__bar">
        <button type="button" className="icon-btn" onClick={onHome} aria-label="Terug naar start">
          ←
        </button>
        <div className="explore__meta">
          <span>
            {mission.emoji} {mission.naam}
          </span>
          <span>
            {wordIndex + 1}/{totalWords}
          </span>
        </div>
        <div className="explore__stars" aria-label={`${stars} sterren`}>
          {'★'.repeat(Math.min(stars, 12))}
        </div>
      </header>

      <motion.p
        key={hint}
        className="explore__hint"
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {hint}
      </motion.p>

      <div className="explore__world" onClick={handleFloor} role="presentation">
        <div className="explore__floor-glow" />

        {words.map((w) => {
          const p = spots[w.id];
          const isTarget = w.id === target.id;
          const done = words.indexOf(w) < wordIndex;
          return (
            <motion.button
              key={w.id}
              type="button"
              className={`explore__spot${isTarget ? ' explore__spot--target' : ''}${
                done ? ' explore__spot--done' : ''
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                if (done) return;
                handleSpot(w);
              }}
              disabled={done || walking}
              aria-label={isTarget ? `Zoek ${w.woord}` : w.woord}
              initial={{ scale: 0 }}
              animate={{
                scale: done ? 0.75 : 1,
                opacity: done ? 0.35 : 1,
              }}
              whileTap={done ? undefined : { scale: 0.9 }}
            >
              <span className="explore__spot-emoji">{w.emoji}</span>
              {isTarget && !done && <span className="explore__pulse" />}
            </motion.button>
          );
        })}

        <motion.div
          className="explore__lexie"
          animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          transition={{ duration: walkDuration, ease: [0.4, 0.05, 0.35, 1] }}
        >
          <LexieCharacter mood={mood} size={110} facing={facing} />
        </motion.div>
      </div>

      <AnimatePresence>
        {mood === 'wrong' && (
          <motion.p
            className="explore__toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Oeps — zoek {target.emoji}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
