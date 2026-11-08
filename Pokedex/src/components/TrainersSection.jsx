import PokemonCard from "./PokemonCard";

export default function TrainersSection({
  trainersData,
  pokedexData,
  onPokemonClick,
}) {
  if (!trainersData || trainersData.length === 0) {
    return (
      <div className="trainers-empty">
        <h3>Nenhum treinador encontrado</h3>
        <p>Não existem treinadores registados.</p>
      </div>
    );
  }

  const getPokemonById = (id) => {
    return pokedexData.find((pokemon) => {
      const pokemonId = pokemon.id || pokemon.number || pokemon.numero;

      return String(pokemonId) === String(id);
    });
  };

  return (
    <section className="trainers-section">
      <div className="trainers-heading">
        <div>
          <span className="section-eyebrow">POKÉMON WORLD</span>
          <h2>Treinadores</h2>
          <p>Conhece os treinadores e as suas equipas.</p>
        </div>

        <span className="trainer-count">{trainersData.length} TREINADORES</span>
      </div>

      <div className="trainers-list">
        {trainersData.map((trainer, index) => {
          const trainerPokemons = (trainer.pokemonIds || [])
            .map(getPokemonById)
            .filter(Boolean);

          return (
            <article className="trainer-card" key={trainer.id}>
              <div className="trainer-card-top">
                <div className="trainer-identity">
                  <div className="trainer-avatar">
                    {String(trainer.name || "T")
                      .charAt(0)
                      .toUpperCase()}
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
                  <span className="badge-number">{trainer.badges || 0}</span>

                  <span className="badge-description">
                    {Number(trainer.badges) === 1 ? "Insígnia" : "Insígnias"}
                  </span>
                </div>
              </div>

              <div className="trainer-divider" />

              <div className="trainer-team">
                <div className="team-heading">
                  <h4>Equipa Pokémon</h4>
                  <span>{trainerPokemons.length} Pokémon</span>
                </div>

                {trainerPokemons.length > 0 ? (
                  <div className="pokemon-grid">
                    {trainerPokemons.map((pokemon) => (
                      <PokemonCard
                        key={`${pokemon.id || pokemon.number || pokemon.numero}-${trainer.id}`}
                        pokemon={pokemon}
                        onClick={onPokemonClick}
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
