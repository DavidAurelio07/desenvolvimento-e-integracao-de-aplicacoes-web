import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { mensagemDeErro } from '../services/api'
import AuthLayout from '../components/AuthLayout'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [credenciais, setCredenciais] = useState({ login: '', senha: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function atualizar(e) {
    setCredenciais({ ...credenciais, [e.target.name]: e.target.value })
  }

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await login(credenciais)
      navigate('/')
    } catch (err) {
      setErro(mensagemDeErro(err, 'Usuário ou senha inválidos.'))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Bem-vindo de volta"
      subtitulo="Entre para acompanhar e fazer seus pedidos de aluguel."
    >
      <form className="login-form" onSubmit={enviar}>
        <label>
          Usuário
          <input
            name="login"
            autoComplete="username"
            value={credenciais.login}
            onChange={atualizar}
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            name="senha"
            autoComplete="current-password"
            value={credenciais.senha}
            onChange={atualizar}
            required
          />
        </label>
        {erro && <p role="alert">{erro}</p>}
        <button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="login-rodape">
        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </AuthLayout>
  )
}
