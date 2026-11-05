export default function Filters({ types, selectedType, onTypeSelect }) {
  // Garante que cada item de tipo seja convertido para string (caso venha como objeto {id, name})
  const getTypeString = (type) => {
    if (!type) return '';
    if (typeof type === 'string') return type;
    if (typeof type === 'object') return type.name || type.nome || type.label || String(type.id || '');
    return String(type);
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
      <button 
        onClick={() => onTypeSelect('')}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          border: '1px solid #ccc',
          backgroundColor: selectedType === '' ? '#ef5350' : '#fff',
          color: selectedType === '' ? '#fff' : '#333',
          cursor: 'pointer',
          fontWeight: selectedType === '' ? 'bold' : 'normal'
        }}
      >
        Todos
      </button>
      {types.map((typeObj, index) => {
        const typeStr = getTypeString(typeObj);
        if (!typeStr) return null;
        const isSelected = selectedType === typeStr;

        return (
          <button 
            key={`${typeStr}-${index}`}
            onClick={() => onTypeSelect(typeStr)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid #ccc',
              backgroundColor: isSelected ? '#ef5350' : '#fff',
              color: isSelected ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: isSelected ? 'bold' : 'normal'
            }}
          >
            {typeStr}
          </button>
        );
      })}
    </div>
  );
}