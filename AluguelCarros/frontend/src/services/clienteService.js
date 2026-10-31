import api from './api'

export async function cadastrarCliente(cliente) {
  const { data } = await api.post('/clientes', cliente)
  return data
}

export async function buscarPerfil() {
  const { data } = await api.get('/clientes/me')
  return data
}

export async function atualizarPerfil(dados) {
  const { data } = await api.put('/clientes/me', dados)
  return data
}

export async function excluirPerfil() {
  await api.delete('/clientes/me')
}
