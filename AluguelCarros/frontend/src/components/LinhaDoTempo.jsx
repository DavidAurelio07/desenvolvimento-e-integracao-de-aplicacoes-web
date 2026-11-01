import Icone from './Icone'
import './LinhaDoTempo.css'

// [rótulo, estado] de cada etapa, conforme o status do pedido
const ETAPAS = {
  EM_ANALISE: [
    ['Pedido enviado', 'feito'],
    ['Análise financeira', 'atual'],
    ['Resultado', 'pendente'],
    ['Contrato', 'pendente'],
  ],
  APROVADO: [
    ['Pedido enviado', 'feito'],
    ['Análise financeira', 'feito'],
    ['Aprovado', 'feito'],
    ['Contrato', 'atual'],
  ],
  REPROVADO: [
    ['Pedido enviado', 'feito'],
    ['Análise financeira', 'feito'],
    ['Reprovado', 'erro'],
  ],
  CONTRATO_EXECUTADO: [
    ['Pedido enviado', 'feito'],
    ['Análise financeira', 'feito'],
    ['Aprovado', 'feito'],
    ['Contrato executado', 'feito'],
  ],
  CANCELADO: [
    ['Pedido enviado', 'feito'],
    ['Cancelado', 'cancelado'],
  ],
}

export default function LinhaDoTempo({ status }) {
  const etapas = ETAPAS[status] ?? ETAPAS.EM_ANALISE

  return (
    <ol className="tempo">
      {etapas.map(([rotulo, estado], indice) => (
        <li key={rotulo} className={`tempo-${estado}`}>
          <span className="tempo-bolinha">
            {estado === 'feito' ? <Icone nome="check" tamanho={18} /> : indice + 1}
          </span>
          {rotulo}
        </li>
      ))}
    </ol>
  )
}
