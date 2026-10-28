import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cadastrarCliente } from '../services/clienteService'

const MAX_RENDIMENTOS = 3

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

  function adicionarRendimento() {
    if (rendimentos.length < MAX_RENDIMENTOS) {
      setRendimentos([...rendimentos, { entidadeEmpregadora: '', valor: '' }])
    }
  }

  function atualizarRendimento(indice, campo, valor) {
    setRendimentos(
      rendimentos.map((r, i) => (i === indice ? { ...r, [campo]: valor } : r)),
    )
  }

  function removerRendimento(indice) {
    setRendimentos(rendimentos.filter((_, i) => i !== indice))
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
      setErro(err.response?.data?.message ?? 'Não foi possível concluir o cadastro.')
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
          Senha
          <input type="password" name="senha" value={form.senha} onChange={atualizar} required />
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

        <fieldset>
          <legend>Rendimentos (máximo {MAX_RENDIMENTOS})</legend>
          {rendimentos.map((r, i) => (
            <div key={i}>
              <input
                placeholder="Entidade empregadora"
                value={r.entidadeEmpregadora}
                onChange={(e) => atualizarRendimento(i, 'entidadeEmpregadora', e.target.value)}
                required
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Rendimento (R$)"
                value={r.valor}
                onChange={(e) => atualizarRendimento(i, 'valor', e.target.value)}
                required
              />
              <button type="button" onClick={() => removerRendimento(i)}>
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={adicionarRendimento}
            disabled={rendimentos.length >= MAX_RENDIMENTOS}
          >
            Adicionar rendimento
          </button>
        </fieldset>

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
