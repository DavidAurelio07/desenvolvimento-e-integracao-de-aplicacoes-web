// =====================================================================
// ARQUIVO: main.jsx
// PARA QUE SERVE: PONTO DE ENTRADA. É o único arquivo que o index.html
// carrega (<script type="module" src="/src/main.jsx">). Aqui o React
// "pluga" o App na <div id="root"> do index.html.
// [GENÉRICO] Vem pronto do template do Vite. Quase nunca precisa mexer,
// só confira que importa o index.css e o App.
// =====================================================================

// StrictMode: modo de desenvolvimento que ajuda a achar erros (renderiza
// duas vezes em dev; isso é normal e não acontece no build final).
import { StrictMode } from 'react'
// createRoot: API do React 18+ para renderizar no navegador.
import { createRoot } from 'react-dom/client'
// CSS global (cores, fontes, botões). Importado aqui para valer no site todo.
import './index.css'
import App from './App.jsx'

// Pega a <div id="root"> do index.html e renderiza o <App /> dentro dela.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
