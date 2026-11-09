# 🎮 Pokédex React

Pokédex interativa feita com **React + Vite** para a Atividade 03 (desenvolvimento em dupla, Pair Programming).

## ✨ Funcionalidades

**Requisitos da atividade**

- Lista dos 151 Pokémon com número, nome, tipos e os 6 atributos (HP, Attack, Defense, Sp. Attack, Sp. Defense, Speed)
- Pesquisa por **nome** ou **ID** (aceita `25` ou `#25`), atualizada enquanto o usuário digita
- Filtro por **tipo** (lido do `pokedex-data.json`)
- Modal de **detalhes** com todos os atributos em barras coloridas e total
- Área de **Treinadores**: nome, insígnias e time de cada um (clicar em um Pokémon abre os detalhes)
- Mensagem quando nenhum Pokémon é encontrado
- Layout responsivo (desktop, tablet e celular) com visual de Pokédex física

**Desafios opcionais implementados**

- ⭐ **Favoritos** (salvos no `localStorage`) e filtro "só favoritos"
- ⚔️ **Comparação** de dois Pokémon, com destaque para o melhor atributo
- 📊 **Ordenação** por ID, Nome, HP, Attack, Defense, Sp. Attack, Sp. Defense e Speed (crescente/decrescente)
- 🎲 **Pokémon aleatório**
- 🌙 **Tema escuro** (salvo no `localStorage`)
- 🌐 **API externa**: o modal busca altura, peso e habilidades na PokéAPI (se estiver fora do ar, o app continua funcionando)
- 📱 Responsividade para desktop, tablet e smartphone

## ▶️ Como executar

Pré-requisito: [Node.js](https://nodejs.org/) 18 ou superior.

```bash
npm install
npm run dev
```

Abra no navegador: **http://localhost:5173**

Outros comandos:

```bash
npm run build     # gera a versão de produção em dist/
npm run preview   # serve a versão de produção
npm run lint      # verifica o código com oxlint
```

## 📚 Dados

Os dados ficam em `src/data/pokedex-data.json` (tipos, Pokémon e treinadores) e são importados diretamente pela aplicação. Não há banco de dados.

> Observações sobre os dados: o Mew (#151) não possui tipos cadastrados, por isso aparece na lista geral mas em nenhum filtro de tipo. Alguns treinadores têm o mesmo Pokémon repetido (ex.: Koga); a interface mostra cada Pokémon uma vez.

## 🖼️ Imagens

As imagens dos Pokémon vêm do repositório público de sprites da **PokéAPI**, usando o ID de cada Pokémon:

- `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png` (principal)
- `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png` (alternativa)

Além das imagens, o modal de detalhes consulta `https://pokeapi.co/api/v2/pokemon/{id}` para exibir altura, peso e habilidades.

Fonte: [PokéAPI](https://pokeapi.co/). Atributos, tipos e treinadores vêm apenas do arquivo JSON local.

## 🗂️ Estrutura do projeto

```text
src/
├── components/
│   ├── Header.jsx           # título, busca, filtros e barra de ferramentas
│   ├── SearchBar.jsx        # campo de pesquisa
│   ├── Filters.jsx          # botões de filtro por tipo
│   ├── Toolbar.jsx          # ordenação, favoritos e aleatório
│   ├── PokemonList.jsx      # grade de cards + estado "nada encontrado"
│   ├── PokemonCard.jsx      # card (atributos, favoritar, comparar)
│   ├── PokemonDetails.jsx   # modal de detalhes (+ PokéAPI)
│   ├── ComparisonModal.jsx  # comparação entre dois Pokémon
│   ├── CompareBar.jsx       # barra com os Pokémon escolhidos para comparar
│   ├── TrainersSection.jsx  # treinadores e seus times
│   ├── StatBar.jsx          # barra de um atributo
│   └── TypeBadge.jsx        # etiqueta de tipo
├── hooks/
│   ├── useEscapeKey.js      # fecha modais com Esc
│   └── useLocalStorage.js   # useState que persiste no navegador
├── utils/pokemon.js         # atributos, ordenação, imagens e formatações
├── css/                     # Card.css, Controls.css, Details.css
├── data/pokedex-data.json   # tipos, Pokémon e treinadores
├── App.jsx                  # estados e filtragem/ordenação
├── index.css                # estilos globais e tipos
└── main.jsx
```

## 🧠 Conceitos de React usados

Componentes funcionais, props, `useState`, `useEffect` (Esc, PokéAPI, tema), `useMemo`, hooks personalizados, eventos, renderização de listas com `map()`, filtragem e ordenação e estados derivados (a lista exibida é calculada a partir de busca + tipo + favoritos + ordenação).

## Desenvolvido por:

- David Aurélio Pedosa — [GitHub](https://github.com/DavidAurelio07)
- Davi Emanuel Moreira Sollar — [GitHub](https://github.com/HyperSonic3608)
