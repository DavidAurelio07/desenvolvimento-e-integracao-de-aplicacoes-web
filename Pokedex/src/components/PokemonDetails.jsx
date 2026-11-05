export default function PokemonDetails({ pokemon, onClose }) {
  if (!pokemon) return null;

  const id = pokemon.id || pokemon.number || pokemon.numero;
  const name = pokemon.name || pokemon.nome;
  const types = pokemon.types || pokemon.tipo || (pokemon.type ? [pokemon.type] : []);
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
    { label: '⚔️ Ataque', value: stats.attack },
    { label: '🛡️ Defesa', value: stats.defense },
    { label: '✨ Atq. Esp.', value: stats.spAttack },
    { label: '🛡️ Def. Esp.', value: stats.spDefense },
    { label: '💨 Velocidade', value: stats.speed }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '450px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            border: 'none',
            background: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ✖
        </button>

        <div style={{ textAlign: 'center' }}>
          <img src={image} alt={name} style={{ width: '160px', height: '160px' }} />
          <h2>{name} #{String(id).padStart(3, '0')}</h2>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '0.5rem 0 1.5rem' }}>
            {types.map((type, idx) => (
              <span key={idx} style={{ padding: '0.3rem 0.8rem', borderRadius: '16px', backgroundColor: '#edf2f7', fontSize: '0.85rem' }}>
                {type}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <h3>Estatísticas / Atributos</h3>
          {statLabels.map(({ label, value }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min(100, (value / 180) * 100)}%`, 
                  height: '100%', 
                  backgroundColor: '#ef5350',
                  borderRadius: '4px' 
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}