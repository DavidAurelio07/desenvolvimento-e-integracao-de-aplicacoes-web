package com.example.AluguelCarros.service;

import com.example.AluguelCarros.dto.AutomovelResponse;
import com.example.AluguelCarros.dto.AvaliacaoRequest;
import com.example.AluguelCarros.dto.PedidoRequest;
import com.example.AluguelCarros.dto.PedidoResponse;
import com.example.AluguelCarros.exception.RecursoNaoEncontradoException;
import com.example.AluguelCarros.exception.RegraDeNegocioException;
import com.example.AluguelCarros.model.Agente;
import com.example.AluguelCarros.model.Automovel;
import com.example.AluguelCarros.model.Avaliacao;
import com.example.AluguelCarros.model.Cliente;
import com.example.AluguelCarros.model.ParecerFinanceiro;
import com.example.AluguelCarros.model.PedidoAluguel;
import com.example.AluguelCarros.model.StatusPedido;
import com.example.AluguelCarros.repository.AgenteRepository;
import com.example.AluguelCarros.repository.AutomovelRepository;
import com.example.AluguelCarros.repository.ClienteRepository;
import com.example.AluguelCarros.repository.PedidoAluguelRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PedidoService {

    private final PedidoAluguelRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final AutomovelRepository automovelRepository;

    public PedidoService(PedidoAluguelRepository pedidoRepository,
                         ClienteRepository clienteRepository,
                         AgenteRepository agenteRepository,
                         AutomovelRepository automovelRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.agenteRepository = agenteRepository;
        this.automovelRepository = automovelRepository;
    }

    @Transactional
    public PedidoResponse criar(String loginCliente, PedidoRequest request) {
        Cliente cliente = clienteRepository.findByLogin(loginCliente)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado."));
        Automovel automovel = buscarAutomovel(request.automovelId());
        validarPeriodo(request.dataInicio(), request.dataFim());

        PedidoAluguel pedido = new PedidoAluguel();
        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);
        pedido.setDataPedido(LocalDate.now());
        pedido.setDataInicio(request.dataInicio());
        pedido.setDataFim(request.dataFim());
        pedido.setStatus(StatusPedido.EM_ANALISE);

        return converter(pedidoRepository.save(pedido));
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listar(String login, boolean agente) {
        List<PedidoAluguel> pedidos = agente
                ? pedidoRepository.findAllByOrderByIdDesc()
                : pedidoRepository.findByClienteLoginOrderByIdDesc(login);
        return pedidos.stream().map(this::converter).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscar(Long id, String login, boolean agente) {
        return converter(obter(id, login, agente));
    }

    @Transactional
    public PedidoResponse atualizar(Long id, String login, boolean agente, PedidoRequest request) {
        PedidoAluguel pedido = obter(id, login, agente);
        exigirEmAnalise(pedido, "modificado");
        validarPeriodo(request.dataInicio(), request.dataFim());

        pedido.setAutomovel(buscarAutomovel(request.automovelId()));
        pedido.setDataInicio(request.dataInicio());
        pedido.setDataFim(request.dataFim());

        return converter(pedidoRepository.save(pedido));
    }

    @Transactional
    public PedidoResponse cancelar(Long id, String loginCliente) {
        PedidoAluguel pedido = obter(id, loginCliente, false);
        if (pedido.getStatus() == StatusPedido.CONTRATO_EXECUTADO
                || pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new RegraDeNegocioException("Este pedido não pode mais ser cancelado.");
        }
        pedido.setStatus(StatusPedido.CANCELADO);
        return converter(pedidoRepository.save(pedido));
    }

    @Transactional
    public PedidoResponse avaliar(Long id, String loginAgente, AvaliacaoRequest request) {
        Agente agente = agenteRepository.findByLogin(loginAgente)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agente não encontrado."));
        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado."));
        exigirEmAnalise(pedido, "avaliado");

        boolean aprovado = request.aprovado();
        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setPedido(pedido);
        avaliacao.setAgente(agente);
        avaliacao.setParecer(aprovado ? ParecerFinanceiro.POSITIVO : ParecerFinanceiro.NEGATIVO);
        avaliacao.setJustificativa(request.justificativa());
        avaliacao.setDataAvaliacao(LocalDate.now());

        pedido.getAvaliacoes().add(avaliacao);
        pedido.setStatus(aprovado ? StatusPedido.APROVADO : StatusPedido.REPROVADO);

        return converter(pedidoRepository.save(pedido));
    }

    private PedidoAluguel obter(Long id, String login, boolean agente) {
        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado."));
        if (!agente && !pedido.getCliente().getLogin().equals(login)) {
            throw new RecursoNaoEncontradoException("Pedido não encontrado.");
        }
        return pedido;
    }

    private Automovel buscarAutomovel(Long id) {
        return automovelRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Automóvel não encontrado."));
    }

    private void exigirEmAnalise(PedidoAluguel pedido, String acao) {
        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new RegraDeNegocioException(
                    "Somente pedidos em análise podem ser " + acao + ".");
        }
    }

    private void validarPeriodo(LocalDate inicio, LocalDate fim) {
        if (inicio.isBefore(LocalDate.now())) {
            throw new RegraDeNegocioException("A data de retirada não pode estar no passado.");
        }
        if (fim.isBefore(inicio)) {
            throw new RegraDeNegocioException(
                    "A data de devolução não pode ser anterior à data de retirada.");
        }
    }

    private PedidoResponse converter(PedidoAluguel p) {
        Automovel a = p.getAutomovel();
        AutomovelResponse automovel = new AutomovelResponse(a.getId(), a.getMatricula(),
                a.getAno(), a.getMarca(), a.getModelo(), a.getPlaca(), a.getImagemUrl());

        List<Avaliacao> avaliacoes = p.getAvaliacoes();
        String justificativa = avaliacoes.isEmpty()
                ? null
                : avaliacoes.get(avaliacoes.size() - 1).getJustificativa();

        return new PedidoResponse(p.getId(), p.getStatus().name(), p.getDataPedido(),
                p.getDataInicio(), p.getDataFim(), automovel, p.getCliente().getNome(),
                justificativa);
    }
}
