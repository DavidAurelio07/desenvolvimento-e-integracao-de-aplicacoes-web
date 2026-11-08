import { SORT_OPTIONS } from "../utils/pokemon";

// Ordenação, favoritos e Pokémon aleatório.
export default function Toolbar({
  sortKey,
  onSortKeyChange,
  sortDirection,
  onToggleDirection,
  onlyFavorites,
  onToggleOnlyFavorites,
  favoritesCount,
  onRandom,
  resultCount,
}) {
  return (
    <div className="toolbar">
      <label>
        Ordenar por
        <select
          value={sortKey}
          onChange={(event) => onSortKeyChange(event.target.value)}
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className="tool-btn" onClick={onToggleDirection}>
        {sortDirection === "asc" ? "↑ Crescente" : "↓ Decrescente"}
      </button>

      <button
        type="button"
        className={`tool-btn ${onlyFavorites ? "active" : ""}`}
        aria-pressed={onlyFavorites}
        onClick={onToggleOnlyFavorites}
      >
        ⭐ Favoritos ({favoritesCount})
      </button>

      <button type="button" className="tool-btn" onClick={onRandom}>
        🎲 Aleatório
      </button>

      <span className="result-count">
        {resultCount} Pokémon
      </span>
    </div>
  );
}
