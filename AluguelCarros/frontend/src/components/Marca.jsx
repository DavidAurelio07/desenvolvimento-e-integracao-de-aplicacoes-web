import { Link } from 'react-router-dom'
import Icone from './Icone'
import './Marca.css'

export default function Marca({ para = '/' }) {
  return (
    <Link to={para} className="marca">
      <span className="marca-icone">
        <Icone nome="roda" tamanho={26} />
      </span>
      Bão de Roda
    </Link>
  )
}
