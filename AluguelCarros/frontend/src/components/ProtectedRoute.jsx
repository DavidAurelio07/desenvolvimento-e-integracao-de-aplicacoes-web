import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Sem "papel": basta estar autenticado. Com "papel": só CLIENTE ou só AGENTE.
export default function ProtectedRoute({ papel }) {
  const { autenticado, usuario } = useAuth()

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }
  if (papel && usuario?.papel !== papel) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
