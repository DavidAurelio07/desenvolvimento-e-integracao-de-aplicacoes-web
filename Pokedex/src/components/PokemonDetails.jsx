import { useEffect, useRef, useState } from "react";
import "../css/Details.css";
import useEscapeKey from "../hooks/useEscapeKey";
import {
  STATS,
  formatId,
  getImage,
  getTotal,
  getTypeNames,
  handleImageError,
} from "../utils/pokemon";
import StatBar from "./StatBar";
import TypeBadge from "./TypeBadge";

// Dados complementares da PokéAPI (opcional): altura, peso e habilidades.
// Se a API estiver fora do ar, o modal continua funcionando com o JSON local.
function useExtraInfo(pokemonId) {
  const [extra, setExtra] = useState({ status: "loading", data: null });

  useEffect(() => {
    const controller = new AbortController();

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((json) =>
        setExtra({
          status: "ok",
          data: {
            height: json.height / 10, // decímetros -> metros
            weight: json.weight / 10, // hectogramas -> kg
            abilities: json.abilities.map((item) => item.ability.name),
          },
        }),
      )
      .catch((error) => {
        if (error.name !== "AbortError") {
          setExtra({ status: "error", data: null });
        }
      });

    return () => controller.abort();
  }, [pokemonId]);

  return extra;
}

export default function PokemonDetails({
  pokemon,
  onClose,
  isFavorite,
  onToggleFavorite,
}) {
  const closeButtonRef = useRef(null);
  const extra = useExtraInfo(pokemon.id);
  const types = getTypeNames(pokemon);

  useEscapeKey(onClose);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <article
        className="pokemon-details"
        aria-label={`Detalhes de ${pokemon.name}`}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="tool-btn details-back"
          onClick={onClose}
          aria-label="Voltar à lista de Pokémon"
        >
          ← Voltar
        </button>

        <div className="details-header">
          <span className="details-number">{formatId(pokemon.id)}</span>

          <img
            className="details-image"
            src={getImage(pokemon)}
            alt={pokemon.name}
            onError={(event) => handleImageError(event, pokemon)}
          />

          <h2 className="details-name">{pokemon.name}</h2>

          <div className="details-types">
            {types.length > 0 ? (
              types.map((type) => <TypeBadge key={type} type={type} />)
            ) : (
              <span className="type-badge">Sem tipo</span>
            )}
          </div>

          <button
            type="button"
            className={`tool-btn ${isFavorite ? "active" : ""}`}
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(pokemon.id)}
          >
            {isFavorite ? "★ Favorito" : "☆ Favoritar"}
          </button>
        </div>

        <section className="details-stats">
          <h3>📊 Estatísticas base</h3>

          {STATS.map(({ key, label, icon }) => (
            <StatBar
              key={key}
              icon={icon}
              label={label}
              value={pokemon.stats[key]}
            />
          ))}

          <div className="total-stats">
            Total de atributos: <strong>{getTotal(pokemon)}</strong>
          </div>
        </section>

        <section className="details-extra">
          <h3>🌐 Informações extras (PokéAPI)</h3>

          {extra.status === "loading" && (
            <p className="extra-message">Carregando...</p>
          )}

          {extra.status === "error" && (
            <p className="extra-message">
              Não foi possível carregar as informações da PokéAPI.
            </p>
          )}

          {extra.status === "ok" && (
            <dl className="extra-grid">
              <div>
                <dt>Altura</dt>
                <dd>{extra.data.height} m</dd>
              </div>
              <div>
                <dt>Peso</dt>
                <dd>{extra.data.weight} kg</dd>
              </div>
              <div>
                <dt>Habilidades</dt>
                <dd className="abilities">{extra.data.abilities.join(", ")}</dd>
              </div>
            </dl>
          )}
        </section>
    </article>
  );
}
