import Marca from './Marca'
import Icone from './Icone'
import Serra from './Serra'
import CarroIlustracao from './CarroIlustracao'
import './AuthLayout.css'

const VANTAGENS = [
  'Peça seu aluguel em poucos minutos',
  'Acompanhe cada etapa do pedido',
  'Análise financeira clara e transparente',
]

export default function AuthLayout({ titulo, subtitulo, larga = false, children }) {
  return (
    <div className="auth">
      <aside className="auth-painel">
        <Marca para="/login" />

        <div className="auth-texto">
          <h2>Pegue a estrada com o jeito mineiro de ser.</h2>
          <ul className="auth-vantagens">
            {VANTAGENS.map((texto) => (
              <li key={texto}>
                <span className="auth-check"><Icone nome="check" tamanho={16} /></span>
                {texto}
              </li>
            ))}
          </ul>
        </div>

        <span className="auth-sol" aria-hidden="true" />
        <Serra className="auth-serra" />
        <CarroIlustracao className="auth-carro" />
      </aside>

      <div className="auth-conteudo">
        <div className={`auth-caixa${larga ? ' larga' : ''}`}>
          <h1>{titulo}</h1>
          <p className="auth-sub">{subtitulo}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
