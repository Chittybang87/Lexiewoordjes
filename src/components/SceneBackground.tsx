import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  scene: string;
  className?: string;
  /** Lighter overlay so the room stays readable while exploring. */
  softVeil?: boolean;
  /** Extra furniture/detail when Lexie walks the room. */
  rich?: boolean;
}

const easeSoft = [0.45, 0.05, 0.55, 0.95] as const;
const SUN_RAYS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] as const;

export function SceneBackground({ scene, className, softVeil, rich }: Props) {
  return (
    <div
      className={`scene scene--${scene}${rich ? ' scene--rich' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden
    >
      {scene === 'keuken' && <KitchenScene rich={rich} />}
      {scene === 'winkel' && <ShopScene rich={rich} />}
      {scene === 'post' && <PostScene rich={rich} />}
      {scene === 'park' && <ParkScene rich={rich} />}
      {scene === 'boerderij' && <FarmScene rich={rich} />}
      {scene === 'bos' && <ForestScene rich={rich} />}
      <div className={`scene__veil${softVeil ? ' scene__veil--soft' : ''}`} />
    </div>
  );
}

/** SVG bird with flapping wings + flight path */
function FlyingBird({
  className,
  delay = 0,
  duration = 14,
  size = 36,
  flip = false,
}: {
  className?: string;
  delay?: number;
  duration?: number;
  size?: number;
  flip?: boolean;
}) {
  return (
    <motion.div
      className={`flying-bird${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size * 0.7 }}
      initial={{ x: flip ? '110vw' : '-15vw', y: 0 }}
      animate={{
        x: flip ? ['110vw', '-20vw'] : ['-15vw', '115vw'],
        y: [0, -28, 12, -18, 8, -22, 0],
        rotate: flip
          ? [0, -6, 4, -8, 3, -5, 0]
          : [0, 6, -4, 8, -3, 5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
        times: [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1],
      }}
    >
      <svg
        viewBox="0 0 64 44"
        width="100%"
        height="100%"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      >
        {/* body */}
        <ellipse cx="34" cy="24" rx="14" ry="9" fill="#5a6a7a" />
        <ellipse cx="34" cy="26" rx="10" ry="6" fill="#7a8a9a" />
        {/* head */}
        <circle cx="48" cy="20" r="7" fill="#5a6a7a" />
        <circle cx="50" cy="19" r="1.6" fill="#1c2b3a" />
        <path d="M54 21 L60 22 L54 24 Z" fill="#e07a4e" />
        {/* tail */}
        <path d="M20 24 L8 18 L12 26 L8 30 Z" fill="#4a5a6a" />
        {/* left wing (flaps) */}
        <motion.g
          style={{ transformOrigin: '28px 22px', transformBox: 'fill-box' as const }}
          animate={{ rotate: [-32, 36, -32] }}
          transition={{ duration: 0.26, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ellipse cx="22" cy="14" rx="16" ry="7" fill="#6a7a8a" />
          <ellipse cx="20" cy="13" rx="10" ry="4" fill="#8a9aaa" opacity="0.7" />
        </motion.g>
        {/* right wing tip */}
        <motion.g
          style={{ transformOrigin: '36px 24px', transformBox: 'fill-box' as const }}
          animate={{ rotate: [22, -26, 22] }}
          transition={{ duration: 0.26, repeat: Infinity, ease: 'easeInOut', delay: 0.03 }}
        >
          <ellipse cx="30" cy="30" rx="11" ry="5" fill="#4a5a6a" />
        </motion.g>
      </svg>
    </motion.div>
  );
}

function Butterfly({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`butterfly${className ? ` ${className}` : ''}`}
      animate={{
        x: [0, 40, 10, 55, 0],
        y: [0, -30, -10, -45, 0],
        rotate: [0, 15, -10, 20, 0],
      }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: easeSoft }}
    >
      <motion.span
        className="butterfly__wing butterfly__wing--l"
        animate={{ scaleX: [1, 0.25, 1] }}
        transition={{ duration: 0.22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="butterfly__wing butterfly__wing--r"
        animate={{ scaleX: [1, 0.25, 1] }}
        transition={{ duration: 0.22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="butterfly__body" />
    </motion.div>
  );
}

/** Landing spots match .forest__tree--4 / --7 / --8 arms (from the trunk). */
const OWL_PERCHES = [
  { left: 'calc(10% + 68px)', bottom: 'calc(14% + 58px)', flip: false },
  { left: 'calc(100% - 12% - 78px)', bottom: 'calc(15% + 48px)', flip: true },
  { left: 'calc(58% + 52px)', bottom: 'calc(17% + 44px)', flip: false },
] as const;

function ForestOwlSvg({ flying }: { flying?: boolean }) {
  return (
    <svg viewBox="0 0 56 68" width="100%" height="100%" aria-hidden>
      <ellipse cx="28" cy="42" rx="16" ry="18" fill="#b8956a" />
      <ellipse cx="28" cy="44" rx="10" ry="12" fill="#f3e6c8" />
      <motion.ellipse
        cx="14"
        cy="44"
        rx="6"
        ry="11"
        fill="#8f6b42"
        style={{ transformOrigin: '18px 40px', transformBox: 'fill-box' as const }}
        animate={flying ? { rotate: [-40, 35, -40] } : { rotate: -8 }}
        transition={flying ? { duration: 0.22, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
      />
      <motion.ellipse
        cx="42"
        cy="44"
        rx="6"
        ry="11"
        fill="#8f6b42"
        style={{ transformOrigin: '38px 40px', transformBox: 'fill-box' as const }}
        animate={flying ? { rotate: [40, -35, 40] } : { rotate: 8 }}
        transition={flying ? { duration: 0.22, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
      />
      <circle cx="28" cy="22" r="15" fill="#a67c4e" />
      <path d="M15 16 L11 5 L21 13 Z" fill="#7a5732" />
      <path d="M41 16 L45 5 L35 13 Z" fill="#7a5732" />
      <ellipse cx="28" cy="24" rx="12" ry="9" fill="#f7ecd4" />
      <circle cx="22" cy="23" r="5.5" fill="#fffdf6" />
      <circle cx="34" cy="23" r="5.5" fill="#fffdf6" />
      <motion.g
        animate={flying ? { scaleY: 1 } : { scaleY: [1, 1, 1, 0.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.75, 0.84, 0.9, 1] }}
        style={{ transformOrigin: '22px 23px', transformBox: 'fill-box' as const }}
      >
        <circle cx="22" cy="23" r="2.8" fill="#2a1f14" />
        <circle cx="23" cy="22" r="0.9" fill="#fff" />
      </motion.g>
      <motion.g
        animate={flying ? { scaleY: 1 } : { scaleY: [1, 1, 1, 0.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.75, 0.84, 0.9, 1] }}
        style={{ transformOrigin: '34px 23px', transformBox: 'fill-box' as const }}
      >
        <circle cx="34" cy="23" r="2.8" fill="#2a1f14" />
        <circle cx="35" cy="22" r="0.9" fill="#fff" />
      </motion.g>
      <path d="M28 26 L25.5 30.5 L30.5 30.5 Z" fill="#e07a4e" />
      <path d="M20 58 L18 63 L22 61 L24 63 L26 58" fill="#e07a4e" />
      <path d="M30 58 L32 63 L36 61 L38 63 L36 58" fill="#e07a4e" />
    </svg>
  );
}

function ForestOwlFlyer() {
  const [perch, setPerch] = useState(0);
  const [flying, setFlying] = useState(false);
  const spot = OWL_PERCHES[perch];

  return (
    <motion.button
      type="button"
      className="forest-owl forest-owl--flyer"
      aria-label="Uil — klik om te laten vliegen"
      onClick={(e) => {
        e.stopPropagation();
        if (flying) return;
        setFlying(true);
        setPerch((p) => (p + 1) % OWL_PERCHES.length);
        window.setTimeout(() => setFlying(false), 1100);
      }}
      initial={false}
      animate={{
        left: spot.left,
        bottom: spot.bottom,
        y: flying ? [0, -28, -10, 0] : [0, -2, 0],
        scaleX: spot.flip ? -1 : 1,
        scaleY: 1,
        rotate: flying ? [0, -12, 8, 0] : 0,
      }}
      transition={
        flying
          ? { duration: 1.05, ease: easeSoft }
          : { y: { duration: 3.2, repeat: Infinity, ease: easeSoft }, duration: 1.05, ease: easeSoft }
      }
      whileHover={
        flying ? undefined : { scaleX: spot.flip ? -1.08 : 1.08, scaleY: 1.08 }
      }
      whileTap={
        flying ? undefined : { scaleX: spot.flip ? -0.94 : 0.94, scaleY: 0.94 }
      }
    >
      <ForestOwlSvg flying={flying} />
    </motion.button>
  );
}

/** Chick that walks back and forth with a hop step */
function FarmChick({
  className,
  delay = 0,
  distance = 90,
  duration = 8,
}: {
  className?: string;
  delay?: number;
  /** Horizontal walk distance in px */
  distance?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={`farm__chick${className ? ` ${className}` : ''}`}
      animate={{
        x: [0, distance, distance, 0, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
        times: [0, 0.42, 0.5, 0.92, 1],
        delay,
      }}
    >
      <motion.span
        className="farm__chick-hop"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.32, repeat: Infinity, ease: 'easeOut' }}
      >
        🐥
      </motion.span>
    </motion.div>
  );
}

function ForestFox({ className }: { className?: string }) {
  const [playful, setPlayful] = useState(false);

  return (
    <motion.button
      type="button"
      className={`forest-fox${className ? ` ${className}` : ''}`}
      aria-label="Vos"
      onClick={(e) => {
        e.stopPropagation();
        if (playful) return;
        setPlayful(true);
        window.setTimeout(() => setPlayful(false), 900);
      }}
      animate={
        playful
          ? { y: [0, -18, -6, -14, 0], rotate: [0, -8, 6, -4, 0], scale: [1, 1.08, 1.02, 1.06, 1] }
          : { y: [0, -1.5, 0], rotate: 0, scale: 1 }
      }
      transition={
        playful
          ? { duration: 0.85, ease: 'easeOut' }
          : { duration: 2.6, repeat: Infinity, ease: easeSoft }
      }
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      {/* Side-view sitting fox facing left — one natural eye */}
      <svg viewBox="0 0 100 70" width="100%" height="100%" aria-hidden>
        <ellipse cx="48" cy="64" rx="20" ry="3.5" fill="rgba(58,46,36,0.18)" />
        {/* tail behind body */}
        <motion.g
          animate={playful ? { rotate: [-18, 22, -14, 18, -6] } : { rotate: [-6, 8, -6] }}
          transition={
            playful
              ? { duration: 0.85, ease: 'easeOut' }
              : { duration: 2.2, repeat: Infinity, ease: easeSoft }
          }
          style={{ transformOrigin: '62px 40px' }}
        >
          <path
            d="M58 40
               C72 22, 92 24, 94 38
               C95 48, 84 54, 70 50
               C64 48, 60 44, 58 40 Z"
            fill="#e88850"
          />
          <path
            d="M86 28 C92 27, 95 34, 93 40 C89 35, 87 32, 86 28 Z"
            fill="#fff8f0"
          />
        </motion.g>
        {/* haunch + body */}
        <ellipse cx="52" cy="46" rx="16" ry="13" fill="#e88850" />
        <ellipse cx="48" cy="50" rx="9" ry="7" fill="#fff4e8" />
        <ellipse cx="58" cy="52" rx="10" ry="11" fill="#d86e3c" />
        {/* front leg tucked */}
        <ellipse cx="36" cy="54" rx="6" ry="8" fill="#d86e3c" />
        <ellipse cx="34" cy="60" rx="5" ry="2.8" fill="#3a2e24" />
        <ellipse cx="56" cy="60" rx="5.5" ry="2.8" fill="#3a2e24" />
        {/* neck + head in profile */}
        <ellipse cx="34" cy="36" rx="8" ry="7" fill="#e88850" />
        <ellipse cx="28" cy="28" rx="12" ry="10" fill="#e88850" />
        {/* ears */}
        <path d="M24 20 L20 6 L30 16 Z" fill="#e88850" />
        <path d="M25 18 L23 10 L29 16 Z" fill="#f5b89a" />
        <path d="M34 18 L40 5 L40 18 Z" fill="#e88850" />
        <path d="M35 17 L38 9 L38 17 Z" fill="#f5b89a" />
        {/* snout */}
        <ellipse cx="18" cy="32" rx="8" ry="5.5" fill="#fff4e8" />
        <ellipse cx="12" cy="31.5" rx="2.2" ry="1.6" fill="#2a2218" />
        {/* single profile eye — pupil centered in the eye */}
        <ellipse cx="26" cy="26" rx="3.6" ry="3.9" fill="#fffdf8" />
        <circle cx="26" cy="26.2" r="2.1" fill="#4a2c14" />
        <circle cx="26" cy="26.2" r="1.15" fill="#1a120c" />
        <circle cx="26.7" cy="25.4" r="0.55" fill="#fff" />
        {/* soft smile */}
        <path d="M14 35 Q18 37.5 22 35" fill="none" stroke="#c45c38" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    </motion.button>
  );
}

function SceneSun({ className }: { className?: string }) {
  const [sunBurst, setSunBurst] = useState(false);

  return (
    <motion.button
      type="button"
      className={`park__sun${sunBurst ? ' park__sun--burst' : ''}${className ? ` ${className}` : ''}`}
      aria-label="Zon"
      onClick={() => {
        if (sunBurst) return;
        setSunBurst(true);
        window.setTimeout(() => setSunBurst(false), 900);
      }}
      animate={
        sunBurst
          ? { scale: [1, 1.38, 1.08], rotate: [0, 220, 360] }
          : { scale: [1, 1.08, 1], rotate: [0, 8, 0] }
      }
      transition={
        sunBurst
          ? { duration: 0.85, ease: 'easeOut' }
          : { duration: 8, repeat: Infinity, ease: easeSoft }
      }
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
    >
      <span className="park__sun-rays" aria-hidden>
        {SUN_RAYS.map((deg) => (
          <span key={deg} className="park__ray" style={{ transform: `rotate(${deg}deg)` }}>
            <motion.span
              className="park__ray-beam"
              animate={
                sunBurst
                  ? { opacity: [1, 1, 0.85], scaleY: [1, 1.45, 1.1] }
                  : { opacity: [0.75, 1, 0.75], scaleY: [1, 1.18, 1] }
              }
              transition={{
                duration: sunBurst ? 0.85 : 2.8,
                repeat: sunBurst ? 0 : Infinity,
                ease: easeSoft,
                delay: sunBurst ? 0 : deg / 720,
              }}
            />
          </span>
        ))}
      </span>
      <span className="park__sun-face" aria-hidden />
    </motion.button>
  );
}

function ForestPine({
  className,
  deep,
  sway = 2.5,
  duration = 5,
  arm,
}: {
  className?: string;
  deep?: boolean;
  sway?: number;
  duration?: number;
  /** Thin branch growing out of this tree's trunk for the owl. */
  arm?: 'left' | 'right';
}) {
  return (
    <div
      className={`forest__tree${className ? ` ${className}` : ''}${arm ? ' forest__tree--armed' : ''}`}
    >
      <span className="forest__trunk" />
      <span className="forest__trunk-knot" />
      {arm && <span className={`forest__arm forest__arm--${arm}`} aria-hidden />}
      <motion.span
        className={`forest__foliage${deep ? ' forest__foliage--deep' : ''}`}
        animate={{ rotate: [-sway, sway, -sway], x: [0, sway * 0.6, 0] }}
        transition={{ duration, repeat: Infinity, ease: easeSoft }}
      >
        <span className="forest__layer forest__layer--1" />
        <span className="forest__layer forest__layer--2" />
        <span className="forest__layer forest__layer--3" />
        <span className="forest__layer forest__layer--4" />
        <span className="forest__highlight" />
      </motion.span>
    </div>
  );
}

function KitchenScene({ rich }: { rich?: boolean }) {
  return (
    <>
      <div className="scene__sky scene__sky--warm" />
      <div className="scene__wall scene__wall--kitchen" />
      <div className="kitchen__cabinets">
        <span /><span /><span /><span />
      </div>
      <div className="kitchen__counter" />
      <div className="kitchen__floor" />
      <div className="kitchen__rug" />

      <div className="kitchen__window">
        <motion.div
          className="kitchen__curtain kitchen__curtain--l"
          animate={{ skewX: [0, 4, 0, -3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: easeSoft }}
        />
        <motion.div
          className="kitchen__curtain kitchen__curtain--r"
          animate={{ skewX: [0, -4, 0, 3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: easeSoft, delay: 0.3 }}
        />
        {[0, 0.5, 1.1, 1.7].map((d) => (
          <motion.span
            key={d}
            className="kitchen__steam"
            style={{ left: `${35 + d * 12}%` }}
            animate={{ y: [0, -40], x: [0, 6, -4, 8], opacity: [0, 0.7, 0], scale: [0.6, 1.2, 1.4] }}
            transition={{ duration: 2.8, delay: d, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
      </div>

      <div className="kitchen__stove">
        <span className="kitchen__knob" />
        <span className="kitchen__knob" />
        <motion.span
          className="kitchen__flame kitchen__flame--back"
          animate={{ scaleY: [1, 1.35, 0.85, 1.2, 1], scaleX: [1, 0.9, 1.1, 0.95, 1], opacity: [0.5, 0.8, 0.55, 0.75, 0.5] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="kitchen__flame"
          animate={{ scaleY: [1, 1.4, 0.8, 1.25, 0.95, 1.15, 1], opacity: [0.85, 1, 0.7, 1, 0.8, 1, 0.85] }}
          transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="kitchen__pot"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: easeSoft }}
      >
        {[0, 0.4, 0.9].map((d) => (
          <motion.span
            key={d}
            className="kitchen__pot-steam"
            animate={{ y: [0, -24], opacity: [0.6, 0], scale: [0.5, 1.3] }}
            transition={{ duration: 2, delay: d, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
      </motion.div>

      <div className="kitchen__fridge">
        <span className="kitchen__fridge-handle" />
        <span className="kitchen__fridge-magnet" />
      </div>

      {rich && (
        <>
          <div className="kitchen__sink">
            <span className="kitchen__faucet" />
            <motion.span
              className="kitchen__drip"
              animate={{ y: [0, 18], opacity: [0.9, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeIn', delay: 0.4 }}
            />
          </div>
          <div className="kitchen__table">
            <span className="kitchen__table-leg kitchen__table-leg--l" />
            <span className="kitchen__table-leg kitchen__table-leg--r" />
            <span className="kitchen__bowl">🍎</span>
          </div>
          <div className="kitchen__chair kitchen__chair--l" />
          <div className="kitchen__chair kitchen__chair--r" />
          <div className="kitchen__microwave" />
          <div className="kitchen__clock">🕐</div>
          <div className="kitchen__toaster" />
          <div className="kitchen__plant">🪴</div>
          <div className="kitchen__shelf-jars">
            <span /><span /><span />
          </div>
        </>
      )}

      <motion.div
        className="kitchen__light"
        animate={{ opacity: [0.35, 0.55, 0.4, 0.6, 0.35] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: easeSoft }}
      />
    </>
  );
}

function ShopScene({ rich }: { rich?: boolean }) {
  const [clerkWave, setClerkWave] = useState(false);
  const [registerBeep, setRegisterBeep] = useState(false);

  return (
    <>
      <div className="scene__sky scene__sky--shop" />
      <div className="shop__wall" />
      <div className="shop__wainscot" />

      <motion.div
        className="shop__awning"
        animate={{ y: [0, 2, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: easeSoft }}
      >
        <span /><span /><span /><span /><span /><span /><span /><span />
      </motion.div>

      <div className="shop__floor">
        <div className="shop__aisle" />
        <div className="shop__aisle shop__aisle--2" />
        {rich && <div className="shop__mat" />}
      </div>

      {/* Hanging shop lamp */}
      <motion.div
        className="shop__lamp"
        animate={{ rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: easeSoft }}
      >
        <span className="shop__lamp-cord" />
        <span className="shop__lamp-shade" />
        <motion.span
          className="shop__lamp-glow"
          animate={{ opacity: [0.3, 0.5, 0.35, 0.55, 0.3] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: easeSoft }}
        />
      </motion.div>

      {/* Left aisle shelves – places for word spots */}
      <div className="shop__rack shop__rack--left">
        <div className="shop__rack-sign">AANBIEDING</div>
        <div className="shop__shelf">
          {['red', 'yellow', 'green', 'blue', 'orange'].map((c, i) => (
            <motion.span
              key={`l1-${c}`}
              className={`shop__item shop__item--${c}`}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.2 + i * 0.2, repeat: Infinity, ease: easeSoft, delay: i * 0.15 }}
            />
          ))}
        </div>
        <div className="shop__shelf">
          {['blue', 'pink', 'yellow', 'green', 'red'].map((c, i) => (
            <motion.span
              key={`l2-${c}`}
              className={`shop__item shop__item--${c} shop__item--can`}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.4 + i * 0.18, repeat: Infinity, ease: easeSoft, delay: 0.3 + i * 0.12 }}
            />
          ))}
        </div>
        <div className="shop__shelf">
          {['green', 'orange', 'pink', 'blue', 'yellow'].map((c, i) => (
            <motion.span
              key={`l3-${c}`}
              className={`shop__item shop__item--${c} shop__item--bottle`}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.6 + i * 0.15, repeat: Infinity, ease: easeSoft, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Mid rack */}
      <div className="shop__rack shop__rack--mid">
        <div className="shop__shelf">
          {['yellow', 'red', 'blue', 'pink'].map((c, i) => (
            <motion.span
              key={`m1-${c}`}
              className={`shop__item shop__item--${c} shop__item--box`}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.3 + i * 0.2, repeat: Infinity, ease: easeSoft, delay: i * 0.14 }}
            />
          ))}
        </div>
        <div className="shop__shelf">
          {['orange', 'green', 'yellow', 'red'].map((c, i) => (
            <motion.span
              key={`m2-${c}`}
              className={`shop__item shop__item--${c} shop__item--can`}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.5 + i * 0.18, repeat: Infinity, ease: easeSoft, delay: 0.2 + i * 0.1 }}
            />
          ))}
        </div>
        <div className="shop__shelf">
          {['pink', 'blue', 'orange'].map((c, i) => (
            <motion.span
              key={`m3-${c}`}
              className={`shop__item shop__item--${c} shop__item--bottle`}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.4 + i * 0.2, repeat: Infinity, ease: easeSoft, delay: i * 0.12 }}
            />
          ))}
        </div>
      </div>

      {/* Price tags on shelves */}
      <motion.div
        className="shop__price-tag shop__price-tag--1"
        animate={{ rotate: [-6, -10, -6] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: easeSoft }}
      >
        €
      </motion.div>
      <motion.div
        className="shop__price-tag shop__price-tag--2"
        animate={{ rotate: [8, 4, 8] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: easeSoft, delay: 0.4 }}
      >
        €
      </motion.div>

      {/* Checkout / kassa */}
      <div className="shop__checkout">
        <div className="shop__checkout-sign">KASSA</div>
        {/* Clerk behind the counter, on the right */}
        <motion.button
          type="button"
          className={`shop__clerk${clerkWave ? ' shop__clerk--wave' : ''}`}
          aria-label="Winkelbediende"
          onClick={(e) => {
            e.stopPropagation();
            if (clerkWave) return;
            setClerkWave(true);
            window.setTimeout(() => setClerkWave(false), 1600);
          }}
          whileTap={{ scale: 1.05 }}
        >
          <span className="shop__clerk-hair" />
          <span className="shop__clerk-hair-side shop__clerk-hair-side--l" />
          <span className="shop__clerk-hair-side shop__clerk-hair-side--r" />
          <span className="shop__clerk-hair-bun" />
          <span className="shop__clerk-head">
            <span className="shop__clerk-eye shop__clerk-eye--l" />
            <span className="shop__clerk-eye shop__clerk-eye--r" />
            <span className="shop__clerk-blush shop__clerk-blush--l" />
            <span className="shop__clerk-blush shop__clerk-blush--r" />
            <span className="shop__clerk-smile" />
          </span>
          <span className="shop__clerk-body" />
          <span className="shop__clerk-apron" />
          <span className="shop__clerk-arm shop__clerk-arm--l" />
          <motion.span
            className="shop__clerk-arm shop__clerk-arm--r"
            animate={
              clerkWave
                ? { rotate: [-10, -70, -20, -75, -15, -65, -10] }
                : { rotate: -10 }
            }
            transition={
              clerkWave
                ? { duration: 1.4, ease: 'easeInOut' }
                : { duration: 0.25 }
            }
          />
        </motion.button>

        <div className="shop__counter">
          <motion.button
            type="button"
            className={`shop__register${registerBeep ? ' shop__register--beep' : ''}`}
            aria-label="Kassa"
            onClick={(e) => {
              e.stopPropagation();
              if (registerBeep) return;
              setRegisterBeep(true);
              window.setTimeout(() => setRegisterBeep(false), 700);
            }}
            whileTap={{ scale: 0.94 }}
          >
            <span className="shop__register-screen">
              <motion.span
                className="shop__register-digit"
                animate={
                  registerBeep
                    ? { opacity: [1, 0.2, 1, 0.2, 1] }
                    : { opacity: [0.85, 1, 0.85] }
                }
                transition={
                  registerBeep
                    ? { duration: 0.6 }
                    : { duration: 2.4, repeat: Infinity, ease: easeSoft }
                }
              >
                12
              </motion.span>
            </span>
            <span className="shop__register-keys">
              <i /><i /><i /><i />
            </span>
            <span className="shop__register-drawer" />
          </motion.button>
          <span className="shop__conveyor" />
        </div>
      </div>

      <div className="shop__door">
        <span className="shop__door-glass" />
        <span className="shop__door-handle" />
      </div>

      {/* Decorative rolling cart only in game/intro view – in explore Lexie pushes one */}
      {!rich && (
        <motion.div
          className="shop__cart"
          animate={{ x: [0, 52, 52, 0, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: easeSoft,
            times: [0, 0.4, 0.55, 0.95, 1],
          }}
        >
          <span className="shop__cart-handle" />
          <span className="shop__cart-frame" />
          <span className="shop__cart-basket">
            <span className="shop__cart-wire" />
          </span>
          <span className="shop__cart-seat" />
          <motion.span
            className="shop__wheel shop__wheel--l"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.span
            className="shop__wheel shop__wheel--r"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}

      {rich && (
        <div className="shop__fridge">
          <span className="shop__fridge-glass" />
          <span className="shop__fridge-shelf" />
          <span className="shop__fridge-shelf shop__fridge-shelf--2" />
          <span className="shop__fridge-handle" />
          <span className="shop__fridge-base" />
        </div>
      )}

      <motion.span
        className="shop__sparkle"
        animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: [0, 90] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
      />
      <motion.span
        className="shop__sparkle shop__sparkle--2"
        animate={{ scale: [0, 1.1, 0], opacity: [0, 1, 0], rotate: [0, -70] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
      />
    </>
  );
}

function PostScene({ rich }: { rich?: boolean }) {
  const [clockSpin, setClockSpin] = useState(false);
  const [clerkWave, setClerkWave] = useState(false);

  return (
    <>
      <div className="scene__sky scene__sky--post" />
      <div className="post__wall" />
      <div className="post__wainscot" />
      <div className="post__floor">
        <span className="post__tile" />
        <span className="post__tile" />
        <span className="post__tile" />
        <span className="post__tile" />
        {rich && <div className="post__mat" />}
      </div>

      {/* Wall clock */}
      <motion.button
        type="button"
        className="post__clock"
        aria-label="Uurwerk"
        onClick={() => {
          if (clockSpin) return;
          setClockSpin(true);
          window.setTimeout(() => setClockSpin(false), 1600);
        }}
        whileTap={{ scale: 0.94 }}
      >
        <span className="post__clock-face">
          <motion.span
            className="post__clock-hand post__clock-hand--hour"
            animate={
              clockSpin
                ? { rotate: [120, 120 + 720] }
                : { rotate: [120, 150] }
            }
            transition={
              clockSpin
                ? { duration: 1.5, ease: 'easeInOut' }
                : { duration: 60, repeat: Infinity, ease: 'linear' }
            }
          />
          <motion.span
            className="post__clock-hand post__clock-hand--minute"
            animate={
              clockSpin
                ? { rotate: [0, 1440] }
                : { rotate: [0, 360] }
            }
            transition={
              clockSpin
                ? { duration: 1.5, ease: 'easeInOut' }
                : { duration: 8, repeat: Infinity, ease: 'linear' }
            }
          />
          <span className="post__clock-center" />
        </span>
      </motion.button>

      {/* Wall map / poster */}
      <div className="post__poster">
        <span className="post__poster-map" />
        <span className="post__poster-pin post__poster-pin--1" />
        <span className="post__poster-pin post__poster-pin--2" />
      </div>

      {/* Stamp poster */}
      <div className="post__stamp-board">
        <span /><span /><span /><span />
      </div>

      {/* Hanging lamp */}
      <motion.div
        className="post__lamp"
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: easeSoft }}
      >
        <span className="post__lamp-cord" />
        <span className="post__lamp-shade" />
        <motion.span
          className="post__lamp-glow"
          animate={{ opacity: [0.35, 0.55, 0.4, 0.6, 0.35] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: easeSoft }}
        />
      </motion.div>

      {/* Service counter / loket */}
      <div className="post__loket">
        <div className="post__loket-glass">
          <span className="post__loket-slot" />
          <span className="post__loket-frame" />
        </div>
        <div className="post__loket-desk">
          <span className="post__inkpad" />
          <span className="post__desk-pen" />
          <span className="post__desk-letter" />
          <span className="post__scale-body">
            <span className="post__scale-pan" />
          </span>
        </div>
        <div className="post__loket-sign">POST</div>

        {/* Postal worker behind desk */}
        <motion.button
          type="button"
          className="post__clerk"
          aria-label="Postbediende"
          onClick={() => {
            if (clerkWave) return;
            setClerkWave(true);
            window.setTimeout(() => setClerkWave(false), 1400);
          }}
          whileTap={{ scale: 1.04 }}
        >
          <span className="post__clerk-hat" />
          <span className="post__clerk-head">
            <span className="post__clerk-eye post__clerk-eye--l" />
            <span className="post__clerk-eye post__clerk-eye--r" />
            <span className="post__clerk-smile" />
          </span>
          <span className="post__clerk-body" />
          <motion.span
            className="post__clerk-arm"
            animate={
              clerkWave
                ? { rotate: [0, -75, -45, -90, -40, -80, 0] }
                : { rotate: 0 }
            }
            transition={
              clerkWave
                ? { duration: 1.3, ease: 'easeInOut' }
                : { duration: 0.3 }
            }
          />
        </motion.button>
      </div>

      {/* Sorting shelves behind / beside loket */}
      <div className="post__shelves">
        <div className="post__shelf">
          <span className="post__mail-slot" />
          <span className="post__mail-slot" />
          <span className="post__mail-slot" />
        </div>
        <div className="post__shelf">
          <span className="post__mail-slot post__mail-slot--red" />
          <span className="post__mail-slot post__mail-slot--blue" />
          <span className="post__mail-slot post__mail-slot--cream" />
        </div>
      </div>

      {/* Parcel stack on the floor */}
      <div className="post__parcels">
        <span className="post__parcel post__parcel--lg">
          <span className="post__parcel-tape" />
          <span className="post__parcel-label" />
        </span>
        <span className="post__parcel post__parcel--md">
          <span className="post__parcel-tape" />
          <span className="post__parcel-stamp" />
        </span>
        <span className="post__parcel post__parcel--sm">
          <span className="post__parcel-bow" />
        </span>
      </div>

      {/* Mail sack */}
      <div className="post__sack">
        <span className="post__sack-body" />
        <span className="post__sack-top" />
        <span className="post__sack-letter" />
      </div>

      {/* Classic mailbox / brievenbus */}
      <div className="post__mailbox">
        <span className="post__mailbox-cap" />
        <span className="post__mailbox-body">
          <span className="post__mailbox-slot" />
          <span className="post__mailbox-door" />
          <motion.span
            className="post__mailbox-flag"
            animate={{ rotate: [-18, -55, -18] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: easeSoft, times: [0, 0.15, 1] }}
          />
        </span>
        <span className="post__mailbox-leg" />
        <span className="post__mailbox-base" />
      </div>

      {/* Queue rope */}
      {rich && (
        <div className="post__queue">
          <span className="post__queue-post" />
          <span className="post__queue-rope" />
          <span className="post__queue-post" />
          <span className="post__queue-rope" />
          <span className="post__queue-post" />
        </div>
      )}

      {/* Floating letters (game view) */}
      {!rich && (
        <>
          <motion.div
            className="post__letter"
            animate={{
              x: ['-10%', '40%', '90%'],
              y: [0, -50, -10, -40, 20],
              rotate: [-12, 8, -6, 14, -4],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: easeSoft }}
          >
            <motion.span
              className="post__letter-flap"
              animate={{ rotateX: [0, 35, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✉️
            </motion.span>
          </motion.div>
          <motion.div
            className="post__letter post__letter--small"
            animate={{
              x: ['100%', '50%', '-15%'],
              y: [30, -20, 10, -30, 40],
              rotate: [10, -15, 5, -10],
            }}
            transition={{ duration: 11, repeat: Infinity, ease: easeSoft, delay: 2.5 }}
          >
            💌
          </motion.div>
        </>
      )}

      {rich && (
        <>
          <div className="post__plant">🪴</div>
          <div className="post__bell">🔔</div>
          <motion.span
            className="post__sparkle"
            animate={{ scale: [0, 1.15, 0], opacity: [0, 1, 0], rotate: [0, 80] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
          />
        </>
      )}
    </>
  );
}

function ParkScene({ rich }: { rich?: boolean }) {
  return (
    <>
      <div className="scene__sky scene__sky--park" />
      <SceneSun />

      <motion.div
        className="park__cloud park__cloud--1"
        animate={{ x: [0, 50, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="park__cloud park__cloud--2"
        animate={{ x: [0, -40, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="park__cloud park__cloud--3"
        animate={{ x: [0, 35, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      />

      <div className="park__hill park__hill--back" />
      <img className="park__hill-tree park__hill-tree--a" src="/park/boom.png" alt="" draggable={false} />
      <img className="park__hill-tree park__hill-tree--b" src="/park/boom.png" alt="" draggable={false} />
      <img className="park__hill-tree park__hill-tree--c" src="/park/boom.png" alt="" draggable={false} />
      <img className="park__hill-tree park__hill-tree--d" src="/park/boom.png" alt="" draggable={false} />
      <div className="park__hill park__hill--front" />
      {rich && <div className="park__path" />}

      <div className="park__tree park__tree--left">
        <span className="park__trunk" />
        <motion.span
          className="park__canopy"
          animate={{ rotate: [-3, 3.5, -2, 3, -3], x: [0, 2, -1, 2, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: easeSoft }}
        />
      </div>
      <div className="park__tree park__tree--right">
        <span className="park__trunk" />
        <motion.span
          className="park__canopy park__canopy--small"
          animate={{ rotate: [3, -3, 2.5, -3, 3], x: [0, -2, 1, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: easeSoft }}
        />
      </div>

      {rich && (
        <>
          <div className="park__tree park__tree--mid">
            <span className="park__trunk" />
            <motion.span
              className="park__canopy park__canopy--tiny"
              animate={{ rotate: [-2, 3, -2] }}
              transition={{ duration: 5, repeat: Infinity, ease: easeSoft }}
            />
          </div>
          <div className="park__bush park__bush--1" />
          <div className="park__bush park__bush--2" />
          <div className="park__bench">
            <span className="park__bench-seat" />
            <span className="park__bench-leg park__bench-leg--l" />
            <span className="park__bench-leg park__bench-leg--r" />
          </div>
          <div className="park__pond">
            <motion.span
              className="park__ripple"
              animate={{ scale: [0.6, 1.4], opacity: [0.45, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
            />
          </div>
          <div className="park__swing">
            <span className="park__swing-post park__swing-post--l" />
            <span className="park__swing-post park__swing-post--r" />
            <span className="park__swing-bar" />
            <motion.span
              className="park__swing-seat"
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: easeSoft }}
            />
          </div>
          <div className="park__picnic">🧺</div>
          <div className="park__fence">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
          <div className="park__lamp">
            <span className="park__lamp-pole" />
            <span className="park__lamp-glow" />
          </div>
          <div className="park__sandbox" />
        </>
      )}

      <div className="park__blades">
        {Array.from({ length: rich ? 18 : 14 }, (_, i) => (
          <motion.span
            key={i}
            className="park__blade"
            style={{ left: `${3 + i * (rich ? 5.4 : 7)}%`, height: `${14 + (i % 4) * 5}px` }}
            animate={{ rotate: [-8, 10, -6, 8, -8] }}
            transition={{
              duration: 2.2 + (i % 5) * 0.35,
              repeat: Infinity,
              ease: easeSoft,
              delay: i * 0.08,
            }}
          />
        ))}
      </div>
      <div className="park__grass" />

      {[12, 22, 28, 40, 55, 64, 72, 88].map((left, i) => (
        <motion.div
          key={left}
          className={`park__flower park__flower--${i % 3}`}
          style={{ left: `${left}%`, bottom: `${10 + (i % 3) * 2}%` }}
          animate={{ rotate: [-6, 8, -6], y: [0, -2, 0] }}
          transition={{ duration: 2.8 + i * 0.2, repeat: Infinity, ease: easeSoft, delay: i * 0.15 }}
        />
      ))}

      <FlyingBird className="park__bird-path park__bird-path--1" duration={16} size={40} />
      <FlyingBird className="park__bird-path park__bird-path--2" duration={13} size={28} delay={3} />
      <FlyingBird className="park__bird-path park__bird-path--3" duration={18} size={32} delay={7} flip />

      <Butterfly className="park__butterfly--1" delay={0} />
      <Butterfly className="park__butterfly--2" delay={2.5} />
      {rich && <Butterfly className="park__butterfly--3" delay={1.2} />}
    </>
  );
}

function FarmScene({ rich }: { rich?: boolean }) {
  return (
    <>
      <div className="scene__sky scene__sky--farm" />
      <SceneSun className="farm__sun" />

      <motion.div
        className="farm__cloud farm__cloud--1"
        animate={{ x: [0, 36, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="farm__cloud farm__cloud--2"
        animate={{ x: [0, -30, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="farm__cloud farm__cloud--3"
        animate={{ x: [0, 22, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
      />

      {/* Distant soft hills */}
      <div className="farm__distant farm__distant--back" />
      <div className="farm__distant farm__distant--mid" />

      {/* Crop hill — tractor rides the crest */}
      <div className="farm__field-hill">
        <div className="farm__crops" aria-hidden />
        <div className="farm__crops farm__crops--far" aria-hidden />
        {rich && (
          <motion.div
            className="farm__tractor"
            animate={{
              /* Stay on the crest; emoji faces left, so flip when driving right */
              left: ['18%', '56%', '18%'],
              y: [0, -3, -5, -3, 0],
              scaleX: [-1, -1, 1, 1, -1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.45, 0.5, 0.95, 1],
            }}
          >
            🚜
          </motion.div>
        )}
      </div>

      {/* Pasture mound in front of crops */}
      <div className="farm__pasture">
        <div className="farm__pasture-fence" aria-hidden>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        {rich && (
          <>
            <motion.div
              className="farm__horse"
              animate={{ y: [0, -3, 0], x: [0, 6, 0, -4, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: easeSoft }}
            >
              🐎
            </motion.div>
            <motion.div
              className="farm__cow"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: easeSoft, delay: 0.4 }}
            >
              🐄
            </motion.div>
            <motion.div
              className="farm__sheep"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3.1, repeat: Infinity, ease: easeSoft, delay: 0.9 }}
            >
              🐑
            </motion.div>
          </>
        )}
      </div>

      {/* Barn + silo cluster on the yard */}
      <div className="farm__silo">
        <span className="farm__silo-cap" />
        <span className="farm__silo-band farm__silo-band--1" />
        <span className="farm__silo-band farm__silo-band--2" />
      </div>
      <div className="farm__barn">
        <div className="farm__barn-roof">
          <span className="farm__barn-ridge" />
        </div>
        <div className="farm__barn-loft" />
        <div className="farm__barn-window farm__barn-window--l" />
        <div className="farm__barn-window farm__barn-window--r" />
        <div className="farm__barn-door">
          <span className="farm__barn-door-x" />
        </div>
      </div>

      {rich && (
        <>
          <div className="farm__hay farm__hay--1">🌾</div>
          <div className="farm__hay farm__hay--2">🌾</div>
          <div className="farm__bale farm__bale--1" />
          <div className="farm__bale farm__bale--2" />
          <div className="farm__trough">
            <span className="farm__trough-rim" />
          </div>
          <div className="farm__bucket">🪣</div>
          <FarmChick className="farm__chick--1" delay={0} distance={120} duration={7.2} />
          <FarmChick className="farm__chick--2" delay={1.6} distance={-100} duration={8.5} />
          <FarmChick className="farm__chick--3" delay={3} distance={90} duration={6.8} />
          <div className="farm__windmill" aria-hidden>
            <span className="farm__windmill-tower" />
            <motion.span
              className="farm__windmill-blades"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </>
      )}

      <div className="farm__yard-fence" aria-hidden>
        {Array.from({ length: rich ? 14 : 10 }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="farm__ground" />
      <div className="farm__blades" aria-hidden>
        {Array.from({ length: rich ? 16 : 10 }, (_, i) => (
          <motion.span
            key={i}
            className="farm__blade"
            style={{ left: `${2 + i * (rich ? 6 : 9)}%`, height: `${12 + (i % 4) * 5}px` }}
            animate={{ rotate: [-8, 10, -8] }}
            transition={{
              duration: 2 + (i % 4) * 0.3,
              repeat: Infinity,
              ease: easeSoft,
              delay: i * 0.06,
            }}
          />
        ))}
      </div>

      <FlyingBird className="farm__bird farm__bird--1" duration={15} size={34} delay={1} />
      <FlyingBird className="farm__bird farm__bird--2" duration={18} size={26} delay={5} flip />
      {rich && <FlyingBird className="farm__bird farm__bird--3" duration={14} size={22} delay={9} />}
    </>
  );
}

function ForestScene({ rich }: { rich?: boolean }) {
  return (
    <>
      <div className="scene__sky scene__sky--forest" />
      <SceneSun />
      <div className="forest__haze" />

      <motion.div
        className="forest__cloud forest__cloud--1"
        animate={{ x: [0, 42, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="forest__cloud forest__cloud--2"
        animate={{ x: [0, -34, 0] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="forest__cloud forest__cloud--3"
        animate={{ x: [0, 26, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      />

      <svg className="forest__mountains" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="forestPeakFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b7cce4" />
            <stop offset="100%" stopColor="#8eabcc" />
          </linearGradient>
          <linearGradient id="forestPeakMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8eacc8" />
            <stop offset="100%" stopColor="#6a8fb4" />
          </linearGradient>
          <linearGradient id="forestPeakNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6f96b8" />
            <stop offset="70%" stopColor="#547ea0" />
            <stop offset="100%" stopColor="#5f8f7c" />
          </linearGradient>
        </defs>
        <path fill="url(#forestPeakFar)" d="M0 160 L40 90 L95 130 L150 55 L210 120 L270 70 L330 115 L380 80 L400 160 Z" />
        <path fill="url(#forestPeakMid)" d="M0 160 L55 105 L120 145 L175 78 L245 130 L310 88 L370 128 L400 160 Z" />
        <path fill="url(#forestPeakNear)" d="M0 160 L70 118 L130 150 L190 95 L260 140 L330 108 L400 160 Z" />
        <path fill="#fff" opacity="0.92" d="M150 55 L162 78 L138 78 Z" />
        <path fill="#fff" opacity="0.88" d="M270 70 L281 90 L259 90 Z" />
        <path fill="#fff" opacity="0.85" d="M175 78 L186 98 L164 98 Z" />
        <path fill="#f4f8fc" opacity="0.8" d="M310 88 L320 108 L300 108 Z" />
      </svg>

      <div className="forest__ridge forest__ridge--back" />
      <div className="forest__ridge forest__ridge--front" />
      <div className="forest__distant-trees" aria-hidden>
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className={`forest__distant-tree forest__distant-tree--${i}`} />
        ))}
      </div>

      <div className="forest__beams" aria-hidden>
        <span className="forest__beam forest__beam--1" />
        <span className="forest__beam forest__beam--2" />
        <span className="forest__beam forest__beam--3" />
      </div>

      <ForestPine className="forest__tree--1" sway={2} duration={5.8} />
      <ForestPine className="forest__tree--2" deep sway={2.4} duration={6.4} />
      <ForestPine className="forest__tree--3" sway={2.8} duration={5.1} />
      <ForestPine className="forest__tree--4" sway={3} duration={5.5} arm={rich ? 'right' : undefined} />
      <ForestPine className="forest__tree--5" deep sway={1.8} duration={4.8} />
      <ForestPine className="forest__tree--6" sway={2.2} duration={5.4} />
      <ForestPine className="forest__tree--7" deep sway={2.6} duration={6} arm={rich ? 'left' : undefined} />
      {rich && (
        <>
          <ForestPine className="forest__tree--8" sway={2.1} duration={4.9} arm="right" />
          <ForestPine className="forest__tree--9" deep sway={2.9} duration={5.7} />
        </>
      )}

      {rich && <ForestOwlFlyer />}

      <div className="forest__ground" />
      <div className="forest__path">
        <span className="forest__pebble forest__pebble--1" />
        <span className="forest__pebble forest__pebble--2" />
        <span className="forest__pebble forest__pebble--3" />
      </div>

      <div className="forest__log">
        <span className="forest__log-ring" />
        <span className="forest__log-moss" />
      </div>

      {rich && (
        <>
          <div className="forest__mushroom forest__mushroom--1">
            <span className="forest__shroom-cap" />
            <span className="forest__shroom-stem" />
            <span className="forest__shroom-dot forest__shroom-dot--a" />
            <span className="forest__shroom-dot forest__shroom-dot--b" />
            <span className="forest__shroom-dot forest__shroom-dot--c" />
          </div>
          <div className="forest__mushroom forest__mushroom--2">
            <span className="forest__shroom-cap forest__shroom-cap--small" />
            <span className="forest__shroom-stem forest__shroom-stem--small" />
            <span className="forest__shroom-dot forest__shroom-dot--d" />
            <span className="forest__shroom-dot forest__shroom-dot--e" />
          </div>
          <div className="forest__mushroom forest__mushroom--3">
            <span className="forest__shroom-cap forest__shroom-cap--tiny" />
            <span className="forest__shroom-stem forest__shroom-stem--tiny" />
          </div>

          <ForestFox className="forest-fox--scene" />

          <div className="forest__bush forest__bush--1" />
          <div className="forest__bush forest__bush--2" />
          <div className="forest__bush forest__bush--3" />
          <div className="forest__fern forest__fern--1" />
          <div className="forest__fern forest__fern--2" />
          <div className="forest__fern forest__fern--3" />

          <div className="forest__flowers" aria-hidden>
            {[10, 22, 36, 64, 78, 88].map((left, i) => (
              <motion.span
                key={left}
                className={`forest__flower forest__flower--${i % 3}`}
                style={{ left: `${left}%` }}
                animate={{ rotate: [-6, 7, -6], y: [0, -2, 0] }}
                transition={{ duration: 2.6 + i * 0.2, repeat: Infinity, ease: easeSoft, delay: i * 0.12 }}
              />
            ))}
          </div>

          <div className="forest__blades" aria-hidden>
            {Array.from({ length: 16 }, (_, i) => (
              <motion.span
                key={i}
                className="forest__blade"
                style={{ left: `${4 + i * 6}%`, height: `${12 + (i % 4) * 4}px` }}
                animate={{ rotate: [-8, 9, -8] }}
                transition={{ duration: 2.1 + (i % 4) * 0.25, repeat: Infinity, ease: easeSoft, delay: i * 0.05 }}
              />
            ))}
          </div>

          <motion.span
            className="forest__leaf forest__leaf--1"
            animate={{ y: [0, 52], x: [0, 14, -8], opacity: [0.9, 0], rotate: [0, 55] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: 'easeIn' }}
          />
          <motion.span
            className="forest__leaf forest__leaf--2"
            animate={{ y: [0, 60], x: [0, -12, 8], opacity: [0.8, 0], rotate: [0, -60] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeIn', delay: 1.1 }}
          />
          <motion.span
            className="forest__leaf forest__leaf--3"
            animate={{ y: [0, 46], x: [0, 10, -5], opacity: [0.85, 0], rotate: [0, 45] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeIn', delay: 2.3 }}
          />
        </>
      )}

      <FlyingBird className="forest__bird forest__bird--1" duration={14} size={30} delay={2} />
      <FlyingBird className="forest__bird forest__bird--2" duration={18} size={24} delay={6} flip />
      {rich && <FlyingBird className="forest__bird forest__bird--3" duration={16} size={22} delay={10} />}
    </>
  );
}
