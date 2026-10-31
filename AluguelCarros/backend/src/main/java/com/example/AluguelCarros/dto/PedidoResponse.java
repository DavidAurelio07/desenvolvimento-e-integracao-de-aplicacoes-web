package com.example.AluguelCarros.dto;

import java.time.LocalDate;

public record PedidoResponse(
        Long id,
        String status,
        LocalDate dataPedido,
        LocalDate dataInicio,
        LocalDate dataFim,
        AutomovelResponse automovel,
        String clienteNome,
        String justificativaParecer) {
}
