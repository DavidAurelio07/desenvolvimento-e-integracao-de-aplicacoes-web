import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./css/Controls.css";
import "./css/DeviceFrame.css";
import CompareBar from "./components/CompareBar";
import ComparisonModal from "./components/ComparisonModal";
import Header from "./components/Header";
import PokemonDetails from "./components/PokemonDetails";
import PokemonList from "./components/PokemonList";
import TrainersSection from "./components/TrainersSection";
import useLocalStorage from "./hooks/useLocalStorage";
import useDeviceScreen from "./hooks/useDeviceScreen";
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
    const { deviceRef, screenRef } = useDeviceScreen();
    const [activeTab, setActiveTab] = useState("pokedex");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [sortKey, setSortKey] = useState("id");
    const [sortDirection, setSortDirection] = useState("asc");
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [compareIds, setCompareIds] = useState([]);
    const [isComparing, setIsComparing] = useState(false);

    const listScroll = useRef(0);
    const listFocus = useRef(null);

    function openPokemon(pokemon) {
        listScroll.current = screenRef.current.querySelector('.screen-content').scrollTop;
        listFocus.current = `Ver detalhes de ${pokemon.name}`;
        setSelectedPokemon(pokemon);
    }

    useLayoutEffect(() => {
        const content = screenRef.current.querySelector('.screen-content');
        content.scrollTop = selectedPokemon || isComparing ? 0 : listScroll.current;
        if (!selectedPokemon && !isComparing && listFocus.current) {
            const card = [...content.querySelectorAll('.pokemon-card')].find(
                (item) => item.getAttribute('aria-label') === listFocus.current,
            );
            card?.focus({ preventScroll: true });
        }
    }, [selectedPokemon, isComparing, screenRef]);

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
                selectedType === "" ||
                getTypeNames(pokemon).includes(selectedType);

            const matchesFavorite =
                !onlyFavorites || favorites.includes(pokemon.id);

            return matchesSearch && matchesType && matchesFavorite;
        });

        return sortPokemon(filtered, sortKey, sortDirection);
    }, [
        searchTerm,
        selectedType,
        onlyFavorites,
        favorites,
        sortKey,
        sortDirection,
    ]);

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
        openPokemon(allPokemon[index]);
    };

    const comparedPokemon = compareIds.map((id) => pokemonById.get(id));

    const cardProps = {
        favorites,
        compareIds,
        onPokemonClick: openPokemon,
        onToggleFavorite: toggleFavorite,
        onToggleCompare: toggleCompare,
    };

    const noFavorites = onlyFavorites && favorites.length === 0;

    return (
        <div className="app-container pokedex-device" ref={deviceRef}>
            <div className="device-frame">
                <div className="device-artwork">
                    <img
                        src="/images/pokedex-frame.svg"
                        alt=""
                        draggable="false"
                    />
                    <div className="device-lights" aria-hidden="true">
                        <span className="device-light device-light-green light-upper" />
                        <span className="device-light device-light-green light-lower" />
                        <span className="device-light device-light-blue" />
                    </div>
                    <div
                        className="tabs device-tabs"
                        role="tablist"
                        aria-label="Seções da Pokédex"
                    >
                        <button
                            type="button"
                            role="tab"
                            id="pokedex-tab"
                            aria-controls="device-screen"
                            aria-label="Pokédex"
                            title="Pokédex"
                            aria-selected={activeTab === "pokedex"}
                            className={`tab-btn ${activeTab === "pokedex" ? "active" : ""}`}
                            onClick={() => { setIsComparing(false); setSelectedPokemon(null); setActiveTab("pokedex"); }}
                        >
                            <span
                                className="tab-short-label"
                                aria-hidden="true"
                            >
                                PKDX
                            </span>
                            <span className="tab-full-label" aria-hidden="true">
                                Pokédex
                            </span>
                        </button>
                        <button
                            type="button"
                            role="tab"
                            id="trainers-tab"
                            aria-controls="device-screen"
                            aria-label="Treinadores"
                            title="Treinadores"
                            aria-selected={activeTab === "trainers"}
                            className={`tab-btn ${activeTab === "trainers" ? "active" : ""}`}
                            onClick={() => { setIsComparing(false); setSelectedPokemon(null); setActiveTab("trainers"); }}
                        >
                            <span
                                className="tab-short-label"
                                aria-hidden="true"
                            >
                                TIME
                            </span>
                            <span className="tab-full-label" aria-hidden="true">
                                Treinadores
                            </span>
                        </button>
                    </div>
                </div>

                {createPortal(
                    <div
                        ref={screenRef}
                        className="main-screen device-main-screen"
                        id="device-screen"
                        role="tabpanel"
                        aria-labelledby={
                            activeTab === "pokedex"
                                ? "pokedex-tab"
                                : "trainers-tab"
                        }
                        tabIndex={0}
                    >
                        <div
                            className="screen-content"
                            tabIndex={0}
                            role="region"
                            aria-label="Conteúdo da Pokédex"
                        >
                            <div className="screen-theme-control">
                                <button
                                    type="button"
                                    className="theme-toggle"
                                    onClick={() =>
                                        setTheme(
                                            theme === "dark" ? "light" : "dark",
                                        )
                                    }
                                    aria-label={
                                        theme === "dark"
                                            ? "Ativar tema claro"
                                            : "Ativar tema escuro"
                                    }
                                >
                                    {theme === "dark"
                                        ? "☀️ Claro"
                                        : "🌙 Escuro"}
                                </button>
                            </div>
                            {isComparing && comparedPokemon.length === 2 ? (
                                <ComparisonModal
                                    a={comparedPokemon[0]}
                                    b={comparedPokemon[1]}
                                    onClose={() => setIsComparing(false)}
                                />
                            ) : selectedPokemon ? (
<PokemonDetails
                    key={selectedPokemon.id}
                    pokemon={selectedPokemon}
                    isFavorite={favorites.includes(selectedPokemon.id)}
                    onToggleFavorite={toggleFavorite}
                    onClose={() => setSelectedPokemon(null)}
                />
                            ) : activeTab === "pokedex" ? (
                                <>
                                    <Header
                                        searchTerm={searchTerm}
                                        onSearchChange={setSearchTerm}
                                        availableTypes={availableTypes}
                                        selectedType={selectedType}
                                        onTypeSelect={setSelectedType}
                                        toolbarProps={{
                                            sortKey,
                                            onSortKeyChange:
                                                handleSortKeyChange,
                                            sortDirection,
                                            onToggleDirection: () =>
                                                setSortDirection((d) =>
                                                    d === "asc"
                                                        ? "desc"
                                                        : "asc",
                                                ),
                                            onlyFavorites,
                                            onToggleOnlyFavorites: () =>
                                                setOnlyFavorites((v) => !v),
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
                        {!isComparing && !selectedPokemon && (
                            <CompareBar
                                selected={comparedPokemon}
                                onRemove={toggleCompare}
                                onCompare={() => {
                                    listScroll.current = screenRef.current.querySelector('.screen-content').scrollTop;
                                    listFocus.current = null;
                                    setIsComparing(true);
                                }}
                                onClear={() => setCompareIds([])}
                            />
                        )}
                    </div>,
                    document.body,
                )}
            </div>


        </div>
    );
}

export default App;
