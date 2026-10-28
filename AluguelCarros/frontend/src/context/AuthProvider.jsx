import { useState } from 'react'
import { AuthContext } from './AuthContext'
import { login as loginRequest } from '../services/authService'

function lerUsuarioSalvo() {
  try {
    return JSON.parse(localStorage.getItem('usuario'))
  } catch {
    return null
  }
}

export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerUsuarioSalvo)

  async function login(credenciais) {
    const { token, usuario: dados } = await loginRequest(credenciais)
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(dados))
    setUsuario(dados)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider
      value={{ usuario, autenticado: Boolean(usuario), login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
