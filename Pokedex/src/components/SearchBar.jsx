export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="search"
      className="search-input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Pesquisar Pokémon por nome ou ID..."
      aria-label="Pesquisar Pokémon por nome ou ID"
    />
  );
}
