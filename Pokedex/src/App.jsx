import { useState } from "react";
import Header from "./components/Header";
import PokemonList from "./components/PokemonList";
import PokemonDetails from "./components/PokemonDetails";
import pokedexDataRaw from "./data/pokedex-data.json";
import "./index.css";

function App() {
  const pokedexData = Array.isArray(pokedexDataRaw)
    ? pokedexDataRaw
    : pokedexDataRaw.pokemon ||
      pokedexDataRaw.pokemons ||
      pokedexDataRaw.data ||
      [];

  const [pokemon] = useState(pokedexData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Função auxiliar para extrair o nome do tipo mesmo que seja um objeto { id, name }
  const getTypeString = (t) => {
    if (!t) return "";
    if (typeof t === "string") return t;
    if (typeof t === "object")
      return t.name || t.nome || t.label || String(t.id || "");
    return String(t);
  };

  // Extrair todos os tipos únicos convertidos para string
  const allTypes = [
    ...new Set(
      pokedexData.flatMap((p) => {
        const raw = p.types || p.tipo || (p.type ? [p.type] : []);
        const arr = Array.isArray(raw) ? raw : [raw];
        return arr.map(getTypeString);
      }),
    ),
  ].filter(Boolean);

  // Filtragem dinâmica por nome ou ID e por Tipo
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
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        availableTypes={allTypes}
        selectedType={selectedType}
        onTypeSelect={setSelectedType}
      />

      <main>
        <PokemonList
          pokemonData={filteredPokemon}
          onPokemonClick={setSelectedPokemon}
        />
      </main>

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
