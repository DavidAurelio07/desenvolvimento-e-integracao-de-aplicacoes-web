export default function PokemonCard({ pokemon, onClick }) {
  if (!pokemon) return null;

  const id = pokemon.id || pokemon.number || pokemon.numero;
  const name = pokemon.name || pokemon.nome || "Unknown";

  const rawTypes =
    pokemon.types || pokemon.tipo || (pokemon.type ? [pokemon.type] : []);

  const types = (Array.isArray(rawTypes) ? rawTypes : [rawTypes])
    .map((type) => {
      if (typeof type === "string") return type;

      if (typeof type === "object") {
        return type.name || type.nome || type.label || "";
      }

      return String(type);
    })
    .filter(Boolean);

  const getTypeClass = (type) =>
    `type-${type
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

  const image =
    pokemon.image ||
    pokemon.imagem ||
    pokemon.sprite ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <article
      className="pokemon-card"
      onClick={() => onClick?.(pokemon)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(pokemon);
        }
      }}
      aria-label={`Ver detalhes de ${name}`}
    >
      <span className="pokemon-card-number">
        #{String(id).padStart(3, "0")}
      </span>

      <img
        className="pokemon-image"
        src={image}
        alt={name}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
        }}
      />

      <h3>{name}</h3>

      <div className="pokemon-card-types">
        {types.map((type, index) => (
          <span
            key={`${type}-${index}`}
            className={`type-badge ${getTypeClass(type)}`}
          >
            {type}
          </span>
        ))}
      </div>

      <span className="pokemon-card-action">Ver detalhes</span>
    </article>
  );
}
