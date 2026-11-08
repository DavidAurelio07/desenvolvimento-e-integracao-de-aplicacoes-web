export default function Filters({ types, selectedType, onTypeSelect }) {
  return (
    <div className="filter-list" role="group" aria-label="Filtrar por tipo">
      <button
        type="button"
        className={`filter-btn ${selectedType === "" ? "active" : ""}`}
        aria-pressed={selectedType === ""}
        onClick={() => onTypeSelect("")}
      >
        Todos
      </button>

      {types.map((type) => (
        <button
          type="button"
          key={type}
          className={`filter-btn ${selectedType === type ? "active" : ""}`}
          aria-pressed={selectedType === type}
          onClick={() => onTypeSelect(type)}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
