package com.example.AluguelCarros.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "contratos_credito")
public class ContratoCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valorFinanciado;

    @Column(nullable = false, precision = 7, scale = 4)
    private BigDecimal taxaJuros;

    @Column(nullable = false)
    private Integer prazoMeses;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banco_id", nullable = false)
    private Banco banco;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getValorFinanciado() {
        return valorFinanciado;
    }

    public void setValorFinanciado(BigDecimal valorFinanciado) {
        this.valorFinanciado = valorFinanciado;
    }

    public BigDecimal getTaxaJuros() {
        return taxaJuros;
    }

    public void setTaxaJuros(BigDecimal taxaJuros) {
        this.taxaJuros = taxaJuros;
    }

    public Integer getPrazoMeses() {
        return prazoMeses;
    }

    public void setPrazoMeses(Integer prazoMeses) {
        this.prazoMeses = prazoMeses;
    }

    public Banco getBanco() {
        return banco;
    }

    public void setBanco(Banco banco) {
        this.banco = banco;
    }
}
