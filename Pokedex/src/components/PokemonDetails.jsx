export default function PokemonDetails({ pokemon, onClose }) {
  if (!pokemon) return null;

  const id = pokemon.id || pokemon.number || pokemon.numero;
  const name = pokemon.name || pokemon.nome || "Unknown";

  const rawTypes =
    pokemon.types || pokemon.tipo || (pokemon.type ? [pokemon.type] : []);

  const types = (Array.isArray(rawTypes) ? rawTypes : [rawTypes])
    .map((t) => {
      if (typeof t === "string") return t;
      if (t && typeof t === "object") return t.name || t.nome || t.label || "";
      return String(t || "");
    })
    .filter(Boolean);

  const typeClass = (type) =>
    `type-${type
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

  const rawStats = pokemon.stats || pokemon.atributos || {};

  const getStat = (...keys) => {
    for (const key of keys) {
      const value = rawStats[key] ?? pokemon[key];
      if (value !== undefined && value !== null && value !== "") {
        const numericValue =
          typeof value === "object"
            ? Number(value.base_stat ?? value.value ?? 0)
            : Number(value);

        if (Number.isFinite(numericValue)) return numericValue;
      }
    }
    return 0;
  };

  const statLabels = [
    { label: "❤️ HP", value: getStat("hp") },
    { label: "⚔️ Attack", value: getStat("attack", "ataque") },
    { label: "🛡️ Defense", value: getStat("defense", "defesa") },
    {
      label: "✨ Sp. Attack",
      value: getStat("spAttack", "special-attack", "ataqueEspecial"),
    },
    {
      label: "🛡️ Sp. Defense",
      value: getStat("spDefense", "special-defense", "defesaEspecial"),
    },
    { label: "💨 Speed", value: getStat("speed", "velocidade") },
  ];

  const image =
    pokemon.image ||
    pokemon.imagem ||
    pokemon.sprite ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  const fallbackImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="pokemon-details" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Fechar detalhes"
        >
          ✕
        </button>

        <div className="details-header">
          <span className="details-number">#{String(id).padStart(3, "0")}</span>

          <img
            className="details-image"
            src={image}
            alt={name}
            onError={(e) => {
              if (e.currentTarget.src !== fallbackImage) {
                e.currentTarget.src = fallbackImage;
              }
            }}
          />

          <h2 className="details-name">{name}</h2>

          <div className="details-types">
            {types.map((type, index) => (
              <span
                key={`${type}-${index}`}
                className={`type-badge ${typeClass(type)}`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <section className="details-stats">
          <h3>📊 Estatísticas Base</h3>

          {statLabels.map(({ label, value }) => (
            <div className="stat-row" key={label}>
              <span className="stat-name">{label}</span>

              <span className="stat-value">{value}</span>

              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{
                    "--stat-value": `${Math.min(100, (value / 150) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}

          <div className="total-stats">
            Total de atributos:{" "}
            <strong>
              {statLabels.reduce((sum, stat) => sum + stat.value, 0)}
            </strong>
          </div>
        </section>
      </div>
    </div>
  );
}
