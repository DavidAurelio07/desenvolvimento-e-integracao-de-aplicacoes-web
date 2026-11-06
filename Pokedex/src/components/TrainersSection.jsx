import React from "react";
import PokemonCard from "./PokemonCard";

export default function TrainersSection({
  trainersData,
  pokedexData,
  onPokemonClick,
}) {
  if (!trainersData || trainersData.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Nenhum treinador encontrado.
      </p>
    );
  }

  // Helper para buscar os dados completos do Pokemon pelo ID
  const getPokemonById = (id) => {
    return pokedexData.find((p) => {
      const pId = p.id || p.number || p.numero;
      return String(pId) === String(id);
    });
  };

  return (
    <div
      style={{
        marginTop: "3rem",
        borderTop: "2px solid #e2e8f0",
        paddingTop: "2rem",
      }}
    >
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "#2d3748",
          marginBottom: "2rem",
        }}
      >
        Área dos Treinadores
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {trainersData.map((trainer) => {
          // Mapeia os IDs dos pokemons do treinador para os objetos reais
          const trainerPokemons = (trainer.pokemonIds || [])
            .map(getPokemonById)
            .filter(Boolean);

          return (
            <div
              key={trainer.id}
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "1rem",
                }}
              >
                <h3 style={{ fontSize: "1.5rem", color: "#1e293b", margin: 0 }}>
                  {trainer.name}
                </h3>
                <div
                  style={{
                    backgroundColor: "#fef3c7",
                    color: "#b45309",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span>🏅</span> {trainer.badges}{" "}
                  {trainer.badges === 1 ? "Insígnia" : "Insígnias"}
                </div>
              </div>

              {trainerPokemons.length > 0 ? (
                <div>
                  <h4 style={{ color: "#64748b", marginBottom: "1rem" }}>
                    Pokémon na Equipe:
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: "1rem",
                    }}
                  >
                    {trainerPokemons.map((pokemon) => (
                      <PokemonCard
                        key={
                          (pokemon.id || pokemon.number || pokemon.numero) +
                          "-" +
                          trainer.id
                        }
                        pokemon={pokemon}
                        onClick={onPokemonClick}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ color: "#94a3b8" }}>
                  Este treinador ainda não tem Pokémon registrados.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
