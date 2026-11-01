import CarroIlustracao from './CarroIlustracao'
import Icone from './Icone'
import './CartaoCarro.css'

export default function CartaoCarro({
  automovel,
  selecionavel = false,
  selecionado = false,
  onSelecionar,
}) {
  const classes = `carro carro-cor-${automovel.id % 4}`

  const conteudo = (
    <>
      <div className="carro-ilustracao">
        <CarroIlustracao />
      </div>
      <div className="carro-info">
        <h3>{automovel.marca} {automovel.modelo}</h3>
        <p>{automovel.ano} · Placa {automovel.placa}</p>
        <span className="carro-matricula">Matrícula {automovel.matricula}</span>
      </div>
    </>
  )

  if (!selecionavel) {
    return <article className={classes}>{conteudo}</article>
  }

  return (
    <label className={`${classes} carro-selecionavel${selecionado ? ' carro-ativo' : ''}`}>
      <input
        type="radio"
        name="automovel"
        className="sr-only"
        checked={selecionado}
        onChange={() => onSelecionar(automovel.id)}
        required
      />
      {conteudo}
      {selecionado && (
        <span className="carro-check"><Icone nome="check" tamanho={16} /></span>
      )}
    </label>
  )
}
