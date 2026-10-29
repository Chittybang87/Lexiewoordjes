import { motion } from 'framer-motion';
import { HOUSE_ROOMS } from '../data/world';
import { LexieCharacter } from './LexieCharacter';

interface Props {
  onSelectRoom: (missionId: string) => void;
  onBack: () => void;
  canVisit: (missionId: string) => boolean;
}

export function HouseScreen({ onSelectRoom, onBack, canVisit }: Props) {
  return (
    <div className="screen house-screen">
      <header className="house-screen__bar">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Terug naar de kaart">
          ←
        </button>
        <div className="house-screen__meta">
          <span>🏠 In huis</span>
          <span>Kies een kamer</span>
        </div>
        <div className="icon-btn-spacer" aria-hidden />
      </header>

      <div className="house-screen__stage">
        <div className="house-screen__wall" />
        <div className="house-screen__floor" />
        <LexieCharacter mood="wave" size={120} className="house-screen__lexie" />

        <div className="house-screen__rooms">
          {HOUSE_ROOMS.map((room, i) => {
            const open = room.available && canVisit(room.missionId);
            return (
              <motion.button
                key={room.id}
                type="button"
                className={`house-screen__door${open ? '' : ' house-screen__door--locked'}`}
                disabled={!open}
                onClick={() => open && onSelectRoom(room.missionId)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * i }}
                whileTap={open ? { scale: 0.95 } : undefined}
                aria-label={open ? `Naar de ${room.label}` : `${room.label} komt later`}
              >
                <span className="house-screen__door-emoji">{room.emoji}</span>
                <span className="house-screen__door-label">{room.label}</span>
                {!room.available && <span className="house-screen__soon">Straks</span>}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
