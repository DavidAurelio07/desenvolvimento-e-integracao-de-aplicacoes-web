import { useEffect, useMemo, useState } from "react";
import "./css/Controls.css";
import CompareBar from "./components/CompareBar";
import ComparisonModal from "./components/ComparisonModal";
import Header from "./components/Header";
import PokemonDetails from "./components/PokemonDetails";
import PokemonList from "./components/PokemonList";
import TrainersSection from "./components/TrainersSection";
import useLocalStorage from "./hooks/useLocalStorage";
import pokedexData from "./data/pokedex-data.json";
import { getTypeNames, sortPokemon } from "./utils/pokemon";

const { pokemon: allPokemon, trainers } = pokedexData;

const pokemonById = new Map(allPokemon.map((p) => [p.id, p]));

// Tipos que realmente aparecem nos Pokémon, na ordem em que estão no JSON.
const usedTypes = new Set(allPokemon.flatMap(getTypeNames));
const availableTypes = pokedexData.types
  .map((type) => type.name)
  .filter((name) => usedTypes.has(name));

function App() {
  const [activeTab, setActiveTab] = useState("pokedex");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  // Estados que ficam salvos no navegador
  const [favorites, setFavorites] = useLocalStorage("pokedex-favorites", []);
  const [savedTheme, setTheme] = useLocalStorage("pokedex-theme", "light");
  const theme = savedTheme === "dark" ? "dark" : "light";

  // Aplica o tema no <html> (o CSS usa [data-theme="dark"])
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Estado derivado: a lista exibida é calculada a partir dos filtros.
  const visiblePokemon = useMemo(() => {
    const term = searchTerm.trim().toLowerCase().replace(/^#/, "");

    const filtered = allPokemon.filter((pokemon) => {
      const matchesSearch =
        term === "" ||
        pokemon.name.toLowerCase().includes(term) ||
        (/^\d+$/.test(term) && pokemon.id === Number(term));

      const matchesType =
        selectedType === "" || getTypeNames(pokemon).includes(selectedType);

      const matchesFavorite = !onlyFavorites || favorites.includes(pokemon.id);

      return matchesSearch && matchesType && matchesFavorite;
    });

    return sortPokemon(filtered, sortKey, sortDirection);
  }, [searchTerm, selectedType, onlyFavorites, favorites, sortKey, sortDirection]);

  const toggleFavorite = (id) =>
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    );

  // Máximo de 2 na comparação: ao escolher um terceiro, o mais antigo sai.
  const toggleCompare = (id) =>
    setCompareIds((current) =>
      current.includes(id)
        ? current.filter((compareId) => compareId !== id)
        : [...current.slice(-1), id],
    );

  const handleSortKeyChange = (key) => {
    setSortKey(key);
    // nome e ID começam crescentes; atributos começam do maior para o menor
    setSortDirection(key === "id" || key === "name" ? "asc" : "desc");
  };

  const openRandomPokemon = () => {
    const index = Math.floor(Math.random() * allPokemon.length);
    setSelectedPokemon(allPokemon[index]);
  };

  const comparedPokemon = compareIds.map((id) => pokemonById.get(id));

  const cardProps = {
    favorites,
    compareIds,
    onPokemonClick: setSelectedPokemon,
    onToggleFavorite: toggleFavorite,
    onToggleCompare: toggleCompare,
  };

  const noFavorites = onlyFavorites && favorites.length === 0;

  return (
    <div className="app-container">
      <div className="pokedex-header">
        <div className="camera-lens"></div>
        <div className="mini-lights">
          <div className="mini-light light-red"></div>
          <div className="mini-light light-yellow"></div>
          <div className="mini-light light-green"></div>
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={
            theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
          }
        >
          {theme === "dark" ? "☀️ Claro" : "🌙 Escuro"}
        </button>
      </div>

      <div className="screen-container">
        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "pokedex"}
            className={`tab-btn ${activeTab === "pokedex" ? "active" : ""}`}
            onClick={() => setActiveTab("pokedex")}
          >
            [Pokédex]
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "trainers"}
            className={`tab-btn ${activeTab === "trainers" ? "active" : ""}`}
            onClick={() => setActiveTab("trainers")}
          >
            [Treinadores]
          </button>
        </div>

        <div className="main-screen">
          {activeTab === "pokedex" ? (
            <>
              <Header
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                availableTypes={availableTypes}
                selectedType={selectedType}
                onTypeSelect={setSelectedType}
                toolbarProps={{
                  sortKey,
                  onSortKeyChange: handleSortKeyChange,
                  sortDirection,
                  onToggleDirection: () =>
                    setSortDirection((d) => (d === "asc" ? "desc" : "asc")),
                  onlyFavorites,
                  onToggleOnlyFavorites: () => setOnlyFavorites((v) => !v),
                  favoritesCount: favorites.length,
                  onRandom: openRandomPokemon,
                  resultCount: visiblePokemon.length,
                }}
              />

              <PokemonList
                pokemonData={visiblePokemon}
                emptyTitle={
                  noFavorites
                    ? "Nenhum favorito ainda"
                    : "Nenhum Pokémon encontrado"
                }
                emptyText={
                  noFavorites
                    ? "Clique na estrela de um Pokémon para favoritá-lo."
                    : "Tente alterar a pesquisa ou os filtros."
                }
                {...cardProps}
              />
            </>
          ) : (
            <TrainersSection
              trainersData={trainers}
              pokedexData={allPokemon}
              {...cardProps}
            />
          )}
        </div>

        <div className="device-footer" aria-hidden="true">
          <div className="device-button"></div>
          <div className="device-speakers">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <CompareBar
        selected={comparedPokemon}
        onRemove={toggleCompare}
        onCompare={() => setIsComparing(true)}
        onClear={() => setCompareIds([])}
      />

      {selectedPokemon && (
        <PokemonDetails
          key={selectedPokemon.id}
          pokemon={selectedPokemon}
          isFavorite={favorites.includes(selectedPokemon.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedPokemon(null)}
        />
      )}

      {isComparing && comparedPokemon.length === 2 && (
        <ComparisonModal
          a={comparedPokemon[0]}
          b={comparedPokemon[1]}
          onClose={() => setIsComparing(false)}
        />
      )}
    </div>
  );
}

export default App;
