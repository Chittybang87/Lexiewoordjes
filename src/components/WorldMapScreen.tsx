import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useCallback, useState, type ReactNode } from 'react';
import { LEVEL_LABELS, type Level } from '../data/words';
import { WORLD_PLACES, type WorldPlace } from '../data/world';
import { LexieCharacter } from './LexieCharacter';

interface Props {
  level: Level;
  onSelectPlace: (place: WorldPlace) => void;
  onHome: () => void;
  canVisit: (missionId: string) => boolean;
}

const easeSoft = [0.45, 0.05, 0.55, 0.95] as const;
const SWIPE_THRESHOLD = 50;

function isPlaceEnabled(place: WorldPlace, canVisit: (missionId: string) => boolean) {
  if (place.kind === 'house') return true;
  if (!place.missionId) return false;
  return canVisit(place.missionId);
}

function coverflowStyle(offset: number) {
  const abs = Math.abs(offset);
  if (abs > 2) {
    return {
      x: `${offset * 72}%`,
      rotateY: offset < 0 ? 48 : -48,
      scale: 0.72,
      opacity: 0,
      zIndex: 0,
    };
  }
  return {
    x: `${offset * 58}%`,
    rotateY: offset === 0 ? 0 : offset < 0 ? 38 : -38,
    scale: offset === 0 ? 1 : abs === 1 ? 0.84 : 0.72,
    opacity: offset === 0 ? 1 : abs === 1 ? 0.95 : 0.4,
    zIndex: 20 - abs,
  };
}

export function WorldMapScreen({ level, onSelectPlace, onHome, canVisit }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activePlace = WORLD_PLACES[activeIndex] ?? WORLD_PLACES[0];
  const activeEnabled = isPlaceEnabled(activePlace, canVisit);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(WORLD_PLACES.length - 1, index)));
  }, []);

  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  const handleGo = () => {
    if (!activeEnabled) return;
    onSelectPlace(activePlace);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 400) {
      goPrev();
    } else if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -400) {
      goNext();
    }
  };

  const handleCardActivate = (index: number) => {
    if (index === activeIndex) {
      handleGo();
      return;
    }
    goTo(index);
  };

  return (
    <div className="screen world-map">
      <div className="world-map__backdrop" aria-hidden>
        <span className="world-map__backdrop-sun" />
        <span className="world-map__backdrop-cloud world-map__backdrop-cloud--a" />
        <span className="world-map__backdrop-cloud world-map__backdrop-cloud--b" />
        <span className="world-map__backdrop-hill world-map__backdrop-hill--far" />
        <span className="world-map__backdrop-hill world-map__backdrop-hill--near" />
      </div>

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

      <div className="world-carousel" aria-roledescription="carousel" aria-label="Locaties">
        <button
          type="button"
          className="world-carousel__arrow world-carousel__arrow--prev"
          onClick={goPrev}
          disabled={activeIndex === 0}
          aria-label="Vorige locatie"
        >
          ←
        </button>

        <motion.div
          className="world-carousel__stage"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={handleDragEnd}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              goPrev();
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              goNext();
            } else if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleGo();
            }
          }}
        >
          {WORLD_PLACES.map((place, index) => {
            const offset = index - activeIndex;
            const enabled = isPlaceEnabled(place, canVisit);
            const style = coverflowStyle(offset);
            const isActive = index === activeIndex;

            return (
              <motion.button
                key={place.id}
                type="button"
                className={`world-carousel__card${isActive ? ' world-carousel__card--active' : ''}${enabled ? '' : ' world-carousel__card--locked'}`}
                style={{ zIndex: style.zIndex }}
                animate={{
                  x: style.x,
                  rotateY: style.rotateY,
                  scale: style.scale,
                  opacity: style.opacity,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                onClick={() => handleCardActivate(index)}
                aria-label={`${place.label}${enabled ? '' : ' (nog niet open)'}`}
                aria-current={isActive ? 'true' : undefined}
                tabIndex={isActive ? 0 : -1}
              >
                <div className="world-carousel__frame">
                  <div className="world-carousel__scene" data-place={place.id} aria-hidden>
                    <CarouselSky placeId={place.id} />
                    <div className="world-carousel__hills">
                      <span className="world-carousel__hill world-carousel__hill--far" />
                      <span className="world-carousel__hill world-carousel__hill--near" />
                    </div>
                    <div className="world-carousel__meadow" />
                    <div className="world-carousel__landmark-wrap">
                      <PlaceLandmark place={place} enabled={enabled} />
                    </div>
                    <div className="world-carousel__title-band">
                      <span className="world-carousel__emoji" aria-hidden>
                        {place.emoji}
                      </span>
                      <span className="world-carousel__title">{place.label}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        <button
          type="button"
          className="world-carousel__arrow world-carousel__arrow--next"
          onClick={goNext}
          disabled={activeIndex === WORLD_PLACES.length - 1}
          aria-label="Volgende locatie"
        >
          →
        </button>
      </div>

      <div className="world-carousel__dots" role="tablist" aria-label="Locaties">
        {WORLD_PLACES.map((place, index) => (
          <button
            key={place.id}
            type="button"
            role="tab"
            className={`world-carousel__dot${index === activeIndex ? ' world-carousel__dot--active' : ''}`}
            aria-selected={index === activeIndex}
            aria-label={place.label}
            onClick={() => goTo(index)}
          />
        ))}
      </div>

      <div className="world-carousel__footer">
        <div className="world-carousel__lexie" aria-hidden>
          <LexieCharacter mood="wave" size={88} facing="right" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePlace.id}
            className="world-carousel__cta-wrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {activeEnabled ? (
              <button type="button" className="btn-primary world-carousel__cta" onClick={handleGo}>
                Ga naar {activePlace.label.toLowerCase()}
              </button>
            ) : (
              <button type="button" className="btn-secondary world-carousel__cta" disabled>
                Nog niet open
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function CarouselSky({ placeId }: { placeId: WorldPlace['id'] }) {
  const countryside = placeId === 'boerderij' || placeId === 'bos';
  return (
    <div className={`world-carousel__sky${countryside ? ' world-carousel__sky--country' : ''}`}>
      <motion.span
        className="world-carousel__sun"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: easeSoft }}
      />
      <span className="world-carousel__cloud world-carousel__cloud--a" />
      <span className="world-carousel__cloud world-carousel__cloud--b" />
    </div>
  );
}

function PlaceLandmark({ place, enabled }: { place: WorldPlace; enabled: boolean }) {
  const className = `map-land map-land--${place.id}${enabled ? '' : ' map-land--off'}`;
  switch (place.id) {
    case 'huis':
      return (
        <LandmarkArt className={className}>
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
        </LandmarkArt>
      );
    case 'post':
      return (
        <LandmarkArt className={className}>
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
        </LandmarkArt>
      );
    case 'winkel':
      return (
        <LandmarkArt className={className}>
          <span className="map-winkel">
            <span className="map-winkel__roof" aria-hidden />
            <span className="map-winkel__signboard" aria-hidden>
              <span className="map-winkel__signboard-text">WINKEL</span>
            </span>
            <span className="map-winkel__awning" aria-hidden>
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
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
        </LandmarkArt>
      );
    case 'park':
      return (
        <LandmarkArt className={className}>
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
        </LandmarkArt>
      );
    case 'boerderij':
      return (
        <LandmarkArt className={className}>
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
        </LandmarkArt>
      );
    case 'bos':
      return (
        <LandmarkArt className={className}>
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
        </LandmarkArt>
      );
  }
}

function LandmarkArt({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div className={className} aria-hidden>
      {children}
    </div>
  );
}
