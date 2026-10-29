package com.example.AluguelCarros.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "avaliacoes")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParecerFinanceiro parecer;

    @Column(length = 500)
    private String justificativa;

    @Column(nullable = false)
    private LocalDate dataAvaliacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private PedidoAluguel pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agente_id", nullable = false)
    private Agente agente;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ParecerFinanceiro getParecer() {
        return parecer;
    }

    public void setParecer(ParecerFinanceiro parecer) {
        this.parecer = parecer;
    }

    public String getJustificativa() {
        return justificativa;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }

    public LocalDate getDataAvaliacao() {
        return dataAvaliacao;
    }

    public void setDataAvaliacao(LocalDate dataAvaliacao) {
        this.dataAvaliacao = dataAvaliacao;
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
}
