import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cadastrarCliente } from '../services/clienteService'
import { mensagemDeErro } from '../services/api'
import RendimentosEditor from '../components/RendimentosEditor'

const formInicial = {
  login: '',
  senha: '',
  nome: '',
  cpf: '',
  rg: '',
  endereco: '',
  profissao: '',
}

export default function Cadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState(formInicial)
  const [rendimentos, setRendimentos] = useState([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function atualizar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await cadastrarCliente({
        ...form,
        rendimentos: rendimentos.map((r) => ({
          entidadeEmpregadora: r.entidadeEmpregadora,
          valor: Number(r.valor),
        })),
      })
      navigate('/login')
    } catch (err) {
      setErro(mensagemDeErro(err, 'Não foi possível concluir o cadastro.'))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section>
      <h1>Bão de Roda</h1>
      <h2>Cadastro de cliente</h2>
      <form onSubmit={enviar}>
        <label>
          Usuário
          <input name="login" value={form.login} onChange={atualizar} required />
        </label>
        <label>
          Senha (mínimo 6 caracteres)
          <input type="password" name="senha" value={form.senha} onChange={atualizar} minLength={6} required />
        </label>
        <label>
          Nome
          <input name="nome" value={form.nome} onChange={atualizar} required />
        </label>
        <label>
          CPF
          <input name="cpf" value={form.cpf} onChange={atualizar} required />
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

        <RendimentosEditor rendimentos={rendimentos} onChange={setRendimentos} />

        {erro && <p role="alert">{erro}</p>}
        <button type="submit" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </section>
  )
}
