// =====================================================================
// ARQUIVO: components/ParticipanteCard.jsx
// PARA QUE SERVE: um "cartão" reutilizável de UM participante. A mesma
// peça é usada na roça, no fazendeiro e nos demais peões; o que muda é
// o que você passa por props.
// =====================================================================

// [ESPECÍFICO] Objeto de mapeamento: situação -> texto do selo.
// Ficar FORA do componente evita recriar o objeto a cada renderização.
// [GENÉRICO] O padrão "objeto como tabela de consulta" (SELOS[chave]) é mais
// limpo do que vários if/else ou ternários encadeados.
const SELOS = {
  roca: 'Na roça',
  fazendeiro: 'Fazendeiro',
};

// [GENÉRICO] COMPONENTE = função com nome em MAIÚSCULA que devolve JSX.
// Props recebidas em UM objeto, DESESTRUTURADO na assinatura { ... }.
//   - "selecionado = false"  -> valor PADRÃO quando a prop não é passada
//   - "onSelecionar"         -> prop OPCIONAL (função). Se não vier, é undefined.
function ParticipanteCard({ participante, selecionado = false, onSelecionar }) {
  // [GENÉRICO] Desestruturar o objeto: pega os campos que vai usar.
  const { nome, foto, situacao } = participante;
  // Se a situação não existe em SELOS (ex.: 'peao'), vira undefined = sem selo.
  const selo = SELOS[situacao];

  return (
    // [GENÉRICO] Em JSX é "className" (não "class").
    // Template string `...${expressao}...` monta o texto da classe:
    //   card + card-<situacao> + (card-selecionado SÓ se selecionado for true)
    // ATENÇÃO ao espaço dentro das aspas: ' card-selecionado' começa com espaço.
    // [ESPECÍFICO] As classes card-roca/card-peao/card-fazendeiro existem no CSS.
    <article className={`card card-${situacao}${selecionado ? ' card-selecionado' : ''}`}>
      {/* [GENÉRICO] "&&" = renderização condicional: só mostra o <span> se
          "selo" tiver valor (texto). Se for undefined, não renderiza nada.
          Dica: comentário DENTRO do JSX tem que estar entre chaves (como este). */}
      {selo && <span className={`selo selo-${situacao}`}>{selo}</span>}

      {/* [GENÉRICO] Chaves {} inserem variáveis JS no JSX. alt é obrigatório (acessibilidade). */}
      <img src={foto} alt={nome} className="card-foto" />

      <div className="card-corpo">
        <h3 className="card-nome">{nome}</h3>

        {/* [GENÉRICO] Botão OPCIONAL: só existe se a página passou onSelecionar.
            Assim o MESMO card serve com e sem botão. */}
        {onSelecionar && (
          <button
            type="button"
            className="botao botao-selecionar"
            // [GENÉRICO] aria-pressed: acessibilidade de botão "liga/desliga"
            aria-pressed={selecionado}
            // [GENÉRICO] ERRO CLÁSSICO: onClick={onSelecionar(participante)}
            // EXECUTA na renderização. Correto é uma ARROW FUNCTION que só
            // roda no clique:
            onClick={() => onSelecionar(participante)}
          >
            {/* [GENÉRICO] Ternário dentro do JSX: condição ? seTrue : seFalse */}
            {selecionado ? '✓ Selecionado' : 'Selecionar'}
          </button>
        )}
      </div>
    </article>
  );
}

// [GENÉRICO] export default: quem importa NÃO usa chaves
// (import ParticipanteCard from '../components/ParticipanteCard').
export default ParticipanteCard;
