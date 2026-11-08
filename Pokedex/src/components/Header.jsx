import SearchBar from "./SearchBar";
import Filters from "./Filters";
import Toolbar from "./Toolbar";

export default function Header({
  searchTerm,
  onSearchChange,
  availableTypes,
  selectedType,
  onTypeSelect,
  toolbarProps,
}) {
  return (
    <header className="header">
      <div className="header-title">
        <div>
          <span className="header-icon">⚡</span>
          <h1>Pokédex</h1>
        </div>

        <p>Explore o mundo Pokémon!</p>
      </div>

      <div className="header-controls">
        <SearchBar value={searchTerm} onChange={onSearchChange} />

        <Filters
          types={availableTypes}
          selectedType={selectedType}
          onTypeSelect={onTypeSelect}
        />

        <Toolbar {...toolbarProps} />
      </div>
    </header>
  );
}
