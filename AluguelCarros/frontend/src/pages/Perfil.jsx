import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { atualizarPerfil, buscarPerfil, excluirPerfil } from '../services/clienteService'
import { mensagemDeErro } from '../services/api'
import { iniciais } from '../utils/formatadores'
import RendimentosEditor from '../components/RendimentosEditor'
import './Perfil.css'

export default function Perfil() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [form, setForm] = useState({ nome: '', rg: '', endereco: '', profissao: '', senha: '' })
  const [rendimentos, setRendimentos] = useState([])
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    buscarPerfil()
      .then((dados) => {
        setPerfil(dados)
        setForm({
          nome: dados.nome,
          rg: dados.rg,
          endereco: dados.endereco,
          profissao: dados.profissao,
          senha: '',
        })
        setRendimentos(
          dados.rendimentos.map((r) => ({
            entidadeEmpregadora: r.entidadeEmpregadora,
            valor: String(r.valor),
          })),
        )
      })
      .catch((err) => setErro(mensagemDeErro(err, 'Não foi possível carregar o cadastro.')))
  }, [])

  function atualizar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')
    setSalvando(true)
    try {
      const dados = await atualizarPerfil({
        nome: form.nome,
        rg: form.rg,
        endereco: form.endereco,
        profissao: form.profissao,
        senha: form.senha || undefined,
        rendimentos: rendimentos.map((r) => ({
          entidadeEmpregadora: r.entidadeEmpregadora,
          valor: Number(r.valor),
        })),
      })
      setPerfil(dados)
      setForm({ ...form, senha: '' })
      setMensagem('Cadastro atualizado com sucesso.')
    } catch (err) {
      setErro(mensagemDeErro(err, 'Não foi possível atualizar o cadastro.'))
    } finally {
      setSalvando(false)
    }
  }

  async function excluir() {
    if (!window.confirm('Tem certeza que deseja excluir seu cadastro? Esta ação não pode ser desfeita.')) {
      return
    }
    setErro('')
    try {
      await excluirPerfil()
      logout()
      navigate('/login')
    } catch (err) {
      setErro(mensagemDeErro(err, 'Não foi possível excluir o cadastro.'))
    }
  }

  if (!perfil) {
    return (
      <div className="pagina">
        {erro ? <p role="alert">{erro}</p> : <p>Carregando...</p>}
      </div>
    )
  }

  return (
    <div className="pagina">
      <header className="cabecalho-pagina">
        <div>
          <h1>Meu cadastro</h1>
          <p className="subtitulo">Consulte e mantenha seus dados atualizados.</p>
        </div>
      </header>

      <div className="perfil-grid">
        <aside className="cartao perfil-resumo">
          <span className="perfil-avatar" aria-hidden="true">{iniciais(perfil.nome)}</span>
          <h2>{perfil.nome}</h2>
          <p className="perfil-usuario">@{perfil.login}</p>
          <dl className="perfil-fatos">
            <div><dt>CPF</dt><dd>{perfil.cpf}</dd></div>
            <div><dt>Profissão</dt><dd>{perfil.profissao}</dd></div>
            <div><dt>Rendimentos</dt><dd>{perfil.rendimentos.length} de 3</dd></div>
          </dl>
        </aside>

        <div className="perfil-coluna">
          <form className="perfil-coluna" onSubmit={salvar}>
            <section className="cartao perfil-secao">
              <h2>Dados pessoais</h2>
              <div className="campos-grid">
                <label>
                  Usuário
                  <input value={perfil.login} disabled />
                </label>
                <label>
                  CPF
                  <input value={perfil.cpf} disabled />
                </label>
                <label className="campo-largo">
                  Nome completo
                  <input name="nome" value={form.nome} onChange={atualizar} required />
                </label>
                <label>
                  RG
                  <input name="rg" value={form.rg} onChange={atualizar} required />
                </label>
                <label>
                  Profissão
                  <input name="profissao" value={form.profissao} onChange={atualizar} required />
                </label>
                <label className="campo-largo">
                  Endereço
                  <input name="endereco" value={form.endereco} onChange={atualizar} required />
                </label>
              </div>
            </section>

            <section className="cartao perfil-secao">
              <h2>Rendimentos</h2>
              <RendimentosEditor rendimentos={rendimentos} onChange={setRendimentos} />
            </section>

            <section className="cartao perfil-secao">
              <h2>Segurança</h2>
              <label>
                Nova senha
                <input
                  type="password"
                  name="senha"
                  autoComplete="new-password"
                  value={form.senha}
                  onChange={atualizar}
                  minLength={6}
                />
              </label>
              <p className="perfil-dica">Deixe em branco para manter a senha atual.</p>
            </section>

            {mensagem && <p className="sucesso">{mensagem}</p>}
            {erro && <p role="alert">{erro}</p>}
            <div className="perfil-barra">
              <button type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </form>

          <section className="cartao perfil-perigo">
            <h2>Excluir cadastro</h2>
            <p>
              Ao excluir, seus dados são removidos do sistema. Isso só é possível
              quando não há pedidos de aluguel associados ao seu cadastro.
            </p>
            <button type="button" className="btn-perigo" onClick={excluir}>
              Excluir meu cadastro
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
