import PokemonCard from "./PokemonCard";

export default function TrainersSection({
  trainersData,
  pokedexData,
  ...cardProps
}) {
  if (!trainersData || trainersData.length === 0) {
    return (
      <div className="trainers-empty">
        <h3>Nenhum treinador encontrado</h3>
        <p>Não existem treinadores registrados.</p>
      </div>
    );
  }

  const pokemonById = new Map(pokedexData.map((p) => [p.id, p]));

  return (
    <section className="trainers-section">
      <div className="trainers-heading">
        <div>
          <span className="section-eyebrow">POKÉMON WORLD</span>
          <h2>Treinadores</h2>
          <p>Conheça os treinadores e seus times.</p>
        </div>

        <span className="trainer-count">{trainersData.length} TREINADORES</span>
      </div>

      <div className="trainers-list">
        {trainersData.map((trainer, index) => {
          // Set remove IDs repetidos (ex.: o Koga tem o Pokémon 48 três vezes nos dados)
          const team = [...new Set(trainer.pokemonIds)]
            .map((id) => pokemonById.get(id))
            .filter(Boolean);

          return (
            <article className="trainer-card" key={trainer.id}>
              <div className="trainer-card-top">
                <div className="trainer-identity">
                  <div className="trainer-avatar">
                    {trainer.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="trainer-name-area">
                    <span className="trainer-label">
                      TREINADOR {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{trainer.name}</h3>
                    <p>Treinador Pokémon</p>
                  </div>
                </div>

                <div className="trainer-badge-info">
                  <span className="badge-number">{trainer.badges}</span>

                  <span className="badge-description">
                    {trainer.badges === 1 ? "Insígnia" : "Insígnias"}
                  </span>
                </div>
              </div>

              <div className="trainer-divider" />

              <div className="trainer-team">
                <div className="team-heading">
                  <h4>Time Pokémon</h4>
                  <span>{team.length} Pokémon</span>
                </div>

                {team.length > 0 ? (
                  <div className="pokemon-grid">
                    {team.map((pokemon) => (
                      <PokemonCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        {...cardProps}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="empty-team">
                    Este treinador ainda não possui Pokémon.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
