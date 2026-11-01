import { Link } from 'react-router-dom'
import { formatarData } from '../utils/formatadores'
import FotoCarro from './FotoCarro'
import Icone from './Icone'
import StatusBadge from './StatusBadge'
import './CartaoPedido.css'

export default function CartaoPedido({ pedido, mostrarCliente = false }) {
  const { automovel } = pedido

  return (
    <Link to={`/pedidos/${pedido.id}`} className="pedido-card">
      <div className="pedido-card-topo">
        <span className="pedido-numero">Pedido nº {pedido.id}</span>
        <StatusBadge status={pedido.status} />
      </div>

      <div className="pedido-corpo">
        <div className="pedido-carro"><FotoCarro automovel={automovel} /></div>
        <div>
          <h3>{automovel.marca} {automovel.modelo}</h3>
          <p>{automovel.ano} · Placa {automovel.placa}</p>
        </div>
      </div>

      {mostrarCliente && (
        <p className="pedido-cliente">
          <Icone nome="usuario" tamanho={16} /> {pedido.clienteNome}
        </p>
      )}

      <div className="pedido-periodo">
        <div>
          <small>Retirada</small>
          <strong>{formatarData(pedido.dataInicio)}</strong>
        </div>
        <span><Icone nome="seta" tamanho={18} /></span>
        <div>
          <small>Devolução</small>
          <strong>{formatarData(pedido.dataFim)}</strong>
        </div>
      </div>

      <span className="pedido-ver">
        Ver detalhes <Icone nome="seta" tamanho={16} />
      </span>
    </Link>
  )
}
