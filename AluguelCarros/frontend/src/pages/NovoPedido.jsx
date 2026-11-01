import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarAutomoveis } from '../services/automovelService'
import { criarPedido } from '../services/pedidoService'
import { mensagemDeErro } from '../services/api'
import { diasEntre, formatarData } from '../utils/formatadores'
import CarroIlustracao from '../components/CarroIlustracao'
import CartaoCarro from '../components/CartaoCarro'
import './NovoPedido.css'

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

  const escolhido = automoveis.find((a) => String(a.id) === form.automovelId)
  const dias = diasEntre(form.dataInicio, form.dataFim)

  return (
    <div className="pagina">
      <header className="cabecalho-pagina">
        <div>
          <h1>Novo pedido de aluguel</h1>
          <p className="subtitulo">Escolha o automóvel e o período. O pedido segue para análise financeira.</p>
        </div>
      </header>

      <form className="novo-grid" onSubmit={enviar}>
        <div className="novo-principal">
          <section className="cartao">
            <h2 className="novo-titulo"><span className="novo-passo">1</span> Escolha o automóvel</h2>
            {automoveis.length === 0 ? (
              <p className="vazio">Nenhum automóvel disponível no momento.</p>
            ) : (
              <div className="novo-carros">
                {automoveis.map((a) => (
                  <CartaoCarro
                    key={a.id}
                    automovel={a}
                    selecionavel
                    selecionado={String(a.id) === form.automovelId}
                    onSelecionar={(id) => setForm({ ...form, automovelId: String(id) })}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="cartao">
            <h2 className="novo-titulo"><span className="novo-passo">2</span> Escolha o período</h2>
            <div className="campos-grid">
              <label>
                Data de retirada
                <input type="date" name="dataInicio" min={hoje} value={form.dataInicio} onChange={atualizar} required />
              </label>
              <label>
                Data de devolução
                <input type="date" name="dataFim" min={form.dataInicio || hoje} value={form.dataFim} onChange={atualizar} required />
              </label>
            </div>
          </section>
        </div>

        <aside className="cartao novo-resumo">
          <h2>Resumo do pedido</h2>

          {escolhido ? (
            <>
              <div className="novo-resumo-carro"><CarroIlustracao /></div>
              <dl className="novo-resumo-lista">
                <div><dt>Automóvel</dt><dd>{escolhido.marca} {escolhido.modelo}</dd></div>
                <div><dt>Placa</dt><dd>{escolhido.placa}</dd></div>
                <div><dt>Retirada</dt><dd>{form.dataInicio ? formatarData(form.dataInicio) : '–'}</dd></div>
                <div><dt>Devolução</dt><dd>{form.dataFim ? formatarData(form.dataFim) : '–'}</dd></div>
              </dl>
            </>
          ) : (
            <p className="novo-resumo-vazio">Selecione um automóvel para ver o resumo.</p>
          )}

          {dias > 0 && (
            <div className="novo-resumo-dias">
              <span>Período</span>
              <span>{dias} {dias === 1 ? 'diária' : 'diárias'}</span>
            </div>
          )}

          {erro && <p role="alert">{erro}</p>}
          <button type="submit" className="btn-bloco" disabled={enviando || !escolhido}>
            {enviando ? 'Enviando...' : 'Enviar pedido'}
          </button>
        </aside>
      </form>
    </div>
  )
}
