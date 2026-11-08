import SearchBar from "./SearchBar";
import Filters from "./Filters";

export default function Header({
  searchTerm,
  onSearchChange,
  availableTypes,
  selectedType,
  onTypeSelect,
}) {
  return (
    <header className="header">
      <div className="header-title">
        <div>
          <span className="header-icon">⚡</span>
          <h1>Pokédex</h1>
        </div>

        <p>Explora o mundo Pokémon!</p>
      </div>

      <div className="header-controls">
        <SearchBar value={searchTerm} onChange={onSearchChange} />

        <Filters
          types={availableTypes}
          selectedType={selectedType}
          onTypeSelect={onTypeSelect}
        />
      </div>
    </header>
  );
}
