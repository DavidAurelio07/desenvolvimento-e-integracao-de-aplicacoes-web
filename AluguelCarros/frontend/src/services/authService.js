import api from './api'

// Espera { token, usuario } como resposta do back-end
export async function login(credenciais) {
  const { data } = await api.post('/auth/login', credenciais)
  return data
}
