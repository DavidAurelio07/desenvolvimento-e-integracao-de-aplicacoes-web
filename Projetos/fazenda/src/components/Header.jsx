// =====================================================================
// ARQUIVO: components/Header.jsx  (vem PRONTO na prova)
// PARA QUE SERVE: cabeçalho com logo e menu, mostrado em todas as páginas
// (porque o App.jsx o coloca fora do <Routes>).
// =====================================================================

// [GENÉRICO] NavLink = Link especial: sabe se é a rota ATUAL e ganha
// automaticamente a classe "active" (útil para destacar o item do menu).
// Só funciona DENTRO do BrowserRouter.
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="topo">
      {/* [GENÉRICO] "to" = destino. Arquivos da pasta public são servidos na
          raiz, por isso o src começa com "/" (/logo-fazenda.jpg). */}
      <NavLink to="/" className="topo-marca">
        <img src="/logo-fazenda.jpg" alt="A Fazenda" className="topo-logo" />
        <span className="topo-titulo">Votação 2026</span>
      </NavLink>

      <nav className="topo-menu">
        {/* [GENÉRICO] "end" faz o link "/" só ficar ativo na Home exata.
            Sem "end", "/" estaria "ativo" em TODAS as rotas (todas começam com /). */}
        <NavLink to="/" end>Início</NavLink>
        <NavLink to="/votacao">Votar</NavLink>
        <NavLink to="/resultado">Resultado</NavLink>
      </nav>
    </header>
  );
}

export default Header;
