import api from './api'

export async function listarPedidos() {
  const { data } = await api.get('/pedidos')
  return data
}

export async function buscarPedido(id) {
  const { data } = await api.get(`/pedidos/${id}`)
  return data
}

export async function criarPedido(pedido) {
  const { data } = await api.post('/pedidos', pedido)
  return data
}

export async function atualizarPedido(id, pedido) {
  const { data } = await api.put(`/pedidos/${id}`, pedido)
  return data
}

export async function cancelarPedido(id) {
  const { data } = await api.patch(`/pedidos/${id}/cancelar`)
  return data
}

export async function avaliarPedido(id, avaliacao) {
  const { data } = await api.post(`/pedidos/${id}/avaliacoes`, avaliacao)
  return data
}
