export default function PokemonCard({ pokemon, onClick }) {
  const id = pokemon.id || pokemon.number || pokemon.numero;
  const name = pokemon.name || pokemon.nome;
  
  // Trata a lista de tipos garantindo que objetos sejam convertidos em nomes/strings
  const rawTypes = pokemon.types || pokemon.tipo || (pokemon.type ? [pokemon.type] : []);
  const types = rawTypes.map(t => {
    if (typeof t === 'string') return t;
    if (t && typeof t === 'object') return t.name || t.nome || t.label || String(t.id || '');
    return String(t);
  }).filter(Boolean);

  const image = pokemon.image || pokemon.imagem || pokemon.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  // Extrai os atributos / status do JSON
  const stats = pokemon.stats || pokemon.atributos || {
    hp: pokemon.hp || 0,
    attack: pokemon.attack || pokemon.ataque || 0,
    defense: pokemon.defense || pokemon.defesa || 0,
    spAttack: pokemon.spAttack || pokemon['special-attack'] || pokemon.ataqueEspecial || 0,
    spDefense: pokemon.spDefense || pokemon['special-defense'] || pokemon.defesaEspecial || 0,
    speed: pokemon.speed || pokemon.velocidade || 0
  };

  return (
    <div 
      onClick={() => onClick && onClick(pokemon)}
      style={{ 
        border: '1px solid #e2e8f0', 
        padding: '1.2rem', 
        borderRadius: '12px', 
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <img 
        src={image} 
        alt={name} 
        style={{ width: '120px', height: '120px', objectFit: 'contain' }} 
        onError={(e) => {
          e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
        }}
      />
      
      <p style={{ color: '#a0aec0', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '0.5rem' }}>
        #{String(id).padStart(3, '0')}
      </p>
      
      <h3 style={{ textTransform: 'capitalize', color: '#2d3748', margin: '0.2rem 0' }}>{name}</h3>
      
      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', margin: '0.6rem 0', flexWrap: 'wrap' }}>
        {types.map((typeStr, idx) => (
          <span 
            key={`${typeStr}-${idx}`} 
            style={{ 
              padding: '0.25rem 0.6rem', 
              borderRadius: '12px', 
              fontSize: '0.75rem',
              fontWeight: '600',
              backgroundColor: '#edf2f7',
              color: '#4a5568'
            }}
          >
            {typeStr}
          </span>
        ))}
      </div>

      {/* Grid compacta de Status para cumprir a exigência da atividade no Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.4rem',
        fontSize: '0.7rem',
        backgroundColor: '#f7fafc',
        padding: '0.6rem',
        borderRadius: '8px',
        textAlign: 'left',
        marginTop: '0.8rem',
        color: '#4a5568'
      }}>
        <div title="HP / Vida">❤️ HP: <strong>{stats.hp}</strong></div>
        <div title="Velocidade">💨 Vel: <strong>{stats.speed}</strong></div>
        <div title="Ataque">⚔️ Atq: <strong>{stats.attack}</strong></div>
        <div title="Defesa">🛡️ Def: <strong>{stats.defense}</strong></div>
        <div title="Ataque Especial">✨ Atq Esp: <strong>{stats.spAttack}</strong></div>
        <div title="Defesa Especial">🛡️ Def Esp: <strong>{stats.spDefense}</strong></div>
      </div>
    </div>
  );
}