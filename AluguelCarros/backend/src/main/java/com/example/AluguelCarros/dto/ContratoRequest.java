package com.example.AluguelCarros.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record ContratoRequest(
        @NotBlank(message = "Informe o tipo de contrato.")
        @Pattern(regexp = "PROPRIEDADE_CLIENTE|PROPRIEDADE_EMPRESA|PROPRIEDADE_BANCO",
                message = "Tipo de contrato inválido.") String tipo,
        @NotNull(message = "Informe o valor mensal.")
        @Positive(message = "O valor mensal deve ser maior que zero.") BigDecimal valorMensal) {
}
