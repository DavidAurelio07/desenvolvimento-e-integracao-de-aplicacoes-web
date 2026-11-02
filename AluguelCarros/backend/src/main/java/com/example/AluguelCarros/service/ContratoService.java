package com.example.AluguelCarros.service;

import com.example.AluguelCarros.dto.ContratoRequest;
import com.example.AluguelCarros.dto.CreditoRequest;
import com.example.AluguelCarros.dto.PedidoResponse;
import com.example.AluguelCarros.exception.RecursoNaoEncontradoException;
import com.example.AluguelCarros.exception.RegraDeNegocioException;
import com.example.AluguelCarros.model.Agente;
import com.example.AluguelCarros.model.Banco;
import com.example.AluguelCarros.model.ContratoAluguel;
import com.example.AluguelCarros.model.ContratoCredito;
import com.example.AluguelCarros.model.Empresa;
import com.example.AluguelCarros.model.PedidoAluguel;
import com.example.AluguelCarros.model.StatusPedido;
import com.example.AluguelCarros.model.TipoContrato;
import com.example.AluguelCarros.model.Usuario;
import com.example.AluguelCarros.repository.AgenteRepository;
import com.example.AluguelCarros.repository.ContratoAluguelRepository;
import com.example.AluguelCarros.repository.ContratoCreditoRepository;
import com.example.AluguelCarros.repository.PedidoAluguelRepository;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContratoService {

    private final PedidoAluguelRepository pedidoRepository;
    private final AgenteRepository agenteRepository;
    private final ContratoAluguelRepository contratoRepository;
    private final ContratoCreditoRepository creditoRepository;
    private final PedidoService pedidoService;

    public ContratoService(PedidoAluguelRepository pedidoRepository,
                           AgenteRepository agenteRepository,
                           ContratoAluguelRepository contratoRepository,
                           ContratoCreditoRepository creditoRepository,
                           PedidoService pedidoService) {
        this.pedidoRepository = pedidoRepository;
        this.agenteRepository = agenteRepository;
        this.contratoRepository = contratoRepository;
        this.creditoRepository = creditoRepository;
        this.pedidoService = pedidoService;
    }

    /**
     * Executa o contrato de um pedido aprovado. O tipo de contrato define quem
     * passa a ser o proprietário do automóvel: o cliente, a empresa ou o banco.
     */
    @Transactional
    public PedidoResponse executar(Long pedidoId, String loginAgente, ContratoRequest request) {
        Agente agente = obterAgente(loginAgente);
        PedidoAluguel pedido = obterPedido(pedidoId);

        if (pedido.getStatus() != StatusPedido.APROVADO) {
            throw new RegraDeNegocioException(
                    "Somente pedidos aprovados podem ter o contrato executado.");
        }

        TipoContrato tipo = converterTipo(request.tipo());
        Usuario proprietario = definirProprietario(tipo, agente, pedido);

        ContratoAluguel contrato = new ContratoAluguel();
        contrato.setPedido(pedido);
        contrato.setAgente(agente);
        contrato.setTipo(tipo);
        contrato.setDataAssinatura(LocalDate.now());
        contrato.setValorMensal(request.valorMensal());
        contratoRepository.save(contrato);

        pedido.getAutomovel().setProprietario(proprietario);
        pedido.setContrato(contrato);
        pedido.setStatus(StatusPedido.CONTRATO_EXECUTADO);
        pedidoRepository.save(pedido);

        return pedidoService.buscar(pedidoId, loginAgente, true);
    }

    /** Associa ao aluguel um contrato de crédito concedido por um banco. */
    @Transactional
    public PedidoResponse concederCredito(Long pedidoId, String loginAgente, CreditoRequest request) {
        Agente agente = obterAgente(loginAgente);
        if (!(agente instanceof Banco banco)) {
            throw new RegraDeNegocioException("Somente bancos podem conceder contrato de crédito.");
        }

        PedidoAluguel pedido = obterPedido(pedidoId);
        ContratoAluguel contrato = pedido.getContrato();
        if (contrato == null) {
            throw new RegraDeNegocioException("O contrato de aluguel ainda não foi executado.");
        }
        if (contrato.getContratoCredito() != null) {
            throw new RegraDeNegocioException("Este aluguel já possui contrato de crédito.");
        }

        ContratoCredito credito = new ContratoCredito();
        credito.setBanco(banco);
        credito.setValorFinanciado(request.valorFinanciado());
        credito.setTaxaJuros(request.taxaJuros());
        credito.setPrazoMeses(request.prazoMeses());
        creditoRepository.save(credito);

        contrato.setContratoCredito(credito);
        contratoRepository.save(contrato);

        return pedidoService.buscar(pedidoId, loginAgente, true);
    }

    private Usuario definirProprietario(TipoContrato tipo, Agente agente, PedidoAluguel pedido) {
        return switch (tipo) {
            case PROPRIEDADE_CLIENTE -> pedido.getCliente();
            case PROPRIEDADE_EMPRESA -> {
                if (!(agente instanceof Empresa)) {
                    throw new RegraDeNegocioException(
                            "Somente uma empresa pode executar um contrato com propriedade da empresa.");
                }
                yield agente;
            }
            case PROPRIEDADE_BANCO -> {
                if (!(agente instanceof Banco)) {
                    throw new RegraDeNegocioException(
                            "Somente um banco pode executar um contrato com propriedade do banco.");
                }
                yield agente;
            }
        };
    }

    private TipoContrato converterTipo(String texto) {
        try {
            return TipoContrato.valueOf(texto);
        } catch (IllegalArgumentException e) {
            throw new RegraDeNegocioException("Tipo de contrato inválido.");
        }
    }

    private Agente obterAgente(String login) {
        return agenteRepository.findByLogin(login)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agente não encontrado."));
    }

    private PedidoAluguel obterPedido(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado."));
    }
}
