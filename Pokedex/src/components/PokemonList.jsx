import PokemonCard from "./PokemonCard";

export default function PokemonList({ pokemonData, onPokemonClick }) {
  if (!pokemonData || pokemonData.length === 0) {
    return (
      <div className="empty-state">
        <span>🔍</span>
        <h2>Nenhum Pokémon encontrado</h2>
        <p>Tenta alterar a pesquisa ou os filtros.</p>
      </div>
    );
  }

  return (
    <section className="pokemon-section">
      <div className="pokemon-grid">
        {pokemonData.map((pokemon, index) => (
          <PokemonCard
            key={pokemon.id || pokemon.number || pokemon.numero || index}
            pokemon={pokemon}
            onClick={onPokemonClick}
          />
        ))}
      </div>
    </section>
  );
}
