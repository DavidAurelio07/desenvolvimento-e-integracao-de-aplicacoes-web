export default function PokemonDetails({ pokemon, onClose }) {
  if (!pokemon) return null;

  const id = pokemon.id || pokemon.number || pokemon.numero;
  const name = pokemon.name || pokemon.nome;
  
  // Trata a lista de tipos garantindo que objetos sejam convertidos em nomes/strings
  const rawTypes = pokemon.types || pokemon.tipo || (pokemon.type ? [pokemon.type] : []);
  const types = rawTypes.map(t => {
    if (typeof t === 'string') return t;
    if (t && typeof t === 'object') return t.name || t.nome || t.label || String(t.id || '');
    return String(t);
  }).filter(Boolean);

  const stats = pokemon.stats || pokemon.atributos || {
    hp: pokemon.hp || 0,
    attack: pokemon.attack || pokemon.ataque || 0,
    defense: pokemon.defense || pokemon.defesa || 0,
    spAttack: pokemon.spAttack || pokemon['special-attack'] || pokemon.ataqueEspecial || 0,
    spDefense: pokemon.spDefense || pokemon['special-defense'] || pokemon.defesaEspecial || 0,
    speed: pokemon.speed || pokemon.velocidade || 0
  };

  const image = pokemon.image || pokemon.imagem || pokemon.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  const statLabels = [
    { label: '❤️ HP', value: stats.hp },
    { label: '⚔️ Attack', value: stats.attack },
    { label: '🛡️ Defense', value: stats.defense },
    { label: '✨ Special Attack', value: stats.spAttack },
    { label: '🛡️ Special Defense', value: stats.spDefense },
    { label: '💨 Speed', value: stats.speed }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div 
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}
        onClick={e => e.stopPropagation()} // Evita fechar ao clicar dentro do modal
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            border: 'none',
            background: '#f1f5f9',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          ✖
        </button>

        <div style={{ textAlign: 'center' }}>
          <img 
            src={image} 
            alt={name} 
            style={{ width: '180px', height: '180px', objectFit: 'contain' }} 
            onError={(e) => {
              e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
            }}
          />
          <h2 style={{ fontSize: '2rem', textTransform: 'capitalize', color: '#1e293b', margin: '0.5rem 0' }}>
            {name} <span style={{ color: '#94a3b8', fontSize: '1.2rem' }}>#{String(id).padStart(3, '0')}</span>
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '0.5rem 0 1.5rem' }}>
            {types.map((type, idx) => (
              <span key={idx} style={{ 
                padding: '0.4rem 1rem', 
                borderRadius: '20px', 
                backgroundColor: '#e2e8f0', 
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#475569'
              }}>
                {type}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ color: '#334155', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>Estatísticas Base</h3>
          
          {/* Implementação das barras de progresso exigidas pelo professor */}
          {statLabels.map(({ label, value }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '0.3rem', color: '#475569', fontWeight: '500' }}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
              <div style={{ height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min(100, (value / 150) * 100)}%`, // Considerando 150 um bom teto visual para stats base
                  height: '100%', 
                  backgroundColor: value > 90 ? '#4ade80' : value > 60 ? '#fbbf24' : '#f87171', // Cores dinâmicas!
                  borderRadius: '5px',
                  transition: 'width 0.5s ease-out'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}