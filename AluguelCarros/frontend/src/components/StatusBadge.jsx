import './StatusBadge.css'

const ROTULOS = {
  EM_ANALISE: 'Em análise',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  CONTRATO_EXECUTADO: 'Contrato executado',
  CANCELADO: 'Cancelado',
}

export default function StatusBadge({ status }) {
  return (
    <strong className={`status status-${status.toLowerCase()}`}>
      {ROTULOS[status] ?? status}
    </strong>
  )
}
