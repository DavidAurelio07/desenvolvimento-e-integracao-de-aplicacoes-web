import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { listarAutomoveis } from '../services/automovelService'
import {
  atualizarPedido,
  avaliarPedido,
  buscarPedido,
  cancelarPedido,
  concederCredito,
  executarContrato,
} from '../services/pedidoService'
import { mensagemDeErro } from '../services/api'
import { diasEntre, formatarData, formatarMoeda } from '../utils/formatadores'
import FotoCarro from '../components/FotoCarro'
import Icone from '../components/Icone'
import LinhaDoTempo from '../components/LinhaDoTempo'
import StatusBadge from '../components/StatusBadge'
import './PedidoDetalhe.css'

// "para" indica qual tipo de agente pode escolher a opção (vazio = qualquer agente)
const TIPOS_CONTRATO = [
  { valor: 'PROPRIEDADE_CLIENTE', rotulo: 'Propriedade do cliente', para: null },
  { valor: 'PROPRIEDADE_EMPRESA', rotulo: 'Propriedade da empresa', para: 'EMPRESA' },
  { valor: 'PROPRIEDADE_BANCO', rotulo: 'Propriedade do banco', para: 'BANCO' },
]

export default function PedidoDetalhe() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const ehAgente = usuario?.papel === 'AGENTE'

  const [pedido, setPedido] = useState(null)
  const [automoveis, setAutomoveis] = useState([])
  const [edicao, setEdicao] = useState(null)
  const [parecer, setParecer] = useState({ aprovado: 'sim', justificativa: '' })
  const [contratoForm, setContratoForm] = useState({ tipo: 'PROPRIEDADE_CLIENTE', valorMensal: '' })
  const [creditoForm, setCreditoForm] = useState({ valorFinanciado: '', taxaJuros: '', prazoMeses: '' })
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

  async function enviarContrato(e) {
    e.preventDefault()
    setErro('')
    try {
      setPedido(
        await executarContrato(id, {
          tipo: contratoForm.tipo,
          valorMensal: Number(contratoForm.valorMensal),
        }),
      )
    } catch (err) {
      setErro(mensagemDeErro(err, 'Não foi possível executar o contrato.'))
    }
  }

  async function enviarCredito(e) {
    e.preventDefault()
    setErro('')
    try {
      setPedido(
        await concederCredito(id, {
          valorFinanciado: Number(creditoForm.valorFinanciado),
          taxaJuros: Number(creditoForm.taxaJuros),
          prazoMeses: Number(creditoForm.prazoMeses),
        }),
      )
    } catch (err) {
      setErro(mensagemDeErro(err, 'Não foi possível registrar o contrato de crédito.'))
    }
  }

  if (!pedido) {
    return (
      <div className="pagina">
        {erro ? <p role="alert">{erro}</p> : <p>Carregando...</p>}
      </div>
    )
  }

  const { automovel } = pedido
  const emAnalise = pedido.status === 'EM_ANALISE'
  const podeCancelar = !ehAgente && ['EM_ANALISE', 'APROVADO'].includes(pedido.status)
  const dias = diasEntre(pedido.dataInicio, pedido.dataFim)
  const { contrato } = pedido
  const rotuloTipo = (valor) => TIPOS_CONTRATO.find((t) => t.valor === valor)?.rotulo ?? valor
  const tiposDisponiveis = TIPOS_CONTRATO.filter((t) => !t.para || t.para === usuario?.tipoAgente)
  const podeExecutarContrato = ehAgente && pedido.status === 'APROVADO'
  const podeConcederCredito =
    ehAgente &&
    usuario?.tipoAgente === 'BANCO' &&
    pedido.status === 'CONTRATO_EXECUTADO' &&
    contrato &&
    !contrato.credito

  return (
    <div className="pagina">
      <Link to="/pedidos" className="detalhe-voltar">
        <Icone nome="seta" tamanho={16} /> Voltar aos pedidos
      </Link>

      <header className="detalhe-cabecalho">
        <div>
          <p className="detalhe-etiqueta">Pedido de aluguel</p>
          <h1>Pedido nº {pedido.id}</h1>
        </div>
        <StatusBadge status={pedido.status} />
      </header>

      <section className="cartao detalhe-tempo" aria-label="Andamento do pedido">
        <LinhaDoTempo status={pedido.status} />
      </section>

      {pedido.justificativaParecer && (
        <aside className="detalhe-parecer">
          <strong>Parecer financeiro</strong>
          <p>{pedido.justificativaParecer}</p>
        </aside>
      )}

      {erro && <p role="alert" style={{ marginBottom: '1.5rem' }}>{erro}</p>}

      <div className="detalhe-grid">
        <section className="cartao">
          {edicao ? (
            <form className="form-pilha" onSubmit={salvarEdicao}>
              <h2>Modificar pedido</h2>
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
              <div className="campos-grid">
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
              </div>
              <div className="acoes-linha">
                <button type="submit">Salvar alterações</button>
                <button type="button" className="btn-secundario" onClick={() => setEdicao(null)}>
                  Descartar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="detalhe-carro"><FotoCarro automovel={automovel} /></div>
              <h2>{automovel.marca} {automovel.modelo} {automovel.ano}</h2>
              <dl className="detalhe-lista">
                {ehAgente && (
                  <div><dt>Cliente</dt><dd>{pedido.clienteNome}</dd></div>
                )}
                <div><dt>Placa</dt><dd>{automovel.placa}</dd></div>
                <div><dt>Retirada</dt><dd>{formatarData(pedido.dataInicio)}</dd></div>
                <div><dt>Devolução</dt><dd>{formatarData(pedido.dataFim)}</dd></div>
                <div><dt>Período</dt><dd>{dias} {dias === 1 ? 'diária' : 'diárias'}</dd></div>
                <div><dt>Pedido feito em</dt><dd>{formatarData(pedido.dataPedido)}</dd></div>
              </dl>
            </>
          )}
        </section>

        <aside className="cartao detalhe-acoes">
          <h2>Ações</h2>
          {emAnalise && !edicao && (
            <button type="button" className="btn-secundario" onClick={iniciarEdicao}>
              Modificar pedido
            </button>
          )}
          {podeCancelar && !edicao && (
            <button type="button" className="btn-perigo" onClick={cancelar}>
              Cancelar pedido
            </button>
          )}
          {(podeExecutarContrato || podeConcederCredito) && !edicao && (
            <p className="detalhe-acoes-vazio">Use o painel abaixo para dar andamento ao pedido.</p>
          )}
          {!emAnalise && !podeCancelar && !podeExecutarContrato && !podeConcederCredito && (
            <p className="detalhe-acoes-vazio">Nenhuma ação disponível para este status.</p>
          )}
          {edicao && (
            <p className="detalhe-acoes-vazio">Finalize a edição ao lado para ver outras ações.</p>
          )}
        </aside>
      </div>


      {contrato && (
        <section className="cartao detalhe-contrato">
          <h2>Contrato de aluguel</h2>
          <div className="detalhe-contrato-grid">
            <dl className="detalhe-lista">
              <div><dt>Tipo</dt><dd>{rotuloTipo(contrato.tipo)}</dd></div>
              <div><dt>Valor mensal</dt><dd>{formatarMoeda(contrato.valorMensal)}</dd></div>
              <div><dt>Assinado em</dt><dd>{formatarData(contrato.dataAssinatura)}</dd></div>
              <div><dt>Executado por</dt><dd>{contrato.agenteNome}</dd></div>
              <div><dt>Proprietário do automóvel</dt><dd>{contrato.proprietarioNome}</dd></div>
            </dl>
            <div className="detalhe-credito">
              <h3>Contrato de crédito</h3>
              {contrato.credito ? (
                <dl className="detalhe-lista">
                  <div><dt>Banco</dt><dd>{contrato.credito.bancoNome}</dd></div>
                  <div><dt>Valor financiado</dt><dd>{formatarMoeda(contrato.credito.valorFinanciado)}</dd></div>
                  <div><dt>Taxa de juros</dt><dd>{contrato.credito.taxaJuros}% ao mês</dd></div>
                  <div><dt>Prazo</dt><dd>{contrato.credito.prazoMeses} meses</dd></div>
                </dl>
              ) : (
                <p className="detalhe-acoes-vazio">Este aluguel não possui contrato de crédito.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {podeExecutarContrato && (
        <section className="cartao detalhe-analise">
          <h2>Executar contrato</h2>
          <p>
            O tipo do contrato define quem passa a ser o proprietário do automóvel.
          </p>
          <form className="form-pilha" onSubmit={enviarContrato}>
            <div className="campos-grid">
              <label>
                Tipo de contrato
                <select
                  value={contratoForm.tipo}
                  onChange={(e) => setContratoForm({ ...contratoForm, tipo: e.target.value })}
                >
                  {tiposDisponiveis.map((t) => (
                    <option key={t.valor} value={t.valor}>{t.rotulo}</option>
                  ))}
                </select>
              </label>
              <label>
                Valor mensal (R$)
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={contratoForm.valorMensal}
                  onChange={(e) => setContratoForm({ ...contratoForm, valorMensal: e.target.value })}
                  required
                />
              </label>
            </div>
            <div className="acoes-linha">
              <button type="submit">Executar contrato</button>
            </div>
          </form>
        </section>
      )}

      {podeConcederCredito && (
        <section className="cartao detalhe-analise">
          <h2>Conceder crédito</h2>
          <p>Associe a este aluguel um contrato de crédito do seu banco.</p>
          <form className="form-pilha" onSubmit={enviarCredito}>
            <div className="campos-grid">
              <label>
                Valor financiado (R$)
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={creditoForm.valorFinanciado}
                  onChange={(e) => setCreditoForm({ ...creditoForm, valorFinanciado: e.target.value })}
                  required
                />
              </label>
              <label>
                Taxa de juros (% ao mês)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={creditoForm.taxaJuros}
                  onChange={(e) => setCreditoForm({ ...creditoForm, taxaJuros: e.target.value })}
                  required
                />
              </label>
              <label>
                Prazo (meses)
                <input
                  type="number"
                  min="1"
                  max="600"
                  step="1"
                  value={creditoForm.prazoMeses}
                  onChange={(e) => setCreditoForm({ ...creditoForm, prazoMeses: e.target.value })}
                  required
                />
              </label>
            </div>
            <div className="acoes-linha">
              <button type="submit">Registrar crédito</button>
            </div>
          </form>
        </section>
      )}

      {ehAgente && emAnalise && !edicao && (
        <section className="cartao detalhe-analise">
          <h2>Análise financeira</h2>
          <p>Avalie o pedido e registre o parecer. O cliente verá a justificativa.</p>
          <form className="form-pilha" onSubmit={enviarParecer}>
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
            <div className="acoes-linha">
              <button type="submit">Registrar parecer</button>
            </div>
          </form>
        </section>
      )}
    </div>
  )
}
