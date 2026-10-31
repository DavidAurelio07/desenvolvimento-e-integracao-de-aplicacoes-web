import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { atualizarPerfil, buscarPerfil, excluirPerfil } from '../services/clienteService'
import { mensagemDeErro } from '../services/api'
import RendimentosEditor from '../components/RendimentosEditor'

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
    return erro ? <p role="alert">{erro}</p> : <p>Carregando...</p>
  }

  return (
    <section>
      <h1>Meu cadastro</h1>
      <form onSubmit={salvar}>
        <label>
          Usuário
          <input value={perfil.login} disabled />
        </label>
        <label>
          CPF
          <input value={perfil.cpf} disabled />
        </label>
        <label>
          Nome
          <input name="nome" value={form.nome} onChange={atualizar} required />
        </label>
        <label>
          RG
          <input name="rg" value={form.rg} onChange={atualizar} required />
        </label>
        <label>
          Endereço
          <input name="endereco" value={form.endereco} onChange={atualizar} required />
        </label>
        <label>
          Profissão
          <input name="profissao" value={form.profissao} onChange={atualizar} required />
        </label>
        <label>
          Nova senha (deixe em branco para manter a atual)
          <input type="password" name="senha" value={form.senha} onChange={atualizar} minLength={6} />
        </label>

        <RendimentosEditor rendimentos={rendimentos} onChange={setRendimentos} />

        {mensagem && <p>{mensagem}</p>}
        {erro && <p role="alert">{erro}</p>}
        <button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>

      <hr />
      <button type="button" onClick={excluir}>Excluir meu cadastro</button>
    </section>
  )
}
