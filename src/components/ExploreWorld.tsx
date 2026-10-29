import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useMemo, useRef, useState, type MouseEvent } from 'react';
import { layoutFor, type Point } from '../data/rooms';
import type { Mission, WordItem } from '../data/words';
import { LexieCharacter } from './LexieCharacter';
import { SceneBackground } from './SceneBackground';

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function assignSpots(words: WordItem[], spots: Point[]): Record<string, Point> {
  const used = new Set<number>();
  const map: Record<string, Point> = {};
  for (const w of words) {
    let i = hashId(w.id) % spots.length;
    let guard = 0;
    while (used.has(i) && guard < spots.length) {
      i = (i + 1) % spots.length;
      guard++;
    }
    used.add(i);
    map[w.id] = spots[i];
  }
  return map;
}

function dist(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
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
  const room = useMemo(() => layoutFor(mission.id), [mission.id]);
  const spots = useMemo(() => assignSpots(words, room.spots), [words, room.spots]);
  const [pos, setPos] = useState<Point>(room.start);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [walking, setWalking] = useState(false);
  const [mood, setMood] = useState<'idle' | 'walk' | 'wrong' | 'happy'>('idle');
  const [hint, setHint] = useState(`Zoek ${target.emoji} in de ${mission.naam.toLowerCase()}`);
  const [walkDuration, setWalkDuration] = useState(0.8);
  const [footprints, setFootprints] = useState<Point[]>([]);
  const busy = useRef(false);
  const posRef = useRef(pos);
  posRef.current = pos;

  const walkTo = useCallback((dest: Point, onArrive?: () => void) => {
    const from = posRef.current;
    const d = dist(from, dest);
    if (d < 1.5) {
      onArrive?.();
      return;
    }
    const duration = Math.min(2.4, Math.max(0.5, d / 34));
    setWalkDuration(duration);
    if (dest.x !== from.x) setFacing(dest.x < from.x ? 'left' : 'right');
    setWalking(true);
    setMood('walk');
    setPos(dest);
    setFootprints((prev) => [...prev.slice(-5), from]);
    window.setTimeout(() => {
      setWalking(false);
      setMood('idle');
      onArrive?.();
    }, duration * 1000);
  }, []);

  const handleSpot = useCallback(
    (word: WordItem) => {
      if (busy.current || walking) return;
      const dest = spots[word.id];
      if (!dest) return;
      onTapSound?.();
      busy.current = true;

      if (word.id === target.id) {
        setHint(`Ja! Naar ${word.emoji}…`);
        walkTo({ x: dest.x, y: Math.min(90, dest.y + 6) }, () => {
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
      walkTo({ x: dest.x, y: Math.min(90, dest.y + 6) }, () => {
        setMood('wrong');
        onWrongSound?.();
        window.setTimeout(() => {
          setMood('idle');
          busy.current = false;
          setHint(`Zoek ${target.emoji} in de ${mission.naam.toLowerCase()}`);
        }, 700);
      });
    },
    [mission.naam, onFound, onTapSound, onWrongSound, spots, target, walkTo, walking],
  );

  const handleFloor = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (busy.current || walking) return;
      if ((e.target as HTMLElement).closest('button')) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (y < room.floorMinY) return;
      onTapSound?.();
      busy.current = true;
      walkTo(
        {
          x: Math.min(92, Math.max(8, x)),
          y: Math.min(92, Math.max(room.floorMinY + 2, y)),
        },
        () => {
          busy.current = false;
        },
      );
    },
    [onTapSound, room.floorMinY, walkTo, walking],
  );

  return (
    <div className="screen explore">
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

      <div
        className={`explore__world explore__world--${mission.id}`}
        onClick={handleFloor}
        role="presentation"
      >
        <SceneBackground scene={mission.id} softVeil rich className="explore__scene" />

        <div className="explore__walk-band" style={{ top: `${room.floorMinY}%` }} />

        {footprints.map((fp, i) => (
          <span
            key={`${fp.x}-${fp.y}-${i}`}
            className="explore__print"
            style={{ left: `${fp.x}%`, top: `${fp.y}%`, opacity: 0.12 + i * 0.06 }}
          />
        ))}

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
                opacity: done ? 0.4 : 1,
              }}
              whileTap={done ? undefined : { scale: 0.9 }}
            >
              <span className="explore__spot-emoji">{w.emoji}</span>
              {isTarget && !done && <span className="explore__pulse" />}
              {!done && <span className="explore__spot-shadow" />}
            </motion.button>
          );
        })}

        <motion.div
          className="explore__lexie"
          animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          transition={{ duration: walkDuration, ease: [0.4, 0.05, 0.35, 1] }}
        >
          <div className="explore__lexie-shadow" />
          {mission.id === 'winkel' && (
            <div
              className={`explore__cart explore__cart--${facing}${walking ? ' explore__cart--rolling' : ''}`}
              aria-hidden
            >
              <span className="explore__cart-handle" />
              <span className="explore__cart-frame" />
              <span className="explore__cart-basket">
                <span className="explore__cart-wire" />
              </span>
              <span className="explore__cart-seat" />
              <span className="explore__cart-wheel explore__cart-wheel--l" />
              <span className="explore__cart-wheel explore__cart-wheel--r" />
            </div>
          )}
          <LexieCharacter mood={mood} size={118} facing={facing} />
        </motion.div>
      </div>

      <p className="explore__tip">Tik op een woordje of op de vloer om te lopen</p>

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
