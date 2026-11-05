export default function SearchBar() {
  return (
    <div style={{ margin: '1rem 0' }}>
      <input 
        type="text" 
        placeholder="Pesquisar Pokémon por nome ou ID..." 
        style={{ padding: '0.5rem', width: '100%', maxWidth: '400px', borderRadius: '4px', border: '1px solid #ccc' }} 
      />
    </div>
  )
}