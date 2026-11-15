Os arquivos em `src/` têm comentários linha a linha. Cada comentário vem marcado:

- **[GENÉRICO]**: padrão que você reaproveita em qualquer projeto React.
- **[ESPECÍFICO]**: depende da regra ou dos nomes deste projeto; adapte.

## Onde achar cada padrão

| Preciso de...                                        | Veja em                                    |
| ---------------------------------------------------- | ------------------------------------------ |
| Criar o projeto e rodar                              | comandos no fim deste arquivo              |
| Entrada do app (index.html → main.jsx → App)         | `main.jsx`                                 |
| Rotas, Header fixo, rota coringa `*`                 | `App.jsx`                                  |
| `NavLink`, `end`, `Link`                             | `Header.jsx`, `Home.jsx`                   |
| Componente com props, valor padrão, prop opcional    | `ParticipanteCard.jsx`                     |
| Classe condicional (template string + ternário)      | `ParticipanteCard.jsx`                     |
| Selo condicional com `&&`                            | `ParticipanteCard.jsx`                     |
| Botão com `onClick={() => fn(x)}`                    | `ParticipanteCard.jsx`                     |
| `useState` com `null` (item selecionado)             | `Votacao.jsx`                              |
| `useState` com `[]` (lista que cresce, sem `push`)   | `Votacao.jsx`                              |
| `map` com `key`                                      | `Votacao.jsx`, `Resultado.jsx`, `Home.jsx` |
| Botão `disabled`                                     | `Votacao.jsx`                              |
| Ternário com fragment `<>...</>`                     | `Votacao.jsx`, `Resultado.jsx`             |
| Singular/plural ("1 voto" / "2 votos")               | `Votacao.jsx`, `Resultado.jsx`             |
| `useState(() => obterVotos())` (ler do localStorage) | `Resultado.jsx`                            |
| Valores derivados do estado (sem outro `useState`)   | `Resultado.jsx`                            |
| `window.confirm` + zerar + atualizar estado          | `Resultado.jsx`                            |
| Estado vazio (ternário + `Link`)                     | `Resultado.jsx`                            |
| Barra com `style={{ width: ... }}`                   | `Resultado.jsx` + `.barra` no CSS          |
| `toLocaleString('pt-BR', ...)`                       | `Resultado.jsx`                            |
| Ler/gravar/apagar localStorage                       | `votacaoService.js`                        |
| `filter`, `find`, `slice`, `reduce`, `sort`, spread  | `votacaoService.js`                        |
| Grid fixo, grid responsivo, `auto-fit`/`auto-fill`   | `App.css`                                  |
| `aspect-ratio` + `object-fit`                        | `App.css`                                  |
| `position: relative/absolute` (selo)                 | `App.css`                                  |
| `position: sticky`                                   | `App.css`                                  |
| `overflow: hidden` + `transition` (barra)            | `App.css`                                  |
| `@media`                                             | fim do `App.css`                           |

## Os 6 padrões que mais caem (decore a forma)

```jsx
// 1) Estado inicial vindo do localStorage
const [votos, setVotos] = useState(() => obterVotos());

// 2) Botão que chama função com argumento
<button onClick={() => onVotar(participante)}>

// 3) Lista
{lista.map((item) => <Card key={item.id} item={item} />)}

// 4) Condicional: "se existir, mostra" e "um ou outro"
{algo && <Selo />}
{condicao ? <A /> : <B />}

// 5) Atualizar lista/objeto de estado SEM mutar
setLista([...lista, novo]);
setObj({ ...obj, campo: valor });

// 6) Largura dinâmica
<div style={{ width: `${percentual}%` }} />
```

## Cuidados de prova

- `onClick={fn(x)}` executa na renderização. Use `onClick={() => fn(x)}`.
- Esqueceu a `key` no `map`: aviso no console.
- Atualizou o localStorage mas não o estado: a tela não muda.
- `Link`/`NavLink` fora do `BrowserRouter`: tela branca.
- `import X from` (default) e `import { X } from` (nomeado) não se misturam. Confira como o arquivo exporta.
- Comentário dentro do JSX: `{/* ... */}`. Comentário em JS: `//`.
- Antes de entregar: `npm run dev` precisa abrir em `http://localhost:5173/` sem erro (projeto que não roda vale no máximo 50%).

## Comandos de setup

```bash
npm create vite@latest NomeDoProjeto -- --template react
cd NomeDoProjeto
npm install
npm install react-router-dom
npm run dev
```

Lembre de copiar `public/`, `data/`, `services/`, `Header.jsx`, `Home.jsx` e `index.css` fornecidos para as mesmas pastas, apagar o `App.css` e a pasta `src/assets` do template, e criar o seu próprio `App.css`.
