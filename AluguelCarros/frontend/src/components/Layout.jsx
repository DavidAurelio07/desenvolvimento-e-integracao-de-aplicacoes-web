import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { iniciais } from "../utils/formatadores";
import Marca from "./Marca";
import "./Layout.css";

const LINKS_CLIENTE = [
  { para: "/", rotulo: "Início", exato: true },
  { para: "/pedidos", rotulo: "Meus pedidos", exato: true },
  { para: "/pedidos/novo", rotulo: "Novo pedido" },
  { para: "/perfil", rotulo: "Meu cadastro" },
];

const LINKS_AGENTE = [
  { para: "/", rotulo: "Início", exato: true },
  { para: "/pedidos", rotulo: "Pedidos", exato: true },
  { para: "/automoveis", rotulo: "Automóveis" },
];

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const ehAgente = usuario?.papel === "AGENTE";
  const links = ehAgente ? LINKS_AGENTE : LINKS_CLIENTE;

  function sair() {
    logout();
    navigate("/login");
  }

  return (
    <div className="layout">
      <header className="topo">
        <div className="topo-conteudo">
          <Marca />
          <nav className="topo-nav">
            {links.map((l) => (
              <NavLink key={l.para} to={l.para} end={l.exato}>
                {l.rotulo}
              </NavLink>
            ))}
          </nav>
          <div className="topo-usuario">
            <span className="topo-avatar" aria-hidden="true">
              {iniciais(usuario?.nome)}
            </span>
            <span className="topo-dados">
              <strong>{usuario?.nome}</strong>
              <small>{ehAgente ? "Agente" : "Cliente"}</small>
            </span>
            <button type="button" className="topo-sair" onClick={sair}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>

      <footer className="rodape">
        <div className="rodape-conteudo">
          <div className="rodape-marca">
            <Marca />
            <p>
              Aluguel de carros com o jeito mineiro de ser: simples,
              transparente e sem complicação.
            </p>
          </div>
          <div className="rodape-links">
            <h4>Navegação</h4>
            <ul>
              {links.map((l) => (
                <li key={l.para}>
                  <Link to={l.para}>{l.rotulo}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rodape-base">© 2026 Bão de Roda</div>
      </footer>
    </div>
  );
}
