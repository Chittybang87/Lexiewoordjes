import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { LEVEL_LABELS, MISSIONS, type Level, type WordItem } from '../data/words';
import { EmojiPicker } from './EmojiPicker';

interface Props {
  words: WordItem[];
  isEnabled: (id: string) => boolean;
  onToggle: (id: string, enabled: boolean) => void;
  onEmoji: (id: string, emoji: string) => void;
  onWordText: (id: string, woord: string) => void;
  onAdd: (woord: string, emoji: string, opdrachtId: string, niveau: Level) => boolean;
  onRemoveCustom: (id: string) => void;
  onReset: () => void;
  onBack: () => void;
}

export function SettingsScreen({
  words,
  isEnabled,
  onToggle,
  onEmoji,
  onWordText,
  onAdd,
  onRemoveCustom,
  onReset,
  onBack,
}: Props) {
  const [missionFilter, setMissionFilter] = useState<string>('all');
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newWoord, setNewWoord] = useState('');
  const [newEmoji, setNewEmoji] = useState('⭐');
  const [newMission, setNewMission] = useState(MISSIONS[0].id);
  const [newLevel, setNewLevel] = useState<Level>(1);
  const [addError, setAddError] = useState('');

  const grouped = useMemo(() => {
    const list =
      missionFilter === 'all' ? words : words.filter((w) => w.opdrachtId === missionFilter);
    const byMission = MISSIONS.map((m) => ({
      mission: m,
      words: list.filter((w) => w.opdrachtId === m.id),
    })).filter((g) => g.words.length > 0);
    return byMission;
  }, [words, missionFilter]);

  const enabledCount = words.filter((w) => isEnabled(w.id)).length;

  const submitAdd = () => {
    const ok = onAdd(newWoord, newEmoji, newMission, newLevel);
    if (!ok) {
      setAddError('Kies een woordje van 2 tot 6 letters (alleen letters).');
      return;
    }
    setNewWoord('');
    setNewEmoji('⭐');
    setAddError('');
    setShowAdd(false);
  };

  return (
    <div className="screen panel-screen">
      <header className="panel-screen__bar">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Terug">
          ←
        </button>
        <h1 className="panel-screen__title">Instellingen</h1>
        <span className="panel-screen__count">{enabledCount} actief</span>
      </header>

      <p className="panel-screen__lead">
        Kies welke woordjes Lexie mag gebruiken en pas het icoontje aan.
      </p>

      <div className="settings__filters" role="tablist" aria-label="Filter op opdracht">
        <button
          type="button"
          className={`chip ${missionFilter === 'all' ? 'chip--on' : ''}`}
          onClick={() => setMissionFilter('all')}
        >
          Alles
        </button>
        {MISSIONS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`chip ${missionFilter === m.id ? 'chip--on' : ''}`}
            onClick={() => setMissionFilter(m.id)}
          >
            {m.emoji} {m.naam}
          </button>
        ))}
      </div>

      <div className="settings__list">
        {grouped.map(({ mission, words: missionWords }) => (
          <section key={mission.id} className="settings__group">
            <h2 className="settings__group-title">
              {mission.emoji} {mission.naam}
            </h2>
            <ul className="settings__words">
              {missionWords.map((word) => {
                const enabled = isEnabled(word.id);
                const isCustom = word.id.startsWith('custom-');
                return (
                  <li key={word.id} className={`settings__word ${enabled ? '' : 'settings__word--off'}`}>
                    <button
                      type="button"
                      className="settings__emoji-btn"
                      onClick={() => setPickerFor(pickerFor === word.id ? null : word.id)}
                      aria-label={`Icoon voor ${word.woord}`}
                      title="Icoon kiezen"
                    >
                      {word.emoji}
                    </button>

                    <div className="settings__word-main">
                      {editingId === word.id ? (
                        <input
                          className="settings__word-input"
                          value={word.woord}
                          autoFocus
                          maxLength={6}
                          onChange={(e) => onWordText(word.id, e.target.value)}
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setEditingId(null);
                          }}
                          aria-label="Woord bewerken"
                        />
                      ) : (
                        <button
                          type="button"
                          className="settings__word-label"
                          onClick={() => setEditingId(word.id)}
                        >
                          {word.woord}
                          <span className="settings__level">{LEVEL_LABELS[word.niveau]}</span>
                        </button>
                      )}
                    </div>

                    <label className="settings__switch">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => onToggle(word.id, e.target.checked)}
                        aria-label={`${word.woord} ${enabled ? 'uit' : 'aan'}`}
                      />
                      <span />
                    </label>

                    {isCustom && (
                      <button
                        type="button"
                        className="settings__delete"
                        onClick={() => onRemoveCustom(word.id)}
                        aria-label={`${word.woord} verwijderen`}
                      >
                        ✕
                      </button>
                    )}

                    <AnimatePresence>
                      {pickerFor === word.id && (
                        <motion.div
                          className="emoji-picker-wrap"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <EmojiPicker
                            value={word.emoji}
                            onSelect={(em) => {
                              onEmoji(word.id, em);
                              setPickerFor(null);
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="settings__actions">
        {!showAdd ? (
          <button type="button" className="btn-primary" onClick={() => setShowAdd(true)}>
            + Eigen woordje
          </button>
        ) : (
          <div className="settings__add">
            <h3>Nieuw woordje</h3>
            <div className="settings__add-row">
              <button
                type="button"
                className="settings__emoji-btn"
                onClick={() => setPickerFor(pickerFor === '__new__' ? null : '__new__')}
              >
                {newEmoji}
              </button>
              <input
                className="settings__word-input settings__word-input--grow"
                placeholder="bijv. kat"
                value={newWoord}
                maxLength={6}
                onChange={(e) => {
                  setNewWoord(e.target.value.toLowerCase());
                  setAddError('');
                }}
              />
            </div>
            {pickerFor === '__new__' && (
              <EmojiPicker
                value={newEmoji}
                onSelect={(em) => {
                  setNewEmoji(em);
                  setPickerFor(null);
                }}
              />
            )}
            <div className="settings__add-row">
              <select
                className="settings__select"
                value={newMission}
                onChange={(e) => setNewMission(e.target.value)}
                aria-label="Opdracht"
              >
                {MISSIONS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.emoji} {m.naam}
                  </option>
                ))}
              </select>
              <select
                className="settings__select"
                value={newLevel}
                onChange={(e) => setNewLevel(Number(e.target.value) as Level)}
                aria-label="Niveau"
              >
                {([1, 2, 3] as Level[]).map((l) => (
                  <option key={l} value={l}>
                    {LEVEL_LABELS[l]}
                  </option>
                ))}
              </select>
            </div>
            {addError && <p className="settings__error">{addError}</p>}
            <div className="settings__add-row">
              <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>
                Annuleren
              </button>
              <button type="button" className="btn-primary" onClick={submitAdd}>
                Toevoegen
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            if (window.confirm('Alle woordjes terugzetten naar de standaard?')) onReset();
          }}
        >
          Standaard herstellen
        </button>
      </div>
    </div>
  );
}
