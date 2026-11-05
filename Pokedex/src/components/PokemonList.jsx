import PokemonCard from './PokemonCard'

export default function PokemonList() {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Lista de Pokémon</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginTop: '1rem' 
      }}>
        <PokemonCard />
        <PokemonCard />
        <PokemonCard />
      </div>
    </div>
  )
}