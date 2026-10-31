import { useEffect, useState } from 'react'
import { cadastrarAutomovel, listarAutomoveis } from '../services/automovelService'
import { mensagemDeErro } from '../services/api'

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
    <section>
      <h1>Automóveis</h1>

      <form onSubmit={enviar}>
        <h2>Cadastrar automóvel</h2>
        <label>
          Matrícula
          <input name="matricula" value={form.matricula} onChange={atualizar} required />
        </label>
        <label>
          Ano
          <input type="number" name="ano" min="1900" value={form.ano} onChange={atualizar} required />
        </label>
        <label>
          Marca
          <input name="marca" value={form.marca} onChange={atualizar} required />
        </label>
        <label>
          Modelo
          <input name="modelo" value={form.modelo} onChange={atualizar} required />
        </label>
        <label>
          Placa
          <input name="placa" value={form.placa} onChange={atualizar} required />
        </label>
        {erro && <p role="alert">{erro}</p>}
        <button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Cadastrar'}
        </button>
      </form>

      <h2>Automóveis cadastrados</h2>
      {!automoveis ? (
        <p>Carregando...</p>
      ) : automoveis.length === 0 ? (
        <p>Nenhum automóvel cadastrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Ano</th>
              <th>Placa</th>
            </tr>
          </thead>
          <tbody>
            {automoveis.map((a) => (
              <tr key={a.id}>
                <td>{a.matricula}</td>
                <td>{a.marca}</td>
                <td>{a.modelo}</td>
                <td>{a.ano}</td>
                <td>{a.placa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
