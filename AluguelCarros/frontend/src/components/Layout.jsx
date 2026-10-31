import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Layout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const ehAgente = usuario?.papel === 'AGENTE'

  function sair() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header>
        <strong>Bão de Roda</strong>
        <nav>
          <Link to="/">Início</Link>{' | '}
          <Link to="/pedidos">{ehAgente ? 'Pedidos' : 'Meus pedidos'}</Link>{' | '}
          {ehAgente ? (
            <Link to="/automoveis">Automóveis</Link>
          ) : (
            <>
              <Link to="/pedidos/novo">Novo pedido</Link>{' | '}
              <Link to="/perfil">Meu cadastro</Link>
            </>
          )}
        </nav>
        <span>
          {usuario?.nome} ({ehAgente ? 'agente' : 'cliente'}){' '}
          <button type="button" onClick={sair}>Sair</button>
        </span>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
