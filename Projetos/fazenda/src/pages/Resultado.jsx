// =====================================================================
// ARQUIVO: pages/Resultado.jsx
// PARA QUE SERVE: mostra o total de votos e o placar (posição, barra,
// percentual). Permite desfazer o último voto e zerar a votação.
//
// IDEIA CENTRAL: só UM estado (votos). Todo o resto (total, placar,
// eliminado, diferença) é DERIVADO dele, recalculado a cada renderização.
// Quando setVotos(...) muda o estado, a tela inteira se atualiza sozinha.
// =====================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
// [ESPECÍFICO] Funções do service (nomes exatos do arquivo fornecido).
import {
  obterVotos,
  calcularResultado,
  desfazerUltimoVoto,
  zerarVotos,
} from '../services/votacaoService';

// [GENÉRICO] Função AUXILIAR fora do componente (não usa estado nem props).
// toLocaleString('pt-BR', opções) formata número no padrão brasileiro
// (vírgula decimal). minimumFractionDigits força sempre 1 casa (ex.: 50,0).
// [ESPECÍFICO] Na AV2 do outro formato usava só maximumFractionDigits: 1.
function formatarPercentual(valor) {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
}

function Resultado() {
  // [GENÉRICO] ESTADO INICIAL LENDO DO localStorage com "lazy initializer":
  // passar uma FUNÇÃO () => obterVotos() faz o React ler só na 1ª renderização
  // (e não a cada render). Padrão para qualquer dado persistido.
  const [votos, setVotos] = useState(() => obterVotos());

  // ---------- VALORES DERIVADOS (sem useState!) ----------
  // [ESPECÍFICO] votos é um ARRAY de ids, então o total é o tamanho dele.
  const total = votos.length;
  // Lista ordenada: do mais votado (índice 0) ao menos votado (último).
  const resultado = calcularResultado(votos);
  // [GENÉRICO] Último índice de um array = length - 1.
  const ultimo = resultado.length - 1;
  // [ESPECÍFICO] Como o voto é para FICAR, quem sai é o ÚLTIMO colocado.
  const eliminado = resultado[ultimo];
  const penultimo = resultado[ultimo - 1];
  // Quantos votos faltam para o último alcançar o penúltimo.
  const diferenca = penultimo.votos - eliminado.votos;

  // [GENÉRICO] Função que DECIDE a classe CSS conforme a posição (evita
  // ternário gigante dentro do JSX). Retornos antecipados com "return".
  function classeDoItem(indice) {
    if (indice === ultimo) return 'placar-item placar-eliminado';
    if (indice === 0) return 'placar-item placar-salvo';
    return 'placar-item';
  }

  // [GENÉRICO] DESFAZER: o service salva e DEVOLVE o array atualizado;
  // passamos esse retorno ao setter para a tela re-renderizar.
  function handleDesfazer() {
    setVotos(desfazerUltimoVoto());
  }

  // [GENÉRICO] ZERAR com confirmação — padrão cobrado na AV2:
  //   1) window.confirm devolve true/false
  //   2) apaga no localStorage (service)
  //   3) ATUALIZA O ESTADO (senão a tela não muda!)
  function handleZerar() {
    if (window.confirm('Apagar todos os votos e reiniciar a votação?')) {
      zerarVotos();
      setVotos([]);
    }
  }

  return (
    <main className="pagina">
      <header className="pagina-cabecalho">
        <h1>Parcial: voto para ficar</h1>
        <p className="total-votos">
          {/* [GENÉRICO] toLocaleString('pt-BR') em número inteiro coloca o
              ponto de milhar (1.234). Depois, o singular/plural. */}
          <strong>{total.toLocaleString('pt-BR')}</strong> {total === 1 ? 'voto computado' : 'votos computados'}
        </p>
      </header>

      {/* [GENÉRICO] ESTADO VAZIO: ternário grande
          condição ? (JSX se verdadeiro) : (JSX se falso) */}
      {total === 0 ? (
        <div className="vazio">
          <p>Nenhum voto ainda. Escolha quem você quer salvar para ver a parcial.</p>
          <Link to="/votacao" className="botao botao-principal">Ir para a votação</Link>
        </div>
      ) : (
        // [GENÉRICO] Fragment <>...</>: agrupa vários elementos sem criar div extra.
        <>
          <p className="zona-eliminacao">
            {/* [ESPECÍFICO] Empate (diferença 0) ou quantos votos faltam. Os
                textos usam template strings com ${...} e plural inline. */}
            {diferenca === 0
              ? `Empate na zona de eliminação entre ${penultimo.nome} e ${eliminado.nome}!`
              : `${eliminado.nome} precisa de ${diferenca} ${diferenca === 1 ? 'voto' : 'votos'} para escapar.`}
          </p>

          <ol className="placar">
            {/* [GENÉRICO] map com (item, indice): o 2º argumento é a POSIÇÃO.
                key usa o id (único e estável). */}
            {resultado.map((p, indice) => (
              <li key={p.id} className={classeDoItem(indice)}>
                <span className="placar-posicao">{indice + 1}º</span>
                <img src={p.foto} alt={p.nome} className="placar-foto" />
                <div className="placar-info">
                  <div className="placar-linha">
                    <span className="placar-nome">{p.nome}</span>
                    {/* [GENÉRICO] Selo só no 1º (índice 0) e só no último */}
                    {indice === 0 && <span className="selo-placar selo-salvo">Mais salvo</span>}
                    {indice === ultimo && <span className="selo-placar selo-eliminado">Sairia hoje</span>}
                  </div>

                  {/* [GENÉRICO] BARRA DE PROGRESSO: o container .barra tem
                      overflow hidden; o preenchimento recebe a largura por
                      STYLE INLINE. Em JSX style é um OBJETO ({{ }}: o de fora
                      é o JSX, o de dentro é o objeto) e valores numéricos
                      viram texto com template string `${...}%`. */}
                  <div className="barra">
                    <div className="barra-preenchida" style={{ width: `${p.percentual}%` }} />
                  </div>

                  <span className="placar-numeros">
                    {formatarPercentual(p.percentual)} ({p.votos} {p.votos === 1 ? 'voto' : 'votos'})
                  </span>
                </div>
              </li>
            ))}
          </ol>

          <div className="resultado-acoes">
            {/* [GENÉRICO] onClick recebe a FUNÇÃO (sem parênteses!) */}
            <button type="button" className="botao botao-desfazer" onClick={handleDesfazer}>
              Desfazer último voto
            </button>
            <button type="button" className="botao botao-zerar" onClick={handleZerar}>
              Zerar votação
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default Resultado;
