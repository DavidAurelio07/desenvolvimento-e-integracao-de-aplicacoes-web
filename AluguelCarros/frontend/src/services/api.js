import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Token expirado ou inválido: limpa a sessão e volta para o login
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const url = erro.config?.url ?? ''
    if (erro.response?.status === 401 && !url.includes('/auth/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(erro)
  },
)

export function mensagemDeErro(erro, padrao) {
  return erro.response?.data?.message ?? padrao
}

export default api
