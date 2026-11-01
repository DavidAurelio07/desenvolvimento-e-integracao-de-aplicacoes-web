import { useState } from 'react'
import CarroIlustracao from './CarroIlustracao'
import './FotoCarro.css'

// Mostra a foto do automóvel. Sem foto (ou se ela falhar), mostra a ilustração.
export default function FotoCarro({ automovel, className = '' }) {
  const [urlComErro, setUrlComErro] = useState(null)
  const url = automovel.imagemUrl

  if (!url || urlComErro === url) {
    return (
      <div className={`foto-carro foto-carro-ilustracao ${className}`}>
        <CarroIlustracao />
      </div>
    )
  }

  return (
    <img
      className={`foto-carro ${className}`}
      src={url}
      alt={`${automovel.marca} ${automovel.modelo}`}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setUrlComErro(url)}
    />
  )
}
