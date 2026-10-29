package com.example.AluguelCarros.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "contratos_aluguel")
public class ContratoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoContrato tipo;

    @Column(nullable = false)
    private LocalDate dataAssinatura;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valorMensal;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false, unique = true)
    private PedidoAluguel pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agente_id", nullable = false)
    private Agente agente;

    @OneToOne
    @JoinColumn(name = "contrato_credito_id")
    private ContratoCredito contratoCredito;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoContrato getTipo() {
        return tipo;
    }

    public void setTipo(TipoContrato tipo) {
        this.tipo = tipo;
    }

    public LocalDate getDataAssinatura() {
        return dataAssinatura;
    }

    public void setDataAssinatura(LocalDate dataAssinatura) {
        this.dataAssinatura = dataAssinatura;
    }

    public BigDecimal getValorMensal() {
        return valorMensal;
    }

    public void setValorMensal(BigDecimal valorMensal) {
        this.valorMensal = valorMensal;
    }

    public PedidoAluguel getPedido() {
        return pedido;
    }

    public void setPedido(PedidoAluguel pedido) {
        this.pedido = pedido;
    }

    public Agente getAgente() {
        return agente;
    }

    public void setAgente(Agente agente) {
        this.agente = agente;
    }

    public ContratoCredito getContratoCredito() {
        return contratoCredito;
    }

    public void setContratoCredito(ContratoCredito contratoCredito) {
        this.contratoCredito = contratoCredito;
    }
}
