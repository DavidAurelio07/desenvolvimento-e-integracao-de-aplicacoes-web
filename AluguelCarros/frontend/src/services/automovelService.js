import api from './api'

export async function listarAutomoveis() {
  const { data } = await api.get('/automoveis')
  return data
}

export async function atualizarAutomovel(id, automovel) {
  const { data } = await api.put(`/automoveis/${id}`, automovel)
  return data
}

export async function cadastrarAutomovel(automovel) {
  const { data } = await api.post('/automoveis', automovel)
  return data
}
