package com.example.AluguelCarros.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ClienteUpdateRequest(
        @NotBlank(message = "Informe o nome.") String nome,
        @NotBlank(message = "Informe o RG.") String rg,
        @NotBlank(message = "Informe o endereço.") String endereco,
        @NotBlank(message = "Informe a profissão.") String profissao,
        @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres.") String senha,
        @Valid @Size(max = 3, message = "Informe no máximo 3 rendimentos.")
        List<RendimentoRequest> rendimentos) {
}
