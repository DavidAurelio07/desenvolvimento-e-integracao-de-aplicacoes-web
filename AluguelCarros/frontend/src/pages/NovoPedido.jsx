import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarAutomoveis } from '../services/automovelService'
import { criarPedido } from '../services/pedidoService'
import { mensagemDeErro } from '../services/api'

export default function NovoPedido() {
  const navigate = useNavigate()
  const hoje = new Date().toLocaleDateString('en-CA')
  const [automoveis, setAutomoveis] = useState([])
  const [form, setForm] = useState({ automovelId: '', dataInicio: '', dataFim: '' })
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    listarAutomoveis()
      .then(setAutomoveis)
      .catch((err) => setErro(mensagemDeErro(err, 'Não foi possível carregar os automóveis.')))
  }, [])

  function atualizar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      const pedido = await criarPedido({
        automovelId: Number(form.automovelId),
        dataInicio: form.dataInicio,
        dataFim: form.dataFim,
      })
      navigate(`/pedidos/${pedido.id}`)
    } catch (err) {
      setErro(mensagemDeErro(err, 'Não foi possível criar o pedido.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section>
      <h1>Novo pedido de aluguel</h1>
      <form onSubmit={enviar}>
        <label>
          Automóvel
          <select name="automovelId" value={form.automovelId} onChange={atualizar} required>
            <option value="">Selecione...</option>
            {automoveis.map((a) => (
              <option key={a.id} value={a.id}>
                {a.marca} {a.modelo} {a.ano} - {a.placa}
              </option>
            ))}
          </select>
        </label>
        <label>
          Data de retirada
          <input type="date" name="dataInicio" min={hoje} value={form.dataInicio} onChange={atualizar} required />
        </label>
        <label>
          Data de devolução
          <input type="date" name="dataFim" min={form.dataInicio || hoje} value={form.dataFim} onChange={atualizar} required />
        </label>
        {erro && <p role="alert">{erro}</p>}
        <button type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar pedido'}
        </button>
      </form>
    </section>
  )
}
