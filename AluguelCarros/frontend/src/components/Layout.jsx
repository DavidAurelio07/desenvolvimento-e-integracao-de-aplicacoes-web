import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Layout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  function sair() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header>
        <strong>Bão de Roda</strong>
        <span> | {usuario?.nome}</span>
        <button type="button" onClick={sair}>Sair</button>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
