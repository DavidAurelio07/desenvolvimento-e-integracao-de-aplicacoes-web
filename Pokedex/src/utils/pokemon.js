// Funções utilitárias compartilhadas pelos componentes.
// O formato dos dados é o de pokedex-data.json:
//   pokemon: { id, name, stats: { hp, attack, ... }, types: [{ id, name }] }

export const STATS = [
  { key: "hp", label: "HP", short: "HP", icon: "❤️" },
  { key: "attack", label: "Attack", short: "ATK", icon: "⚔️" },
  { key: "defense", label: "Defense", short: "DEF", icon: "🛡️" },
  { key: "specialAttack", label: "Sp. Attack", short: "SpA", icon: "✨" },
  { key: "specialDefense", label: "Sp. Defense", short: "SpD", icon: "🔰" },
  { key: "speed", label: "Speed", short: "SPD", icon: "💨" },
];

// Valor usado como "100%" nas barras de atributos.
export const MAX_STAT = 160;

export const SORT_OPTIONS = [
  { value: "id", label: "ID" },
  { value: "name", label: "Nome" },
  ...STATS.map(({ key, label }) => ({ value: key, label })),
];

export const getTypeNames = (pokemon) =>
  (pokemon.types ?? []).map((type) => type.name);

export const typeClass = (typeName) => `type-${typeName.toLowerCase()}`;

export const formatId = (id) => `#${String(id).padStart(3, "0")}`;

export const getTotal = (pokemon) =>
  STATS.reduce((sum, { key }) => sum + (pokemon.stats[key] ?? 0), 0);

// Barra vermelha (fraco) -> verde (forte)
export const statColor = (value) =>
  `hsl(${Math.round((Math.min(value, MAX_STAT) / MAX_STAT) * 120)}, 70%, var(--stat-lightness))`;

export const statWidth = (value) =>
  `${Math.min(100, (value / MAX_STAT) * 100)}%`;

// Imagens: repositório público de sprites da PokéAPI (documentado no README).
const SPRITES_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export const getImage = (pokemon) =>
  `${SPRITES_URL}/other/official-artwork/${pokemon.id}.png`;

export const getFallbackImage = (pokemon) => `${SPRITES_URL}/${pokemon.id}.png`;

// Tenta a imagem alternativa uma única vez (evita loop de erro).
export function handleImageError(event, pokemon) {
  const img = event.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = "true";
  img.src = getFallbackImage(pokemon);
}

// Retorna uma NOVA lista ordenada (sort muta o array, por isso a cópia).
export function sortPokemon(list, sortKey, direction) {
  const factor = direction === "asc" ? 1 : -1;

  const valueOf = (pokemon) => {
    if (sortKey === "id") return pokemon.id;
    if (sortKey === "name") return pokemon.name;
    return pokemon.stats[sortKey];
  };

  return [...list].sort((a, b) => {
    const va = valueOf(a);
    const vb = valueOf(b);
    const result =
      typeof va === "string" ? va.localeCompare(vb) : va - vb;
    return result * factor || a.id - b.id;
  });
}
