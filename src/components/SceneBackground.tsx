import { motion } from 'framer-motion';

interface Props {
  scene: string;
  className?: string;
}

const easeSoft = [0.45, 0.05, 0.55, 0.95] as const;

export function SceneBackground({ scene, className }: Props) {
  return (
    <div className={`scene scene--${scene}${className ? ` ${className}` : ''}`} aria-hidden>
      {scene === 'keuken' && <KitchenScene />}
      {scene === 'winkel' && <ShopScene />}
      {scene === 'post' && <PostScene />}
      {scene === 'park' && <ParkScene />}
      <div className="scene__veil" />
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

function KitchenScene() {
  return (
    <>
      <div className="scene__sky scene__sky--warm" />
      <div className="scene__wall scene__wall--kitchen" />
      <div className="kitchen__cabinets">
        <span /><span /><span />
      </div>
      <div className="kitchen__counter" />

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

      <div className="kitchen__fridge" />
      <motion.div
        className="kitchen__light"
        animate={{ opacity: [0.35, 0.55, 0.4, 0.6, 0.35] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: easeSoft }}
      />
    </>
  );
}

function ShopScene() {
  return (
    <>
      <div className="scene__sky scene__sky--shop" />
      <motion.div
        className="shop__awning"
        animate={{ y: [0, 2, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: easeSoft }}
      >
        <span /><span /><span /><span /><span /><span />
      </motion.div>
      <div className="shop__floor" />
      <div className="shop__shelves">
        <div className="shop__shelf">
          {['red', 'yellow', 'green'].map((c, i) => (
            <motion.span
              key={c}
              className={`shop__item shop__item--${c}`}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, ease: easeSoft, delay: i * 0.2 }}
            />
          ))}
        </div>
        <div className="shop__shelf">
          {['blue', 'orange', 'pink'].map((c, i) => (
            <motion.span
              key={c}
              className={`shop__item shop__item--${c}`}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.4 + i * 0.25, repeat: Infinity, ease: easeSoft, delay: 0.4 + i * 0.15 }}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="shop__cart"
        animate={{ x: [0, 48, 48, 0, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: easeSoft,
          times: [0, 0.4, 0.55, 0.95, 1],
        }}
      >
        <motion.span
          className="shop__wheel shop__wheel--l"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.span
          className="shop__wheel shop__wheel--r"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      <motion.div
        className="shop__sign"
        animate={{ rotate: [-4, 4, -4], y: [0, -3, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: easeSoft }}
      >
        🛒
      </motion.div>

      <motion.span
        className="shop__sparkle"
        animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: [0, 90] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
      />
    </>
  );
}

function PostScene() {
  return (
    <>
      <div className="scene__sky scene__sky--post" />
      <div className="post__building" />
      <motion.div
        className="post__door"
        animate={{ filter: ['brightness(1)', 'brightness(1.08)', 'brightness(1)'] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="post__counter" />
      <div className="post__floor" />

      <motion.div
        className="post__box"
        animate={{ y: [0, -6, 0], rotate: [0, -2, 2, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: easeSoft }}
      >
        📦
        <motion.span
          className="post__box-shadow"
          animate={{ scaleX: [1, 0.85, 1], opacity: [0.25, 0.15, 0.25] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: easeSoft }}
        />
      </motion.div>

      {/* Flying letter with flap */}
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
        className="post__stamp"
        animate={{ y: [0, -5, 0], rotate: [0, -3, 3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: easeSoft }}
      >
        📮
      </motion.div>

      {/* Second smaller letter */}
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
  );
}

function ParkScene() {
  return (
    <>
      <div className="scene__sky scene__sky--park" />

      <motion.div
        className="park__sun"
        animate={{ scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: easeSoft }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <motion.span
            key={deg}
            className="park__ray"
            style={{ transform: `rotate(${deg}deg)` }}
            animate={{ opacity: [0.35, 0.7, 0.35], scaleY: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: easeSoft, delay: deg / 360 }}
          />
        ))}
      </motion.div>

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
      <div className="park__hill park__hill--front" />

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

      {/* Grass blades */}
      <div className="park__blades">
        {Array.from({ length: 14 }, (_, i) => (
          <motion.span
            key={i}
            className="park__blade"
            style={{ left: `${4 + i * 7}%`, height: `${14 + (i % 4) * 5}px` }}
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

      {/* Flowers */}
      {[12, 28, 55, 72, 88].map((left, i) => (
        <motion.div
          key={left}
          className={`park__flower park__flower--${i % 3}`}
          style={{ left: `${left}%` }}
          animate={{ rotate: [-6, 8, -6], y: [0, -2, 0] }}
          transition={{ duration: 2.8 + i * 0.2, repeat: Infinity, ease: easeSoft, delay: i * 0.15 }}
        />
      ))}

      <FlyingBird className="park__bird-path park__bird-path--1" duration={16} size={40} />
      <FlyingBird className="park__bird-path park__bird-path--2" duration={13} size={28} delay={3} />
      <FlyingBird className="park__bird-path park__bird-path--3" duration={18} size={32} delay={7} flip />

      <Butterfly className="park__butterfly--1" delay={0} />
      <Butterfly className="park__butterfly--2" delay={2.5} />
    </>
  );
}
