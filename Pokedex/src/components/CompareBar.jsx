// Barra fixa que mostra os Pokémon escolhidos para comparação.
export default function CompareBar({ selected, onRemove, onCompare, onClear }) {
  if (selected.length === 0) return null;

  return (
    <div className="compare-bar" role="region" aria-label="Comparação">
      <span className="compare-bar-title">⚔️ Comparar</span>

      {selected.map((pokemon) => (
        <button
          type="button"
          key={pokemon.id}
          className="compare-chip"
          onClick={() => onRemove(pokemon.id)}
          aria-label={`Remover ${pokemon.name} da comparação`}
        >
          {pokemon.name} ✕
        </button>
      ))}

      {selected.length < 2 && (
        <span className="compare-hint">escolha mais 1</span>
      )}

      <button
        type="button"
        className="tool-btn primary"
        disabled={selected.length < 2}
        onClick={onCompare}
      >
        Comparar
      </button>
      <button type="button" className="tool-btn" onClick={onClear}>
        Limpar
      </button>
    </div>
  );
}
