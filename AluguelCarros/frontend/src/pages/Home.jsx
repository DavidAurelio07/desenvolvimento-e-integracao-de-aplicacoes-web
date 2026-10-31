import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Home() {
  const { usuario } = useAuth()
  const ehAgente = usuario?.papel === 'AGENTE'

  return (
    <section>
      <h1>Bem-vindo, {usuario?.nome}!</h1>
      {ehAgente ? (
        <ul>
          <li><Link to="/pedidos">Analisar pedidos de aluguel</Link></li>
          <li><Link to="/automoveis">Gerenciar automóveis</Link></li>
        </ul>
      ) : (
        <ul>
          <li><Link to="/pedidos/novo">Fazer um pedido de aluguel</Link></li>
          <li><Link to="/pedidos">Acompanhar meus pedidos</Link></li>
          <li><Link to="/perfil">Ver ou alterar meu cadastro</Link></li>
        </ul>
      )}
    </section>
  )
}
