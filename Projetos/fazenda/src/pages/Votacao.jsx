// =====================================================================
// ARQUIVO: pages/Votacao.jsx
// PARA QUE SERVE: tela onde o usuário SELECIONA um peão da roça, CONFIRMA
// o voto e vê o histórico dos votos dados nesta sessão.
//
// FLUXO (desenhe no papel!):
//   clicar "Selecionar" -> setSelecionado(p) -> card destacado + botão habilita
//   clicar "Confirmar"  -> handleConfirmar -> service salva no localStorage
//                       -> histórico ganha o nome -> seleção volta a null
// =====================================================================

// [GENÉRICO] useState vem do 'react' (import NOMEADO, com chaves).
import { useState } from 'react';
// [GENÉRICO] Link navega entre rotas SEM recarregar a página (use no lugar de <a>).
import { Link } from 'react-router-dom';
// [GENÉRICO] Componentes/arquivos próprios: caminho relativo (../ sobe uma pasta).
import ParticipanteCard from '../components/ParticipanteCard';
// [ESPECÍFICO] Funções do service. Os nomes têm que ser EXATOS (confira no arquivo).
import {
  listarPorSituacao,
  obterFazendeiro,
  registrarVoto,
} from '../services/votacaoService';

function Votacao() {
  // [GENÉRICO] Dados que NÃO mudam com a interação podem ser variáveis comuns,
  // calculadas a cada renderização (sem useState).
  const naRoca = listarPorSituacao('roca');
  const peoes = listarPorSituacao('peao');
  const fazendeiroDaSemana = obterFazendeiro();

  // [GENÉRICO] ESTADO "item selecionado": começa em null (nada selecionado)
  // e guarda o OBJETO escolhido. Padrão para seleção única.
  const [selecionado, setSelecionado] = useState(null);

  // [GENÉRICO] ESTADO "lista que cresce": começa com [] e guarda só os nomes.
  const [historico, setHistorico] = useState([]);

  // [GENÉRICO] Funções de evento: nome começa com "handle" por convenção.
  function handleConfirmar() {
    // 1) Persiste no localStorage (via service). Não mexe na tela sozinho.
    registrarVoto(selecionado.id);
    // 2) [GENÉRICO] Atualizar array de estado SEM mutar: [...antigo, novo].
    //    NUNCA historico.push(...), porque o React não perceberia a mudança.
    setHistorico([...historico, selecionado.nome]);
    // 3) Limpa a seleção (volta ao estado inicial).
    setSelecionado(null);
  }

  return (
    <main className="pagina">
      <header className="pagina-cabecalho">
        <h1>Quem você quer salvar?</h1>
        <p>Selecione um peão da roça e confirme o voto para ele ficar na fazenda.</p>
      </header>

      <section className="grade-roca">
        {/* [GENÉRICO] LISTA: array.map((item) => <Componente key={item.id} .../>)
            A prop "key" é OBRIGATÓRIA e deve ser única e estável (use o id). */}
        {naRoca.map((p) => (
          <ParticipanteCard
            key={p.id}
            participante={p}
            // [GENÉRICO] "?." (optional chaining): se selecionado for null,
            // devolve undefined em vez de dar erro. Resultado: true/false.
            selecionado={selecionado?.id === p.id}
            // [GENÉRICO] Passa a FUNÇÃO setter direto como callback. O card
            // chama onSelecionar(participante) e isso vira setSelecionado(participante).
            onSelecionar={setSelecionado}
          />
        ))}
      </section>

      <div className="confirmacao">
        <p>
          {/* [GENÉRICO] Ternário com FRAGMENT <>...</>: permite devolver mais de
              um elemento (texto + <strong>) sem criar uma div extra. */}
          {selecionado
            ? <>Seu voto vai para <strong>{selecionado.nome}</strong> ficar.</>
            : 'Nenhum peão selecionado.'}
        </p>
        <button
          type="button"
          className="botao botao-principal"
          // [GENÉRICO] disabled recebe true/false. !selecionado = true quando é null.
          disabled={!selecionado}
          onClick={handleConfirmar}
        >
          Confirmar voto
        </button>
      </div>

      {/* [GENÉRICO] Mostrar a seção só se a lista tiver itens: condição && JSX */}
      {historico.length > 0 && (
        // aria-live: leitores de tela anunciam quando o conteúdo muda (opcional)
        <section className="historico" aria-live="polite">
          <h2>
            {/* [GENÉRICO] SINGULAR/PLURAL: padrão obrigatório em prova!
                quantidade === 1 ? 'voto' : 'votos' */}
            Seus votos nesta sessão: {historico.length} {historico.length === 1 ? 'voto' : 'votos'}
          </h2>
          <ol className="historico-lista">
            {/* [GENÉRICO] Quando os itens são só texto e podem repetir, não há id:
                usar o ÍNDICE como key (indice). Evite se a lista puder reordenar. */}
            {historico.map((nome, indice) => (
              <li key={indice}>{nome}</li>
            ))}
          </ol>
          {/* [GENÉRICO] Link interno para outra rota */}
          <Link to="/resultado">Ver parcial</Link>
        </section>
      )}

      {/* [GENÉRICO] fazendeiroDaSemana pode ser null -> só renderiza se existir */}
      {fazendeiroDaSemana && (
        <section className="demais">
          <h2>Fazendeiro da semana</h2>
          <p className="demais-legenda">Está imune e não pode receber votos.</p>
          <div className="grade-participantes">
            {/* [GENÉRICO] REUTILIZAÇÃO: o MESMO card, sem passar onSelecionar,
                aparece sem botão. */}
            <ParticipanteCard participante={fazendeiroDaSemana} />
          </div>
        </section>
      )}

      <section className="demais">
        <h2>Demais peões</h2>
        <p className="demais-legenda">Fora da roça nesta semana, não podem receber votos.</p>
        <div className="grade-participantes">
          {peoes.map((p) => (
            <ParticipanteCard key={p.id} participante={p} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Votacao;
