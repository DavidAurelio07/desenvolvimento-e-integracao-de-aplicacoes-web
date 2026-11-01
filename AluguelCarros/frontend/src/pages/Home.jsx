import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { listarAutomoveis } from '../services/automovelService'
import { listarPedidos } from '../services/pedidoService'
import { primeiroNome } from '../utils/formatadores'
import CarroIlustracao from '../components/CarroIlustracao'
import Icone from '../components/Icone'
import Serra from '../components/Serra'
import './Home.css'

const ATALHOS_CLIENTE = [
  { para: '/pedidos/novo', icone: 'mais', titulo: 'Novo pedido', texto: 'Escolha um carro e as datas do seu aluguel.' },
  { para: '/pedidos', icone: 'lista', titulo: 'Meus pedidos', texto: 'Acompanhe o status de cada pedido.' },
  { para: '/perfil', icone: 'usuario', titulo: 'Meu cadastro', texto: 'Consulte ou altere seus dados e rendimentos.' },
]

const ATALHOS_AGENTE = [
  { para: '/pedidos', icone: 'lista', titulo: 'Analisar pedidos', texto: 'Veja os pedidos de aluguel e registre o parecer financeiro.' },
  { para: '/automoveis', icone: 'carro', titulo: 'Automóveis', texto: 'Cadastre e consulte os carros disponíveis.' },
]

const PASSOS_CLIENTE = [
  { titulo: 'Escolha o carro', texto: 'Veja os automóveis disponíveis e selecione o que combina com você.' },
  { titulo: 'Aguarde a análise', texto: 'Um agente avalia o pedido do ponto de vista financeiro.' },
  { titulo: 'Pegue a estrada', texto: 'Com o parecer positivo, o contrato segue para execução.' },
]

const PASSOS_AGENTE = [
  { titulo: 'Cadastre os automóveis', texto: 'Mantenha a frota atualizada para os clientes escolherem.' },
  { titulo: 'Analise os pedidos', texto: 'Confira os dados e os rendimentos de cada cliente.' },
  { titulo: 'Registre o parecer', texto: 'Aprove ou reprove e deixe uma justificativa.' },
]

export default function Home() {
  const { usuario } = useAuth()
  const ehAgente = usuario?.papel === 'AGENTE'
  const [pedidos, setPedidos] = useState(null)
  const [automoveis, setAutomoveis] = useState(null)

  useEffect(() => {
    listarPedidos().then(setPedidos).catch(() => setPedidos([]))
    if (ehAgente) {
      listarAutomoveis().then(setAutomoveis).catch(() => setAutomoveis([]))
    }
  }, [ehAgente])

  const contar = (status) =>
    pedidos ? pedidos.filter((p) => p.status === status).length : '–'

  const numeros = ehAgente
    ? [
        { icone: 'relogio', valor: contar('EM_ANALISE'), rotulo: 'Aguardando análise' },
        { icone: 'lista', valor: pedidos ? pedidos.length : '–', rotulo: 'Pedidos no total' },
        { icone: 'carro', valor: automoveis ? automoveis.length : '–', rotulo: 'Automóveis cadastrados' },
      ]
    : [
        { icone: 'lista', valor: pedidos ? pedidos.length : '–', rotulo: 'Pedidos feitos' },
        { icone: 'relogio', valor: contar('EM_ANALISE'), rotulo: 'Em análise' },
        { icone: 'escudo', valor: contar('APROVADO'), rotulo: 'Aprovados' },
      ]

  const atalhos = ehAgente ? ATALHOS_AGENTE : ATALHOS_CLIENTE
  const passos = ehAgente ? PASSOS_AGENTE : PASSOS_CLIENTE

  return (
    <div className="pagina">
      <section className="home-hero">
        <span className="home-sol" aria-hidden="true" />
        <Serra className="home-serra" />
        <CarroIlustracao className="home-carro" />

        <div className="home-texto">
          <p className="home-etiqueta">Bão de Roda</p>
          <h1>Olá, {primeiroNome(usuario?.nome)}!</h1>
          <p>
            {ehAgente
              ? 'Acompanhe os pedidos de aluguel e mantenha a frota em dia.'
              : 'Aluguel de carros do jeito mineiro: simples, direto e sem complicação.'}
          </p>
          <div className="home-botoes">
            {ehAgente ? (
              <Link to="/pedidos" className="btn btn-ouro">Analisar pedidos</Link>
            ) : (
              <>
                <Link to="/pedidos/novo" className="btn btn-ouro">Fazer um pedido</Link>
                <Link to="/pedidos" className="btn btn-claro">Meus pedidos</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="home-numeros">
        {numeros.map((n) => (
          <div key={n.rotulo} className="home-numero">
            <span className="home-numero-icone"><Icone nome={n.icone} /></span>
            <div>
              <strong>{n.valor}</strong>
              <span>{n.rotulo}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="home-secao">
        <h2>Atalhos</h2>
        <ul className="home-atalhos">
          {atalhos.map((a) => (
            <li key={a.para}>
              <Link to={a.para} className="home-atalho">
                <span className="home-atalho-icone"><Icone nome={a.icone} /></span>
                <span className="home-atalho-titulo">{a.titulo}</span>
                <span className="home-atalho-texto">{a.texto}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-secao">
        <h2>{ehAgente ? 'Seu fluxo de trabalho' : 'Como funciona'}</h2>
        <ol className="home-passos">
          {passos.map((p) => (
            <li key={p.titulo} className="home-passo">
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
