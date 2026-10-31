package com.example.AluguelCarros.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record RendimentoRequest(
        @NotBlank(message = "Informe a entidade empregadora.") String entidadeEmpregadora,
        @NotNull(message = "Informe o valor do rendimento.")
        @PositiveOrZero(message = "O rendimento não pode ser negativo.") BigDecimal valor) {
}
