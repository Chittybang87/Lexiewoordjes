import { AnimatePresence, motion } from 'framer-motion';
import { usePwaInstall } from '../hooks/usePwaInstall';

export function InstallAppButton() {
  const { showInstallButton, helpKind, closeHelp, install } = usePwaInstall();

  if (!showInstallButton) return null;

  return (
    <>
      <motion.button
        type="button"
        className="install-btn"
        onClick={() => void install()}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <span className="install-btn__icon" aria-hidden>
          ↓
        </span>
        Installeer app
      </motion.button>

      <AnimatePresence>
        {helpKind && (
          <motion.div
            className="install-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-sheet-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="install-sheet__backdrop"
              aria-label="Sluiten"
              onClick={closeHelp}
            />
            <motion.div
              className="install-sheet__panel"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              <h2 id="install-sheet-title" className="install-sheet__title">
                Zet Lexie op je startscherm
              </h2>

              {helpKind === 'ios' ? (
                <ol className="install-sheet__steps">
                  <li>
                    Tik op <strong>Deel</strong> onderaan (het vierkantje met pijltje ↑)
                  </li>
                  <li>
                    Kies <strong>Zet op beginscherm</strong>
                  </li>
                  <li>
                    Tik op <strong>Voeg toe</strong>
                  </li>
                </ol>
              ) : (
                <ol className="install-sheet__steps">
                  <li>
                    Tik op <strong>⋮</strong> rechtsboven in Chrome
                  </li>
                  <li>
                    Kies <strong>App installeren</strong> of <strong>Toevoegen aan
                    startscherm</strong>
                  </li>
                  <li>Bevestig — klaar!</li>
                </ol>
              )}

              <p className="install-sheet__note">
                Daarna open je Lexie als een echte app, zonder browserbalk.
              </p>

              <button type="button" className="btn-primary install-sheet__ok" onClick={closeHelp}>
                Begrepen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
