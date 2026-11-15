// =====================================================================
// ARQUIVO: App.jsx
// PARA QUE SERVE: componente RAIZ. Define o roteamento (qual página aparece
// em qual endereço) e o que aparece em TODAS as páginas (Header e rodapé).
//
// Pré-requisito: npm install react-router-dom
// =====================================================================

// [GENÉRICO] As 4 peças do React Router que você mais usa:
//   BrowserRouter -> "liga" o roteamento (tem que envolver tudo)
//   Routes        -> agrupa as rotas e mostra SÓ a que bate com a URL
//   Route         -> uma rota: path (endereço) + element (o que mostrar)
//   Navigate      -> redireciona para outra rota
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Votacao from './pages/Votacao';
import Resultado from './pages/Resultado';
// [GENÉRICO] CSS global do app: importar o arquivo aqui aplica a todas as páginas.
// (Não esqueça! Foi um aviso explícito da prova.) O index.css é importado no main.jsx.
import './App.css';

function App() {
  return (
    // [GENÉRICO] BrowserRouter por fora de TUDO que usa Link/NavLink/Route.
    // O Header usa NavLink, então precisa estar DENTRO do BrowserRouter.
    <BrowserRouter>
      {/* [GENÉRICO] Header FORA do <Routes> = aparece em todas as páginas */}
      <Header />
      <Routes>
        {/* [GENÉRICO] path + element={<Componente />} (com os < /> !) */}
        <Route path="/" element={<Home />} />
        <Route path="/votacao" element={<Votacao />} />
        <Route path="/resultado" element={<Resultado />} />
        {/* [GENÉRICO] path="*" = "qualquer outro endereço" (rota coringa).
            <Navigate to="/" replace /> manda para a Home; "replace" troca a
            entrada do histórico (o botão voltar não cai de novo no endereço errado). */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* [GENÉRICO] Rodapé fora do Routes também aparece em todas as páginas */}
      <footer className="rodape">DIAW 2026, PUC Minas</footer>
    </BrowserRouter>
  );
}

export default App;
