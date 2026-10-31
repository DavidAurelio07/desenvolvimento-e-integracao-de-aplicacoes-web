const ROTULOS = {
  EM_ANALISE: 'Em análise',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  CONTRATO_EXECUTADO: 'Contrato executado',
  CANCELADO: 'Cancelado',
}

export default function StatusBadge({ status }) {
  return <strong>{ROTULOS[status] ?? status}</strong>
}
