import PokemonCard from './PokemonCard'

export default function PokemonList({ pokemonData, onPokemonClick }) {
  if (!pokemonData || pokemonData.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Nenhum Pokémon encontrado.</p>
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '1.5rem', 
        marginTop: '1rem' 
      }}>
        {pokemonData.map((pokemon) => (
          <PokemonCard 
            key={pokemon.id} 
            pokemon={pokemon} 
            onClick={onPokemonClick}
          />
        ))}
      </div>
    </div>
  )
}