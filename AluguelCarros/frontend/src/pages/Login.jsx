import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

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
      setErro(err.response?.data?.message ?? 'Usuário ou senha inválidos.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section>
      <h1>Bão de Roda</h1>
      <h2>Entrar</h2>
      <form onSubmit={enviar}>
        <label>
          Usuário
          <input name="login" value={credenciais.login} onChange={atualizar} required />
        </label>
        <label>
          Senha
          <input
            type="password"
            name="senha"
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
      <p>
        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </section>
  )
}
