package com.example.AluguelCarros.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContratoResponse(
        Long id,
        String tipo,
        LocalDate dataAssinatura,
        BigDecimal valorMensal,
        String agenteNome,
        String proprietarioNome,
        CreditoResponse credito) {
}
