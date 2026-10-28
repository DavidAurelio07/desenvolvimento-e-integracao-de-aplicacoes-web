import { useAuth } from '../context/useAuth'

export default function Home() {
  const { usuario } = useAuth()

  return (
    <section>
      <h1>Bem-vindo, {usuario?.nome}!</h1>
      <p>Em breve: seus pedidos de aluguel.</p>
    </section>
  )
}
