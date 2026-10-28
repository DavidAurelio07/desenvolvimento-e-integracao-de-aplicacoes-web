import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute() {
  const { autenticado } = useAuth()
  return autenticado ? <Outlet /> : <Navigate to="/login" replace />
}
