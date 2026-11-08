import "../css/Card.css";
import {
  STATS,
  formatId,
  getImage,
  getTypeNames,
  handleImageError,
} from "../utils/pokemon";
import TypeBadge from "./TypeBadge";

export default function PokemonCard({
  pokemon,
  onPokemonClick,
  favorites = [],
  compareIds = [],
  onToggleFavorite,
  onToggleCompare,
}) {
  const types = getTypeNames(pokemon);
  const isFavorite = favorites.includes(pokemon.id);
  const isComparing = compareIds.includes(pokemon.id);

  const open = () => onPokemonClick(pokemon);

  return (
    <article
      className="pokemon-card"
      tabIndex={0}
      aria-label={`Ver detalhes de ${pokemon.name}`}
      onClick={open}
      onKeyDown={(event) => {
        // só reage quando o foco está no próprio card (não nos botões internos)
        if (
          event.target === event.currentTarget &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          open();
        }
      }}
    >
      <div className="card-top">
        <button
          type="button"
          className={`icon-btn fav-btn ${isFavorite ? "active" : ""}`}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Remover ${pokemon.name} dos favoritos`
              : `Favoritar ${pokemon.name}`
          }
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite?.(pokemon.id);
          }}
        >
          {isFavorite ? "★" : "☆"}
        </button>

        <span className="pokemon-card-number">{formatId(pokemon.id)}</span>
      </div>

      <img
        className="pokemon-image"
        src={getImage(pokemon)}
        alt={pokemon.name}
        loading="lazy"
        onError={(event) => handleImageError(event, pokemon)}
      />

      <h3>{pokemon.name}</h3>

      <div className="pokemon-card-types">
        {types.length > 0 ? (
          types.map((type) => <TypeBadge key={type} type={type} />)
        ) : (
          <span className="type-badge">Sem tipo</span>
        )}
      </div>

      <dl className="card-stats">
        {STATS.map(({ key, short }) => (
          <div key={key} className="card-stat">
            <dt>{short}</dt>
            <dd>{pokemon.stats[key]}</dd>
          </div>
        ))}
      </dl>

      <div className="card-footer">
        <button
          type="button"
          className={`compare-btn ${isComparing ? "active" : ""}`}
          aria-pressed={isComparing}
          onClick={(event) => {
            event.stopPropagation();
            onToggleCompare?.(pokemon.id);
          }}
        >
          {isComparing ? "✓ Comparando" : "⚔️ Comparar"}
        </button>
        <span className="pokemon-card-action">Ver detalhes</span>
      </div>
    </article>
  );
}
