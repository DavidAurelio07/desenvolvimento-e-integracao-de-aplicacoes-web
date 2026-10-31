package com.example.AluguelCarros.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record PedidoRequest(
        @NotNull(message = "Escolha um automóvel.") Long automovelId,
        @NotNull(message = "Informe a data de retirada.") LocalDate dataInicio,
        @NotNull(message = "Informe a data de devolução.") LocalDate dataFim) {
}
