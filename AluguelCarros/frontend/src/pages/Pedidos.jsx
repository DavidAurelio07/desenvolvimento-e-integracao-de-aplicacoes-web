import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { listarPedidos } from '../services/pedidoService'
import { mensagemDeErro } from '../services/api'
import StatusBadge from '../components/StatusBadge'

function formatarData(iso) {
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

export default function Pedidos() {
  const { usuario } = useAuth()
  const ehAgente = usuario?.papel === 'AGENTE'
  const [pedidos, setPedidos] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    listarPedidos()
      .then(setPedidos)
      .catch((err) => setErro(mensagemDeErro(err, 'Não foi possível carregar os pedidos.')))
  }, [])

  if (erro) return <p role="alert">{erro}</p>
  if (!pedidos) return <p>Carregando...</p>

  return (
    <section>
      <h1>{ehAgente ? 'Pedidos de aluguel' : 'Meus pedidos'}</h1>
      {!ehAgente && <p><Link to="/pedidos/novo">Novo pedido</Link></p>}

      {pedidos.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nº</th>
              {ehAgente && <th>Cliente</th>}
              <th>Automóvel</th>
              <th>Retirada</th>
              <th>Devolução</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                {ehAgente && <td>{p.clienteNome}</td>}
                <td>{p.automovel.marca} {p.automovel.modelo} ({p.automovel.placa})</td>
                <td>{formatarData(p.dataInicio)}</td>
                <td>{formatarData(p.dataFim)}</td>
                <td><StatusBadge status={p.status} /></td>
                <td><Link to={`/pedidos/${p.id}`}>Detalhes</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
