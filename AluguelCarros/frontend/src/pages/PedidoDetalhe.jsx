import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { listarAutomoveis } from '../services/automovelService'
import {
  atualizarPedido,
  avaliarPedido,
  buscarPedido,
  cancelarPedido,
} from '../services/pedidoService'
import { mensagemDeErro } from '../services/api'
import StatusBadge from '../components/StatusBadge'

function formatarData(iso) {
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

export default function PedidoDetalhe() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const ehAgente = usuario?.papel === 'AGENTE'

  const [pedido, setPedido] = useState(null)
  const [automoveis, setAutomoveis] = useState([])
  const [edicao, setEdicao] = useState(null)
  const [parecer, setParecer] = useState({ aprovado: 'sim', justificativa: '' })
  const [erro, setErro] = useState('')

  useEffect(() => {
    Promise.all([buscarPedido(id), listarAutomoveis()])
      .then(([dadosPedido, dadosAutomoveis]) => {
        setPedido(dadosPedido)
        setAutomoveis(dadosAutomoveis)
      })
      .catch((err) => setErro(mensagemDeErro(err, 'Não foi possível carregar o pedido.')))
  }, [id])

  function iniciarEdicao() {
    setErro('')
    setEdicao({
      automovelId: String(pedido.automovel.id),
      dataInicio: pedido.dataInicio,
      dataFim: pedido.dataFim,
    })
  }

  async function salvarEdicao(e) {
    e.preventDefault()
    setErro('')
    try {
      const atualizado = await atualizarPedido(id, {
        automovelId: Number(edicao.automovelId),
        dataInicio: edicao.dataInicio,
        dataFim: edicao.dataFim,
      })
      setPedido(atualizado)
      setEdicao(null)
    } catch (err) {
      setErro(mensagemDeErro(err, 'Não foi possível modificar o pedido.'))
    }
  }

  async function cancelar() {
    if (!window.confirm('Deseja realmente cancelar este pedido?')) return
    setErro('')
    try {
      setPedido(await cancelarPedido(id))
    } catch (err) {
      setErro(mensagemDeErro(err, 'Não foi possível cancelar o pedido.'))
    }
  }

  async function enviarParecer(e) {
    e.preventDefault()
    setErro('')
    try {
      setPedido(
        await avaliarPedido(id, {
          aprovado: parecer.aprovado === 'sim',
          justificativa: parecer.justificativa || undefined,
        }),
      )
    } catch (err) {
      setErro(mensagemDeErro(err, 'Não foi possível registrar o parecer.'))
    }
  }

  if (!pedido) {
    return erro ? <p role="alert">{erro}</p> : <p>Carregando...</p>
  }

  const emAnalise = pedido.status === 'EM_ANALISE'
  const podeCancelar = !ehAgente && ['EM_ANALISE', 'APROVADO'].includes(pedido.status)

  return (
    <section>
      <p><Link to="/pedidos">&larr; Voltar aos pedidos</Link></p>
      <h1>Pedido nº {pedido.id}</h1>

      <p>Status: <StatusBadge status={pedido.status} /></p>
      {pedido.justificativaParecer && <p>Justificativa do parecer: {pedido.justificativaParecer}</p>}
      {ehAgente && <p>Cliente: {pedido.clienteNome}</p>}
      <p>Pedido feito em: {formatarData(pedido.dataPedido)}</p>

      {edicao ? (
        <form onSubmit={salvarEdicao}>
          <label>
            Automóvel
            <select
              value={edicao.automovelId}
              onChange={(e) => setEdicao({ ...edicao, automovelId: e.target.value })}
              required
            >
              {automoveis.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.marca} {a.modelo} {a.ano} - {a.placa}
                </option>
              ))}
            </select>
          </label>
          <label>
            Data de retirada
            <input
              type="date"
              value={edicao.dataInicio}
              onChange={(e) => setEdicao({ ...edicao, dataInicio: e.target.value })}
              required
            />
          </label>
          <label>
            Data de devolução
            <input
              type="date"
              min={edicao.dataInicio}
              value={edicao.dataFim}
              onChange={(e) => setEdicao({ ...edicao, dataFim: e.target.value })}
              required
            />
          </label>
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => setEdicao(null)}>Descartar</button>
        </form>
      ) : (
        <>
          <p>
            Automóvel: {pedido.automovel.marca} {pedido.automovel.modelo} {pedido.automovel.ano}
            {' '}(placa {pedido.automovel.placa})
          </p>
          <p>Retirada: {formatarData(pedido.dataInicio)}</p>
          <p>Devolução: {formatarData(pedido.dataFim)}</p>
        </>
      )}

      {erro && <p role="alert">{erro}</p>}

      {emAnalise && !edicao && (
        <button type="button" onClick={iniciarEdicao}>Modificar pedido</button>
      )}
      {podeCancelar && !edicao && (
        <button type="button" onClick={cancelar}>Cancelar pedido</button>
      )}

      {ehAgente && emAnalise && !edicao && (
        <form onSubmit={enviarParecer}>
          <h2>Análise financeira</h2>
          <label>
            Parecer
            <select
              value={parecer.aprovado}
              onChange={(e) => setParecer({ ...parecer, aprovado: e.target.value })}
            >
              <option value="sim">Positivo (aprovar)</option>
              <option value="nao">Negativo (reprovar)</option>
            </select>
          </label>
          <label>
            Justificativa
            <textarea
              maxLength={500}
              value={parecer.justificativa}
              onChange={(e) => setParecer({ ...parecer, justificativa: e.target.value })}
            />
          </label>
          <button type="submit">Registrar parecer</button>
        </form>
      )}
    </section>
  )
}
