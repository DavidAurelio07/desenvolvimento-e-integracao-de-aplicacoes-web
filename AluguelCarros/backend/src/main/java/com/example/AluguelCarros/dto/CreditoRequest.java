package com.example.AluguelCarros.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record CreditoRequest(
        @NotNull(message = "Informe o valor financiado.")
        @Positive(message = "O valor financiado deve ser maior que zero.") BigDecimal valorFinanciado,
        @NotNull(message = "Informe a taxa de juros.")
        @PositiveOrZero(message = "A taxa de juros não pode ser negativa.") BigDecimal taxaJuros,
        @NotNull(message = "Informe o prazo em meses.")
        @Min(value = 1, message = "O prazo mínimo é de 1 mês.")
        @Max(value = 600, message = "O prazo máximo é de 600 meses.") Integer prazoMeses) {
}
