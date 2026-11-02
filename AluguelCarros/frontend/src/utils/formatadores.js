export function formatarData(iso) {
  if (!iso) return ''
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

// Quantidade de diárias, contando o dia de retirada e o de devolução
export function diasEntre(inicio, fim) {
  if (!inicio || !fim) return 0
  const ms = new Date(`${fim}T00:00:00`) - new Date(`${inicio}T00:00:00`)
  const dias = Math.round(ms / 86400000) + 1
  return dias > 0 ? dias : 0
}

export function primeiroNome(nome) {
  return (nome ?? '').trim().split(' ')[0]
}

export function iniciais(nome) {
  return (nome ?? '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('')
}

export function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
