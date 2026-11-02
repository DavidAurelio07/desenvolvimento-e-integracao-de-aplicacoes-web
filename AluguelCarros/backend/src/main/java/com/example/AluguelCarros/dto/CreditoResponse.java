package com.example.AluguelCarros.dto;

import java.math.BigDecimal;

public record CreditoResponse(
        Long id,
        BigDecimal valorFinanciado,
        BigDecimal taxaJuros,
        Integer prazoMeses,
        String bancoNome) {
}
