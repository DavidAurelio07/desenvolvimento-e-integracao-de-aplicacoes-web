import './RendimentosEditor.css'

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
    <div className="rendimentos">
      {rendimentos.length === 0 && (
        <p className="rendimentos-vazio">
          Nenhum rendimento informado. Você pode adicionar até {maximo}.
        </p>
      )}

      {rendimentos.map((r, i) => (
        <div key={i} className="rendimento-linha">
          <input
            placeholder="Entidade empregadora"
            aria-label="Entidade empregadora"
            value={r.entidadeEmpregadora}
            onChange={(e) => atualizar(i, 'entidadeEmpregadora', e.target.value)}
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Rendimento (R$)"
            aria-label="Rendimento em reais"
            value={r.valor}
            onChange={(e) => atualizar(i, 'valor', e.target.value)}
            required
          />
          <button type="button" className="btn-secundario" onClick={() => remover(i)}>
            Remover
          </button>
        </div>
      ))}

      <div className="rendimentos-rodape">
        <span className="rendimentos-contador">{rendimentos.length} de {maximo} rendimentos</span>
        <button
          type="button"
          className="btn-secundario"
          onClick={adicionar}
          disabled={rendimentos.length >= maximo}
        >
          Adicionar rendimento
        </button>
      </div>
    </div>
  )
}
