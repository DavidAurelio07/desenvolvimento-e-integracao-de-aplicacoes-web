import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cadastrarCliente } from '../services/clienteService'
import { mensagemDeErro } from '../services/api'
import AuthLayout from '../components/AuthLayout'
import RendimentosEditor from '../components/RendimentosEditor'
import './Cadastro.css'

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
    <AuthLayout
      larga
      titulo="Crie sua conta"
      subtitulo="Preencha seus dados para começar a pedir aluguéis de automóveis."
    >
      <form className="cadastro-form" onSubmit={enviar}>
        <section className="cadastro-bloco">
          <h2 className="cadastro-bloco-titulo">
            <span className="cadastro-numero">1</span> Acesso
          </h2>
          <div className="campos-grid">
            <label>
              Usuário
              <input name="login" autoComplete="username" value={form.login} onChange={atualizar} required />
            </label>
            <label>
              Senha (mínimo 6 caracteres)
              <input
                type="password"
                name="senha"
                autoComplete="new-password"
                value={form.senha}
                onChange={atualizar}
                minLength={6}
                required
              />
            </label>
          </div>
        </section>

        <section className="cadastro-bloco">
          <h2 className="cadastro-bloco-titulo">
            <span className="cadastro-numero">2</span> Dados pessoais
          </h2>
          <div className="campos-grid">
            <label className="campo-largo">
              Nome completo
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
            <label className="campo-largo">
              Endereço
              <input name="endereco" value={form.endereco} onChange={atualizar} required />
            </label>
            <label className="campo-largo">
              Profissão
              <input name="profissao" value={form.profissao} onChange={atualizar} required />
            </label>
          </div>
        </section>

        <section className="cadastro-bloco">
          <h2 className="cadastro-bloco-titulo">
            <span className="cadastro-numero">3</span> Rendimentos
          </h2>
          <RendimentosEditor rendimentos={rendimentos} onChange={setRendimentos} />
        </section>

        {erro && <p role="alert">{erro}</p>}
        <button type="submit" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Criar conta'}
        </button>
      </form>

      <p className="cadastro-rodape">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </AuthLayout>
  )
}
