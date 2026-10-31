package com.example.AluguelCarros.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AvaliacaoRequest(
        @NotNull(message = "Informe o parecer.") Boolean aprovado,
        @Size(max = 500, message = "A justificativa pode ter no máximo 500 caracteres.")
        String justificativa) {
}
