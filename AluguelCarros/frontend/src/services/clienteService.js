import api from './api'

export async function cadastrarCliente(cliente) {
  const { data } = await api.post('/clientes', cliente)
  return data
}
