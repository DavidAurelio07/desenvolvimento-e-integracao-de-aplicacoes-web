import { useEffect, useState } from 'react'
import {
  atualizarAutomovel,
  cadastrarAutomovel,
  listarAutomoveis,
} from '../services/automovelService'
import { mensagemDeErro } from '../services/api'
import CartaoCarro from '../components/CartaoCarro'
import FotoCarro from '../components/FotoCarro'
import './Automoveis.css'

const formInicial = { matricula: '', ano: '', marca: '', modelo: '', placa: '', imagemUrl: '' }

export default function Automoveis() {
  const [automoveis, setAutomoveis] = useState(null)
  const [form, setForm] = useState(formInicial)
  const [editandoId, setEditandoId] = useState(null)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    listarAutomoveis()
      .then(setAutomoveis)
      .catch((err) => setErro(mensagemDeErro(err, 'Não foi possível carregar os automóveis.')))
  }, [])

  function atualizar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function iniciarEdicao(automovel) {
    setEditandoId(automovel.id)
    setForm({
      matricula: automovel.matricula,
      ano: String(automovel.ano),
      marca: automovel.marca,
      modelo: automovel.modelo,
      placa: automovel.placa,
      imagemUrl: automovel.imagemUrl ?? '',
    })
    setErro('')
    setMensagem('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelarEdicao() {
    setEditandoId(null)
    setForm(formInicial)
    setErro('')
  }

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')
    setSalvando(true)
    const dados = { ...form, ano: Number(form.ano), imagemUrl: form.imagemUrl.trim() }
    try {
      if (editandoId) {
        const atualizado = await atualizarAutomovel(editandoId, dados)
        setAutomoveis(automoveis.map((a) => (a.id === editandoId ? atualizado : a)))
        setMensagem('Automóvel atualizado com sucesso.')
      } else {
        const novo = await cadastrarAutomovel(dados)
        setAutomoveis([...automoveis, novo])
        setMensagem('Automóvel cadastrado com sucesso.')
      }
      setEditandoId(null)
      setForm(formInicial)
    } catch (err) {
      setErro(mensagemDeErro(err, 'Não foi possível salvar o automóvel.'))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="pagina">
      <header className="cabecalho-pagina">
        <div>
          <h1>Automóveis</h1>
          <p className="subtitulo">Cadastre, edite e consulte os carros disponíveis para aluguel.</p>
        </div>
        {automoveis && <span className="auto-contador">{automoveis.length} cadastrados</span>}
      </header>

      <div className="auto-grid">
        <section className="cartao auto-formulario">
          <h2>{editandoId ? 'Editar automóvel' : 'Cadastrar automóvel'}</h2>
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

            <label>
              Link da foto (opcional)
              <input
                type="url"
                name="imagemUrl"
                placeholder="https://exemplo.com/foto-do-carro.jpg"
                value={form.imagemUrl}
                onChange={atualizar}
              />
            </label>
            <div className="auto-previa">
              <FotoCarro
                automovel={{ marca: form.marca, modelo: form.modelo, imagemUrl: form.imagemUrl.trim() }}
              />
            </div>
            <p className="auto-dica">
              Cole o endereço de uma imagem (clique com o botão direito na foto e escolha
              &quot;Copiar endereço da imagem&quot;). Se a prévia mostrar só a ilustração,
              o link não é de uma imagem ou o site bloqueia o uso dela.
            </p>

            {mensagem && <p className="sucesso">{mensagem}</p>}
            {erro && <p role="alert">{erro}</p>}
            <div className="acoes-linha">
              <button type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : editandoId ? 'Salvar alterações' : 'Cadastrar automóvel'}
              </button>
              {editandoId && (
                <button type="button" className="btn-secundario" onClick={cancelarEdicao}>
                  Cancelar edição
                </button>
              )}
            </div>
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
                <CartaoCarro key={a.id} automovel={a} onEditar={iniciarEdicao} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
