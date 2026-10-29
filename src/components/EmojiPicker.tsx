import { useMemo, useState } from 'react';
import { EMOJI_CATEGORIES } from '../data/emojis';

interface Props {
  value: string;
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ value, onSelect }: Props) {
  const [categoryId, setCategoryId] = useState<string>(EMOJI_CATEGORIES[0].id);
  const [query, setQuery] = useState('');

  const category = EMOJI_CATEGORIES.find((c) => c.id === categoryId) ?? EMOJI_CATEGORIES[0];

  const emojis = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...category.emojis];
    // Search across all categories by category label (and show matching category icons)
    return EMOJI_CATEGORIES.filter(
      (c) => c.label.toLowerCase().includes(q) || c.id.includes(q),
    ).flatMap((c) => [...c.emojis]);
  }, [category, query]);

  return (
    <div className="emoji-picker">
      <input
        className="emoji-picker__search"
        type="search"
        placeholder="Zoek categorie… (bijv. dieren)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Zoek emoji-categorie"
      />

      {!query && (
        <div className="emoji-picker__cats" role="tablist" aria-label="Emoji-categorieën">
          {EMOJI_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={c.id === categoryId}
              className={`emoji-picker__cat ${c.id === categoryId ? 'emoji-picker__cat--on' : ''}`}
              onClick={() => setCategoryId(c.id)}
              title={c.label}
            >
              <span aria-hidden>{c.icon}</span>
              <span className="emoji-picker__cat-label">{c.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="emoji-picker__grid" role="listbox" aria-label={category.label}>
        {emojis.map((em) => (
          <button
            key={`${categoryId}-${em}`}
            type="button"
            role="option"
            aria-selected={em === value}
            className={`emoji-picker__item ${em === value ? 'emoji-picker__item--on' : ''}`}
            onClick={() => onSelect(em)}
          >
            {em}
          </button>
        ))}
      </div>
    </div>
  );
}
