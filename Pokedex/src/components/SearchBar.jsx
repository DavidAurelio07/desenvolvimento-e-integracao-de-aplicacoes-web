export default function SearchBar({ value, onChange }) {
  return (
    <div style={{ width: '100%', maxWidth: '500px' }}>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pesquisar Pokémon por nome ou ID..." 
        style={{ 
          padding: '0.8rem', 
          width: '100%', 
          borderRadius: '8px', 
          border: '1px solid #ccc',
          fontSize: '1rem'
        }} 
      />
    </div>
  )
}