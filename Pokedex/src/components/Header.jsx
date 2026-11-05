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
    <header
      style={{
        marginBottom: "2rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid #eee",
      }}
    >
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        Pokédex
      </h1>
      <SearchBar value={searchTerm} onChange={onSearchChange} />
      <Filters
        types={availableTypes}
        selectedType={selectedType}
        onTypeSelect={onTypeSelect}
      />
    </header>
  );
}
