import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { LEVEL_LABELS, type Level } from '../data/words';
import {
  MAP_PAGE_LABELS,
  MAP_START,
  PAGE_EXIT_PATH,
  WORLD_PLACES,
  type Point,
  type WorldPlace,
} from '../data/world';
import { LexieCharacter } from './LexieCharacter';

interface Props {
  level: Level;
  onSelectPlace: (place: WorldPlace) => void;
  onHome: () => void;
  canVisit: (missionId: string) => boolean;
}

const easeSoft = [0.45, 0.05, 0.55, 0.95] as const;
const SUN_RAYS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] as const;

const FLOWER_SPOTS = [
  { left: 8, bottom: 8, kind: 0, delay: 0 },
  { left: 16, bottom: 14, kind: 1, delay: 0.2 },
  { left: 28, bottom: 6, kind: 2, delay: 0.4 },
  { left: 38, bottom: 11, kind: 0, delay: 0.1 },
  { left: 55, bottom: 7, kind: 1, delay: 0.35 },
  { left: 68, bottom: 13, kind: 2, delay: 0.5 },
  { left: 78, bottom: 5, kind: 0, delay: 0.15 },
  { left: 90, bottom: 10, kind: 1, delay: 0.28 },
  { left: 44, bottom: 18, kind: 2, delay: 0.45 },
  { left: 22, bottom: 20, kind: 0, delay: 0.6 },
] as const;

function dist(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function joinPath(from: Point, placePath: Point[]): Point[] {
  if (placePath.length === 0) return [from];
  if (dist(from, placePath[0]) < 6) return placePath;
  return [from, ...placePath.slice(1)];
}

export function WorldMapScreen({ level, onSelectPlace, onHome, canVisit }: Props) {
  const [page, setPage] = useState<0 | 1>(0);
  const [pos, setPos] = useState<Point>(MAP_START[0]);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [walking, setWalking] = useState(false);
  const [animDuration, setAnimDuration] = useState(1.2);
  const [hint, setHint] = useState('Kies waar Lexie naartoe gaat');
  const busy = useRef(false);
  const posRef = useRef(pos);
  posRef.current = pos;

  const places = useMemo(() => {
    const map = Object.fromEntries(
      WORLD_PLACES.filter((p) => p.page === page).map((p) => [p.id, p]),
    ) as Partial<Record<WorldPlace['id'], WorldPlace>>;
    return map;
  }, [page]);

  useEffect(() => {
    const start = MAP_START[page];
    setPos(start);
    posRef.current = start;
    setWalking(false);
    busy.current = false;
    setHint(page === 0 ? 'Kies waar Lexie naartoe gaat' : 'Verderop liggen de boerderij en het bos');
  }, [page]);

  const isEnabled = useCallback(
    (place?: WorldPlace) => {
      if (!place) return false;
      if (place.kind === 'house') return true;
      if (!place.missionId) return false;
      return canVisit(place.missionId);
    },
    [canVisit],
  );

  const walkAlong = useCallback((points: Point[], onDone: () => void) => {
    if (points.length < 2) {
      onDone();
      return;
    }
    setWalking(true);
    let i = 1;

    const step = () => {
      if (i >= points.length) {
        setWalking(false);
        onDone();
        return;
      }
      const from = points[i - 1];
      const to = points[i];
      const segment = Math.min(1.1, Math.max(0.35, dist(from, to) / 40));
      setAnimDuration(segment);
      if (to.x !== from.x) setFacing(to.x < from.x ? 'left' : 'right');
      setPos(to);
      posRef.current = to;
      i += 1;
      window.setTimeout(step, segment * 1000);
    };

    step();
  }, []);

  const handlePlaceClick = useCallback(
    (place: WorldPlace) => {
      if (busy.current || walking || !isEnabled(place)) return;
      busy.current = true;
      setHint(`Naar ${place.label.toLowerCase()}…`);
      const path = joinPath(posRef.current, place.path);
      walkAlong(path, () => {
        setHint(`Bij ${place.label.toLowerCase()}`);
        window.setTimeout(() => {
          busy.current = false;
          onSelectPlace(place);
        }, 300);
      });
    },
    [isEnabled, onSelectPlace, walkAlong, walking],
  );

  const handleNext = useCallback(() => {
    if (busy.current || walking || page !== 0) return;
    busy.current = true;
    setHint('Verder het pad op…');
    const path = joinPath(posRef.current, PAGE_EXIT_PATH);
    walkAlong(path, () => {
      busy.current = false;
      setPage(1);
    });
  }, [page, walkAlong, walking]);

  return (
    <div className={`screen world-map world-map--page${page}`}>
      <header className="world-map__bar">
        <button type="button" className="icon-btn" onClick={onHome} aria-label="Terug naar start">
          ←
        </button>
        <div className="world-map__meta">
          <span>Waar wil je naartoe?</span>
          <span className="world-map__level">{LEVEL_LABELS[level]}</span>
        </div>
        <div className="icon-btn-spacer" aria-hidden />
      </header>

      <AnimatePresence mode="wait">
        <motion.p
          key={hint}
          className="world-map__hint"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {hint}
        </motion.p>
      </AnimatePresence>

      <p className="world-map__page-label">{MAP_PAGE_LABELS[page]}</p>

      <div className={`world-map__canvas world-map__canvas--page${page}`}>
        <MapSky page={page} />

        {page === 1 && <MapMountains />}

        <div className="world-map__hill world-map__hill--far" />
        <div className="world-map__hill world-map__hill--mid" />
        <div className="world-map__hill world-map__hill--near" />
        <div className="world-map__meadow" />

        <svg className="world-map__road" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {page === 0 ? (
            <>
              <path
                d="M50 95 C42 74, 28 58, 16 48"
                className="world-map__road-line"
              />
              <path
                d="M50 95 C48 70, 44 52, 42 42"
                className="world-map__road-line"
              />
              <path
                d="M50 95 C56 72, 64 54, 70 44"
                className="world-map__road-line"
              />
              <path
                d="M50 95 C64 84, 78 78, 86 72"
                className="world-map__road-line"
              />
              <path
                d="M86 72 C90 68, 95 64, 100 60"
                className="world-map__road-line world-map__road-line--exit"
              />
            </>
          ) : (
            <>
              <path
                d="M2 78 C22 76, 42 72, 58 66 C68 62, 74 58, 80 56"
                className="world-map__road-line"
              />
              <path d="M12 78 C16 70, 22 62, 28 56" className="world-map__road-line" />
            </>
          )}
        </svg>

        <div className="world-map__blades" aria-hidden>
          {Array.from({ length: 22 }, (_, i) => (
            <motion.span
              key={i}
              className="world-map__blade"
              style={{
                left: `${2 + i * 4.5}%`,
                height: `${10 + (i % 5) * 4}px`,
                bottom: `${(i % 3) * 2}%`,
              }}
              animate={{ rotate: [-10, 12, -8, 10, -10] }}
              transition={{
                duration: 2 + (i % 4) * 0.35,
                repeat: Infinity,
                ease: easeSoft,
                delay: i * 0.06,
              }}
            />
          ))}
        </div>

        {FLOWER_SPOTS.map((f, i) => (
          <motion.span
            key={`flower-${i}`}
            className={`world-map__flower world-map__flower--${f.kind}`}
            style={{ left: `${f.left}%`, bottom: `${f.bottom}%` }}
            animate={{ rotate: [-8, 10, -8], y: [0, -3, 0] }}
            transition={{
              duration: 2.6 + (i % 4) * 0.25,
              repeat: Infinity,
              ease: easeSoft,
              delay: f.delay,
            }}
            aria-hidden
          />
        ))}

        {page === 0 && (
          <>
            <VillageDecor />
            {places.huis && (
              <LandmarkHouse
                place={places.huis}
                enabled={isEnabled(places.huis)}
                walking={walking}
                onClick={() => handlePlaceClick(places.huis!)}
              />
            )}
            {places.post && (
              <LandmarkPost
                place={places.post}
                enabled={isEnabled(places.post)}
                walking={walking}
                onClick={() => handlePlaceClick(places.post!)}
              />
            )}
            {places.winkel && (
              <LandmarkShop
                place={places.winkel}
                enabled={isEnabled(places.winkel)}
                walking={walking}
                onClick={() => handlePlaceClick(places.winkel!)}
              />
            )}
            {places.park && (
              <LandmarkPark
                place={places.park}
                enabled={isEnabled(places.park)}
                walking={walking}
                onClick={() => handlePlaceClick(places.park!)}
              />
            )}
          </>
        )}

        {page === 1 && (
          <>
            <CountrysideDecor />
            {places.boerderij && (
              <LandmarkFarm
                place={places.boerderij}
                enabled={isEnabled(places.boerderij)}
                walking={walking}
                onClick={() => handlePlaceClick(places.boerderij!)}
              />
            )}
            {places.bos && (
              <LandmarkForest
                place={places.bos}
                enabled={isEnabled(places.bos)}
                walking={walking}
                onClick={() => handlePlaceClick(places.bos!)}
              />
            )}
          </>
        )}

        <MapButterfly className="world-map__butterfly--1" delay={0} />
        <MapButterfly className="world-map__butterfly--2" delay={2.2} />
        {page === 1 && <MapButterfly className="world-map__butterfly--3" delay={1.1} />}

        <motion.div
          className="world-map__lexie"
          animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          transition={{ duration: animDuration, ease: [0.4, 0.05, 0.35, 1] }}
        >
          <div className="world-map__lexie-shadow" />
          <LexieCharacter mood={walking ? 'walk' : 'wave'} size={96} facing={facing} />
        </motion.div>
      </div>

      <div className="world-map__nav">
        {page === 1 ? (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => !walking && setPage(0)}
            disabled={walking}
          >
            ← Terug naar het dorp
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={handleNext} disabled={walking}>
            Verder het pad op →
          </button>
        )}
      </div>
    </div>
  );
}

function MapSky({ page }: { page: 0 | 1 }) {
  return (
    <div className="world-map__sky" aria-hidden>
      <motion.div
        className="world-map__sun"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: easeSoft }}
      >
        <span className="world-map__sun-rays">
          {SUN_RAYS.map((deg) => (
            <span key={deg} className="world-map__ray" style={{ transform: `rotate(${deg}deg)` }}>
              <motion.span
                className="world-map__ray-beam"
                animate={{ opacity: [0.5, 0.95, 0.5], scaleY: [1, 1.15, 1] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: easeSoft,
                  delay: deg / 720,
                }}
              />
            </span>
          ))}
        </span>
      </motion.div>

      <motion.span
        className="world-map__cloud world-map__cloud--a"
        animate={{ x: [0, 36, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />
      <motion.span
        className="world-map__cloud world-map__cloud--b"
        animate={{ x: [0, -42, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
      />
      <motion.span
        className="world-map__cloud world-map__cloud--c"
        animate={{ x: [0, 28, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />

      <MapBird top="16%" duration={18} size={32} />
      <MapBird top="28%" duration={14} size={22} delay={3.5} flip />
      {page === 1 && <MapBird top="12%" duration={20} size={26} delay={7} />}
    </div>
  );
}

function MapBird({
  top,
  delay = 0,
  duration = 16,
  size = 30,
  flip = false,
}: {
  top: string;
  delay?: number;
  duration?: number;
  size?: number;
  flip?: boolean;
}) {
  return (
    <motion.div
      className="world-map__bird"
      style={{ width: size, height: size * 0.7, top }}
      initial={{ left: flip ? '112%' : '-14%' }}
      animate={{
        left: flip ? ['112%', '-14%'] : ['-14%', '112%'],
        y: [0, -14, 8, -10, 4, 0],
      }}
      transition={{
        left: { duration, delay, repeat: Infinity, ease: 'linear' },
        y: { duration: duration / 3, delay, repeat: Infinity, ease: easeSoft },
      }}
    >
      <svg
        viewBox="0 0 64 44"
        width="100%"
        height="100%"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      >
        <ellipse cx="34" cy="24" rx="13" ry="8" fill="#5a6a7a" />
        <circle cx="48" cy="20" r="6.5" fill="#5a6a7a" />
        <circle cx="50" cy="19" r="1.4" fill="#1c2b3a" />
        <path d="M54 21 L60 22 L54 24 Z" fill="#e07a4e" />
        <path d="M22 24 L10 18 L14 26 L10 30 Z" fill="#4a5a6a" />
        <motion.g
          style={{ transformOrigin: '28px 22px' }}
          animate={{ rotate: [-32, 34, -32] }}
          transition={{ duration: 0.26, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ellipse cx="22" cy="14" rx="15" ry="6" fill="#6a7a8a" />
        </motion.g>
      </svg>
    </motion.div>
  );
}

function MapButterfly({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`world-map__butterfly${className ? ` ${className}` : ''}`}
      animate={{
        x: [0, 36, 8, 48, 0],
        y: [0, -26, -8, -38, 0],
        rotate: [0, 12, -8, 16, 0],
      }}
      transition={{ duration: 9, delay, repeat: Infinity, ease: easeSoft }}
      aria-hidden
    >
      <motion.span
        className="world-map__bf-wing world-map__bf-wing--l"
        animate={{ scaleX: [1, 0.2, 1] }}
        transition={{ duration: 0.22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="world-map__bf-wing world-map__bf-wing--r"
        animate={{ scaleX: [1, 0.2, 1] }}
        transition={{ duration: 0.22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="world-map__bf-body" />
    </motion.div>
  );
}

function VillageDecor() {
  return (
    <>
      <motion.div
        className="map-deco map-town-banner"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: [0, -3, 0] }}
        transition={{
          opacity: { duration: 0.55, ease: easeSoft },
          y: { duration: 3.6, repeat: Infinity, ease: easeSoft, delay: 0.55 },
        }}
        aria-hidden
      >
        <svg className="map-town-banner__arc" viewBox="0 0 300 90" aria-hidden>
          <defs>
            <linearGradient id="lexieBannerFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff8e8" />
              <stop offset="50%" stopColor="#f0d8a8" />
              <stop offset="100%" stopColor="#e0c088" />
            </linearGradient>
            <filter id="lexieBannerShadow" x="-10%" y="-20%" width="120%" height="150%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.2" floodColor="#3a2e24" floodOpacity="0.2" />
            </filter>
            {/* Same curve for ribbon + text so margins stay even */}
            <path id="lexieDorpArc" d="M 34 58 Q 150 20 266 58" />
          </defs>
          {/* Outer border stroke */}
          <path
            d="M 34 58 Q 150 20 266 58"
            fill="none"
            stroke="#b89058"
            strokeWidth="48"
            strokeLinecap="round"
            filter="url(#lexieBannerShadow)"
          />
          {/* Board fill — equal thickness above/below the center arc */}
          <path
            d="M 34 58 Q 150 20 266 58"
            fill="none"
            stroke="url(#lexieBannerFill)"
            strokeWidth="40"
            strokeLinecap="round"
          />
          {/* Soft inner highlight */}
          <path
            d="M 34 58 Q 150 20 266 58"
            fill="none"
            stroke="rgba(255,248,240,0.4)"
            strokeWidth="30"
            strokeLinecap="round"
          />
          {/* Text centered on the ribbon (baseline nudged so glyphs sit mid-band) */}
          <text className="map-town-banner__arc-text" dy="0.32em">
            <textPath href="#lexieDorpArc" startOffset="50%" textAnchor="middle">
              <tspan fill="#e85a4a">L</tspan>
              <tspan fill="#f0c040">e</tspan>
              <tspan fill="#6cb88a">x</tspan>
              <tspan fill="#5b9fd4">i</tspan>
              <tspan fill="#e07a4e">e</tspan>
              <tspan fill="#8b5a3c">-</tspan>
              <tspan fill="#e85a4a">d</tspan>
              <tspan fill="#f0c040">o</tspan>
              <tspan fill="#6cb88a">r</tspan>
              <tspan fill="#5b9fd4">p</tspan>
            </textPath>
          </text>
          <g transform="translate(30 58)">
            <circle r="2.8" fill="#f0c040" />
            <circle cx="0" cy="-5" r="3" fill="#e85a4a" />
            <circle cx="-4.4" cy="2.5" r="3" fill="#e85a4a" />
            <circle cx="4.4" cy="2.5" r="3" fill="#e85a4a" />
          </g>
          <g transform="translate(270 58)">
            <circle r="2.8" fill="#fff8f0" />
            <circle cx="0" cy="-5" r="3" fill="#5b9fd4" />
            <circle cx="-4.4" cy="2.5" r="3" fill="#5b9fd4" />
            <circle cx="4.4" cy="2.5" r="3" fill="#5b9fd4" />
          </g>
        </svg>
      </motion.div>
      <div className="map-deco map-deco__fence" aria-hidden>
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <div className="map-deco map-deco__bush map-deco__bush--a" aria-hidden />
      <div className="map-deco map-deco__bush map-deco__bush--b" aria-hidden />
    </>
  );
}

function MapMountains() {
  return (
    <svg className="map-deco__peaks" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="mapPeakFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b7cce4" />
          <stop offset="100%" stopColor="#8eabcc" />
        </linearGradient>
        <linearGradient id="mapPeakMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8eacc8" />
          <stop offset="100%" stopColor="#6a8fb4" />
        </linearGradient>
        <linearGradient id="mapPeakNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6f96b8" />
          <stop offset="75%" stopColor="#5a8a78" />
          <stop offset="100%" stopColor="#5f8f7c" />
        </linearGradient>
      </defs>
      <path
        fill="url(#mapPeakFar)"
        d="M0 120 L30 70 L70 95 L110 40 L160 88 L210 52 L270 90 L320 48 L360 78 L400 58 L400 120 Z"
      />
      <path
        fill="url(#mapPeakMid)"
        d="M0 120 L45 82 L95 105 L145 58 L210 96 L275 68 L340 98 L400 74 L400 120 Z"
      />
      <path
        fill="url(#mapPeakNear)"
        d="M0 120 L55 92 L115 110 L175 72 L250 104 L325 84 L400 108 L400 120 Z"
      />
      <path fill="#fff" opacity="0.9" d="M110 40 L122 62 L98 62 Z" />
      <path fill="#fff" opacity="0.85" d="M210 52 L220 72 L200 72 Z" />
      <path fill="#f4f8fc" opacity="0.82" d="M320 48 L330 68 L310 68 Z" />
    </svg>
  );
}

function CountrysideDecor() {
  return (
    <>
      <div className="map-deco map-deco__wheat" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <motion.span
            key={i}
            className="map-deco__wheat-stalk"
            animate={{ rotate: [-5, 7, -5] }}
            transition={{
              duration: 2.2 + (i % 3) * 0.3,
              repeat: Infinity,
              ease: easeSoft,
              delay: i * 0.08,
            }}
          />
        ))}
      </div>
      <div className="map-deco map-deco__pond" aria-hidden>
        <motion.span
          className="map-deco__ripple"
          animate={{ scale: [0.5, 1.45], opacity: [0.5, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
        />
      </div>
      <div className="map-deco map-deco__hay" aria-hidden />
    </>
  );
}

interface LandmarkProps {
  place: WorldPlace;
  enabled: boolean;
  walking: boolean;
  onClick: () => void;
}

function LandmarkShell({
  place,
  enabled,
  walking,
  onClick,
  className,
  ariaLabel,
  children,
}: LandmarkProps & { className: string; ariaLabel: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className={`map-land ${className}${enabled ? '' : ' map-land--off'}`}
      style={{ left: `${place.x}%`, top: `${place.y}%` }}
      disabled={!enabled || walking}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {enabled && !walking && <span className="map-land__glow" aria-hidden />}
      {children}
      <span className="map-land__label">{place.label}</span>
    </button>
  );
}

function LandmarkHouse(props: LandmarkProps) {
  return (
    <LandmarkShell {...props} className="map-land--huis" ariaLabel="Ga naar het huis">
      <span className="map-huis">
        <span className="map-huis__garden" aria-hidden />
        <span className="map-huis__chimney">
          <motion.span
            className="map-huis__puff"
            animate={{ y: [0, -16], opacity: [0.55, 0], scale: [0.7, 1.35] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.span
            className="map-huis__puff map-huis__puff--2"
            animate={{ y: [0, -20], opacity: [0.4, 0], scale: [0.55, 1.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
          />
        </span>
        <span className="map-huis__roof" />
        <span className="map-huis__body">
          <span className="map-huis__window map-huis__window--l" />
          <span className="map-huis__window map-huis__window--r" />
          <span className="map-huis__door">
            <span className="map-huis__knob" />
          </span>
        </span>
        <span className="map-huis__step" />
      </span>
    </LandmarkShell>
  );
}

function LandmarkPost(props: LandmarkProps) {
  return (
    <LandmarkShell {...props} className="map-land--post" ariaLabel="Ga naar de post">
      <span className="map-post">
        <span className="map-post__parcels" aria-hidden>
          <span className="map-post__parcel map-post__parcel--a" />
          <span className="map-post__parcel map-post__parcel--b" />
        </span>
        <span className="map-post__sack" aria-hidden />
        <span className="map-post__box">
          <span className="map-post__cap" />
          <span className="map-post__slot" />
          <span className="map-post__door" />
          <motion.span
            className="map-post__flag"
            animate={{ rotate: [-8, -48, -8] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: easeSoft, times: [0, 0.18, 1] }}
          />
        </span>
        <span className="map-post__leg" />
        <span className="map-post__base" />
      </span>
    </LandmarkShell>
  );
}

function LandmarkShop(props: LandmarkProps) {
  return (
    <LandmarkShell {...props} className="map-land--winkel" ariaLabel="Ga naar de winkel">
      <span className="map-winkel">
        <span className="map-winkel__roof" aria-hidden />
        <span className="map-winkel__signboard" aria-hidden>
          <span className="map-winkel__signboard-text">WINKEL</span>
        </span>
        <span className="map-winkel__awning" aria-hidden>
          <i /><i /><i /><i /><i /><i /><i /><i />
        </span>
        <span className="map-winkel__body">
          <span className="map-winkel__window">
            <span className="map-winkel__pane">
              <span className="map-winkel__produce">🍎</span>
              <span className="map-winkel__produce">🍌</span>
              <span className="map-winkel__produce">🥕</span>
            </span>
            <span className="map-winkel__pane map-winkel__pane--2">
              <span className="map-winkel__produce">🧀</span>
              <span className="map-winkel__produce">🍞</span>
            </span>
            <span className="map-winkel__sill" />
          </span>
          <span className="map-winkel__door">
            <span className="map-winkel__door-glass" />
            <span className="map-winkel__door-handle" />
          </span>
        </span>
        <span className="map-winkel__crate" aria-hidden>
          <span>🍎</span>
          <span>🍊</span>
        </span>
        <motion.span
          className="map-winkel__cart"
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: easeSoft }}
        >
          🛒
        </motion.span>
        <span className="map-winkel__mat" aria-hidden />
      </span>
    </LandmarkShell>
  );
}

function LandmarkPark(props: LandmarkProps) {
  return (
    <LandmarkShell {...props} className="map-land--park" ariaLabel="Ga naar het park">
      <span className="map-park">
        <motion.span
          className="map-park__tree map-park__tree--a"
          animate={{ rotate: [-2, 2.5, -2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: easeSoft }}
        />
        <motion.span
          className="map-park__tree map-park__tree--b"
          animate={{ rotate: [2, -2.5, 2] }}
          transition={{ duration: 4, repeat: Infinity, ease: easeSoft }}
        />
        <span className="map-park__bench" />
        <motion.span
          className="map-park__ball"
          animate={{ y: [0, -9, 0], rotate: [0, 35, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        >
          ⚽
        </motion.span>
        <span className="map-park__flower map-park__flower--1" />
        <span className="map-park__flower map-park__flower--2" />
      </span>
    </LandmarkShell>
  );
}

function LandmarkFarm(props: LandmarkProps) {
  return (
    <LandmarkShell {...props} className="map-land--boerderij" ariaLabel="Ga naar de boerderij">
      <span className="map-farm">
        <span className="map-farm__ground" />
        <span className="map-farm__fence" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} />
          ))}
        </span>
        <span className="map-farm__field" />
        <span className="map-farm__silo">
          <span className="map-farm__silo-cap" />
        </span>
        <span className="map-farm__barn">
          <span className="map-farm__roof" />
          <span className="map-farm__loft" />
          <span className="map-farm__door" />
        </span>
        <motion.span
          className="map-farm__cow"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: easeSoft }}
        >
          🐄
        </motion.span>
        <motion.span
          className="map-farm__chick"
          animate={{ x: [0, 12, 12, 0], scaleX: [1, 1, -1, -1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', times: [0, 0.42, 0.5, 1] }}
        >
          🐥
        </motion.span>
        <span className="map-farm__hay">🌾</span>
      </span>
    </LandmarkShell>
  );
}

function LandmarkForest(props: LandmarkProps) {
  return (
    <LandmarkShell {...props} className="map-land--bos" ariaLabel="Ga naar het bos">
      <span className="map-bos">
        <motion.span
          className="map-bos__tree map-bos__tree--1"
          animate={{ rotate: [-1.5, 2, -1.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: easeSoft }}
        />
        <motion.span
          className="map-bos__tree map-bos__tree--2"
          animate={{ rotate: [1.5, -2, 1.5] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: easeSoft }}
        />
        <motion.span
          className="map-bos__tree map-bos__tree--3"
          animate={{ rotate: [-2, 1.5, -2] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: easeSoft }}
        />
        <motion.span
          className="map-bos__owl"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: easeSoft }}
          aria-hidden
        >
          <span className="map-bos__owl-body" />
          <span className="map-bos__owl-eye map-bos__owl-eye--l" />
          <span className="map-bos__owl-eye map-bos__owl-eye--r" />
          <span className="map-bos__owl-beak" />
        </motion.span>
        <span className="map-bos__mushroom" aria-hidden />
        <span className="map-bos__bush" aria-hidden />
      </span>
    </LandmarkShell>
  );
}
