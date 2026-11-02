import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { listarPedidos } from '../services/pedidoService'
import { mensagemDeErro } from '../services/api'
import CarroIlustracao from '../components/CarroIlustracao'
import CartaoPedido from '../components/CartaoPedido'
import './Pedidos.css'

const FILTROS = [
  ['TODOS', 'Todos'],
  ['EM_ANALISE', 'Em análise'],
  ['APROVADO', 'Aprovados'],
  ['CONTRATO_EXECUTADO', 'Com contrato'],
  ['REPROVADO', 'Reprovados'],
  ['CANCELADO', 'Cancelados'],
]

export default function Pedidos() {
  const { usuario } = useAuth()
  const ehAgente = usuario?.papel === 'AGENTE'
  const [pedidos, setPedidos] = useState(null)
  const [filtro, setFiltro] = useState('TODOS')
  const [erro, setErro] = useState('')

  useEffect(() => {
    listarPedidos()
      .then(setPedidos)
      .catch((err) => setErro(mensagemDeErro(err, 'Não foi possível carregar os pedidos.')))
  }, [])

  if (erro) return <div className="pagina"><p role="alert">{erro}</p></div>
  if (!pedidos) return <div className="pagina"><p>Carregando...</p></div>

  const quantos = (chave) =>
    chave === 'TODOS' ? pedidos.length : pedidos.filter((p) => p.status === chave).length
  const visiveis = filtro === 'TODOS' ? pedidos : pedidos.filter((p) => p.status === filtro)

  return (
    <div className="pagina">
      <header className="cabecalho-pagina">
        <div>
          <h1>{ehAgente ? 'Pedidos de aluguel' : 'Meus pedidos'}</h1>
          <p className="subtitulo">
            {ehAgente
              ? 'Analise os pedidos e registre o parecer financeiro.'
              : 'Acompanhe o andamento de cada pedido de aluguel.'}
          </p>
        </div>
        {!ehAgente && <Link to="/pedidos/novo" className="btn btn-ouro">Novo pedido</Link>}
      </header>

      <div className="pedidos-filtros" role="group" aria-label="Filtrar por status">
        {FILTROS.map(([chave, rotulo]) => (
          <button
            key={chave}
            type="button"
            className={`pedidos-filtro${filtro === chave ? ' pedidos-filtro-ativo' : ''}`}
            onClick={() => setFiltro(chave)}
          >
            {rotulo}<small>{quantos(chave)}</small>
          </button>
        ))}
      </div>

      {visiveis.length === 0 ? (
        <div className="pedidos-vazio">
          <CarroIlustracao />
          <h2>Nenhum pedido por aqui</h2>
          <p>
            {pedidos.length === 0 && !ehAgente
              ? 'Que tal fazer o seu primeiro pedido de aluguel?'
              : 'Não há pedidos com esse status no momento.'}
          </p>
          {pedidos.length === 0 && !ehAgente && (
            <Link to="/pedidos/novo" className="btn btn-ouro">Fazer um pedido</Link>
          )}
        </div>
      ) : (
        <div className="pedidos-grid">
          {visiveis.map((p) => (
            <CartaoPedido key={p.id} pedido={p} mostrarCliente={ehAgente} />
          ))}
        </div>
      )}
    </div>
  )
}
