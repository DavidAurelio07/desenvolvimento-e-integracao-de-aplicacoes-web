export default function RendimentosEditor({ rendimentos, onChange, maximo = 3 }) {
  function adicionar() {
    if (rendimentos.length < maximo) {
      onChange([...rendimentos, { entidadeEmpregadora: '', valor: '' }])
    }
  }

  function atualizar(indice, campo, valor) {
    onChange(rendimentos.map((r, i) => (i === indice ? { ...r, [campo]: valor } : r)))
  }

  function remover(indice) {
    onChange(rendimentos.filter((_, i) => i !== indice))
  }

  return (
    <fieldset>
      <legend>Rendimentos (máximo {maximo})</legend>
      {rendimentos.map((r, i) => (
        <div key={i}>
          <input
            placeholder="Entidade empregadora"
            value={r.entidadeEmpregadora}
            onChange={(e) => atualizar(i, 'entidadeEmpregadora', e.target.value)}
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Rendimento (R$)"
            value={r.valor}
            onChange={(e) => atualizar(i, 'valor', e.target.value)}
            required
          />
          <button type="button" onClick={() => remover(i)}>Remover</button>
        </div>
      ))}
      <button type="button" onClick={adicionar} disabled={rendimentos.length >= maximo}>
        Adicionar rendimento
      </button>
    </fieldset>
  )
}
