import PokemonCard from "./PokemonCard";

export default function PokemonList({
  pokemonData,
  emptyTitle = "Nenhum Pokémon encontrado",
  emptyText = "Tente alterar a pesquisa ou os filtros.",
  ...cardProps
}) {
  if (!pokemonData || pokemonData.length === 0) {
    return (
      <div className="empty-state" role="status">
        <span>🔍</span>
        <h2>{emptyTitle}</h2>
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <section className="pokemon-section">
      <div className="pokemon-grid">
        {pokemonData.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} {...cardProps} />
        ))}
      </div>
    </section>
  );
}
