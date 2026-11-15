// =====================================================================
// LEGENDA (vale para todos os arquivos):
//   [GENÉRICO]   -> padrão que você reaproveita em QUALQUER projeto React
//   [ESPECÍFICO] -> depende da regra/nomes deste projeto: adapte antes de usar
//
// ARQUIVO: services/votacaoService.js
// PARA QUE SERVE: concentra TODA a lógica de dados (listar, salvar no
// localStorage, contar). As páginas só CHAMAM estas funções.
// Isso NÃO é React: é JavaScript puro (por isso não tem import de 'react').
// =====================================================================

// [GENÉRICO] Importa o array de dados. "import X from" = import DEFAULT
// (o arquivo exporta com "export default"). Sem chaves {}.
import participantes from '../data/participantes';

// [GENÉRICO] Constante com a CHAVE do localStorage. Boa prática: guardar a
// chave em uma constante, para não errar o texto em vários lugares.
// [ESPECÍFICO] O nome da chave ('fazenda2026:votos-ficar') é inventado.
const CHAVE_VOTOS = 'fazenda2026:votos-ficar';

// [ESPECÍFICO] Devolve o array inteiro. "export function" = export NOMEADO
// (quem importa usa chaves: import { listarParticipantes } from ...).
export function listarParticipantes() {
  return participantes;
}

// [GENÉRICO] Padrão "filtrar por um campo": .filter() devolve um NOVO array
// só com os itens em que a condição é true. Não altera o original.
// [ESPECÍFICO] O campo 'situacao' e os valores 'roca'/'fazendeiro'/'peao'.
export function listarPorSituacao(situacao) {
  return participantes.filter((p) => p.situacao === situacao);
}

// [GENÉRICO] .find() devolve o PRIMEIRO item que bate (ou undefined).
// O "?? null" (nullish coalescing) troca undefined por null, para a página
// poder testar com "if (fazendeiro)" ou "fazendeiro && ...".
export function obterFazendeiro() {
  return participantes.find((p) => p.situacao === 'fazendeiro') ?? null;
}

// [GENÉRICO] LER do localStorage — receita padrão, decore:
//   1) getItem(chave) devolve TEXTO (string) ou null se não existir.
//   2) JSON.parse transforma o texto de volta em array/objeto.
//   3) try/catch protege contra JSON quebrado (devolve o valor padrão).
// [ESPECÍFICO] Aqui o valor padrão é [] porque os votos são um ARRAY de ids
// (ex.: [9, 12, 9]). Na AV2 do outro formato era {} (objeto {id: qtd}).
export function obterVotos() {
  try {
    const salvo = localStorage.getItem(CHAVE_VOTOS);
    return salvo ? JSON.parse(salvo) : [];
  } catch {
    return [];
  }
}

// [GENÉRICO] SALVAR no localStorage: só aceita TEXTO, então converta com
// JSON.stringify. Função auxiliar sem "export": só este arquivo usa.
function salvarVotos(votos) {
  localStorage.setItem(CHAVE_VOTOS, JSON.stringify(votos));
}

// [ESPECÍFICO] Registra um voto. Padrão geral:
//   validar -> ler -> criar NOVA versão (sem mutar) -> salvar -> devolver.
export function registrarVoto(idParticipante) {
  const participante = participantes.find((p) => p.id === idParticipante);
  // [GENÉRICO] "throw new Error" interrompe a função com um erro.
  if (!participante || participante.situacao !== 'roca') {
    throw new Error('Só é possível votar em participantes que estão na roça.');
  }
  // [GENÉRICO] Spread [...array, novo] cria um array NOVO com o item no fim
  // (em vez de .push, que altera o original). Em React, nunca mutar estado.
  const votos = [...obterVotos(), idParticipante];
  salvarVotos(votos);
  // Devolve o array atualizado para a página poder usar no setVotos(...).
  return votos;
}

// [GENÉRICO] .slice(0, -1) = copia o array SEM o último item.
// ([1,2,3].slice(0, -1) -> [1,2]). Não altera o original.
export function desfazerUltimoVoto() {
  const votos = obterVotos().slice(0, -1);
  salvarVotos(votos);
  return votos;
}

// [GENÉRICO] CONTAR ocorrências com .reduce — padrão MUITO cobrado:
//   reduce((acumulador, item) => novoAcumulador, valorInicial)
// Aqui o acumulador é um objeto {} e cada voto soma 1 na chave do id.
//   (contagem[id] || 0) -> se ainda não existe, começa do 0.
// Entrada [9, 12, 9]  ->  saída { 9: 2, 12: 1 }
export function contarVotos(votos) {
  return votos.reduce((contagem, id) => {
    contagem[id] = (contagem[id] || 0) + 1;
    return contagem;
  }, {});
}

// [ESPECÍFICO] Monta o placar. Padrão geral para "ranking com percentual":
//   1) total = quantidade de votos (aqui = votos.length, porque é array)
//   2) contagem por id
//   3) .map() cria, para cada participante, um objeto NOVO com votos e %
//   4) .sort() ordena do maior para o menor
export function calcularResultado(votos) {
  const total = votos.length;
  const contagem = contarVotos(votos);
  return listarPorSituacao('roca')
    .map((p) => {
      const qtd = contagem[p.id] || 0;
      return {
        // [GENÉRICO] "...p" copia todos os campos do participante (spread de objeto)
        ...p,
        votos: qtd,
        // [GENÉRICO] Cuidado com divisão por zero: se total é 0, percentual = 0.
        percentual: total === 0 ? 0 : (qtd / total) * 100,
      };
    })
    // [GENÉRICO] .sort((a, b) => b.x - a.x) = ordem DECRESCENTE por x.
    // (a.x - b.x seria crescente). Obs.: sort altera o array, mas aqui o
    // array já é novo (veio do map), então não há problema.
    .sort((a, b) => b.votos - a.votos);
}

// [GENÉRICO] removeItem apaga a chave do localStorage.
export function zerarVotos() {
  localStorage.removeItem(CHAVE_VOTOS);
}
