import { useState } from "react";
import Header from "./components/Header";
import PokemonList from "./components/PokemonList";
import PokemonDetails from "./components/PokemonDetails";
import TrainersSection from "./components/TrainersSection";
import pokedexDataRaw from "./data/pokedex-data.json";
import trainersDataRaw from "./data/trainers-data.json";

function App() {
  const pokedexData = Array.isArray(pokedexDataRaw)
    ? pokedexDataRaw
    : pokedexDataRaw.pokemon ||
      pokedexDataRaw.pokemons ||
      pokedexDataRaw.data ||
      [];

  const [pokemon] = useState(pokedexData);
  const [trainers] = useState(trainersDataRaw);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const [activeTab, setActiveTab] = useState("pokedex");

  const getTypeString = (t) => {
    if (!t) return "";
    if (typeof t === "string") return t;
    if (typeof t === "object")
      return t.name || t.nome || t.label || String(t.id || "");
    return String(t);
  };

  const allTypes = [
    ...new Set(
      pokedexData.flatMap((p) => {
        const raw = p.types || p.tipo || (p.type ? [p.type] : []);
        const arr = Array.isArray(raw) ? raw : [raw];
        return arr.map(getTypeString);
      }),
    ),
  ].filter(Boolean);

  const filteredPokemon = pokemon.filter((p) => {
    const pName = (p.name || p.nome || "").toLowerCase();
    const pId = (p.id || p.number || p.numero || "").toString();

    const matchesSearch =
      pName.includes(searchTerm.toLowerCase().trim()) ||
      pId === searchTerm.trim();

    const rawTypes = p.types || p.tipo || (p.type ? [p.type] : []);
    const pTypes = (Array.isArray(rawTypes) ? rawTypes : [rawTypes]).map(
      getTypeString,
    );

    const matchesType = selectedType === "" || pTypes.includes(selectedType);

    return matchesSearch && matchesType;
  });

  return (
    <div className="app-container">
      {/* Topo estilo Hardware Pokédex */}
      <div className="pokedex-header">
        <div className="camera-lens"></div>
        <div className="mini-lights">
          <div className="mini-light light-red"></div>
          <div className="mini-light light-yellow"></div>
          <div className="mini-light light-green"></div>
        </div>
      </div>

      {/* Área da Tela (Screen) */}
      <div className="screen-container">
        {/* Controles Acima da Tela */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setActiveTab("pokedex")}
            style={{
              padding: "0.8rem 2rem",
              fontSize: "1rem",
              fontWeight: "bold",
              fontFamily: "var(--font-pixel)",
              textTransform: "uppercase",
              borderRadius: "8px",
              border:
                activeTab === "pokedex"
                  ? "4px solid #1e293b"
                  : "4px solid transparent",
              backgroundColor: activeTab === "pokedex" ? "#94a3b8" : "#cbd5e1",
              color: "#1e293b",
              cursor: "pointer",
              boxShadow: "inset -2px -2px 5px rgba(0,0,0,0.2)",
            }}
          >
            [Pokédex]
          </button>
          <button
            onClick={() => setActiveTab("trainers")}
            style={{
              padding: "0.8rem 2rem",
              fontSize: "1rem",
              fontWeight: "bold",
              fontFamily: "var(--font-pixel)",
              textTransform: "uppercase",
              borderRadius: "8px",
              border:
                activeTab === "trainers"
                  ? "4px solid #1e293b"
                  : "4px solid transparent",
              backgroundColor: activeTab === "trainers" ? "#94a3b8" : "#cbd5e1",
              color: "#1e293b",
              cursor: "pointer",
              boxShadow: "inset -2px -2px 5px rgba(0,0,0,0.2)",
            }}
          >
            [Treinadores]
          </button>
        </div>

        {/* Ecrã Principal onde os cards renderizam */}

        <div className="main-screen">
          {activeTab === "pokedex" ? (
            <>
              <Header
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                availableTypes={allTypes}
                selectedType={selectedType}
                onTypeSelect={setSelectedType}
              />

              <PokemonList
                pokemonData={filteredPokemon}
                onPokemonClick={setSelectedPokemon}
              />
            </>
          ) : (
            <TrainersSection
              trainersData={trainers}
              pokedexData={pokemon}
              onPokemonClick={setSelectedPokemon}
            />
          )}
        </div>

        {/* Detalhes de hardware embaixo da tela */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.5rem",
            padding: "0 1rem",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: "#dc2626",
              border: "2px solid #7f1d1d",
              boxShadow: "inset -2px -2px 5px rgba(0,0,0,0.3)",
            }}
          ></div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div
              style={{
                width: "40px",
                height: "8px",
                backgroundColor: "#475569",
                borderRadius: "4px",
              }}
            ></div>
            <div
              style={{
                width: "40px",
                height: "8px",
                backgroundColor: "#475569",
                borderRadius: "4px",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Modal Sobreposto */}
      {selectedPokemon && (
        <PokemonDetails
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}

export default App;
