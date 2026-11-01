import { useEffect, useState } from 'react'
import { cadastrarAutomovel, listarAutomoveis } from '../services/automovelService'
import { mensagemDeErro } from '../services/api'
import CartaoCarro from '../components/CartaoCarro'
import './Automoveis.css'

const formInicial = { matricula: '', ano: '', marca: '', modelo: '', placa: '' }

export default function Automoveis() {
  const [automoveis, setAutomoveis] = useState(null)
  const [form, setForm] = useState(formInicial)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

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
    setSalvando(true)
    try {
      const novo = await cadastrarAutomovel({ ...form, ano: Number(form.ano) })
      setAutomoveis([...automoveis, novo])
      setForm(formInicial)
    } catch (err) {
      setErro(mensagemDeErro(err, 'Não foi possível cadastrar o automóvel.'))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="pagina">
      <header className="cabecalho-pagina">
        <div>
          <h1>Automóveis</h1>
          <p className="subtitulo">Cadastre e consulte os carros disponíveis para aluguel.</p>
        </div>
        {automoveis && <span className="auto-contador">{automoveis.length} cadastrados</span>}
      </header>

      <div className="auto-grid">
        <section className="cartao auto-formulario">
          <h2>Cadastrar automóvel</h2>
          <form className="form-pilha" onSubmit={enviar}>
            <label>
              Marca
              <input name="marca" value={form.marca} onChange={atualizar} required />
            </label>
            <label>
              Modelo
              <input name="modelo" value={form.modelo} onChange={atualizar} required />
            </label>
            <div className="campos-grid">
              <label>
                Ano
                <input type="number" name="ano" min="1900" value={form.ano} onChange={atualizar} required />
              </label>
              <label>
                Placa
                <input name="placa" value={form.placa} onChange={atualizar} required />
              </label>
            </div>
            <label>
              Matrícula
              <input name="matricula" value={form.matricula} onChange={atualizar} required />
            </label>
            {erro && <p role="alert">{erro}</p>}
            <button type="submit" className="btn-bloco" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Cadastrar automóvel'}
            </button>
          </form>
        </section>

        <section>
          {!automoveis ? (
            <p>Carregando...</p>
          ) : automoveis.length === 0 ? (
            <p className="vazio">Nenhum automóvel cadastrado.</p>
          ) : (
            <div className="auto-lista">
              {automoveis.map((a) => (
                <CartaoCarro key={a.id} automovel={a} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
