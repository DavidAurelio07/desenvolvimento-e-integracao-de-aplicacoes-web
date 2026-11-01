package com.example.AluguelCarros.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AutomovelRequest(
        @NotBlank(message = "Informe a matrícula.") String matricula,
        @NotNull(message = "Informe o ano.") Integer ano,
        @NotBlank(message = "Informe a marca.") String marca,
        @NotBlank(message = "Informe o modelo.") String modelo,
        @NotBlank(message = "Informe a placa.") String placa,
        @Size(max = 2000, message = "O link da foto é muito longo.")
        @Pattern(regexp = "^(https?://\\S+)?$",
                message = "O link da foto deve começar com http:// ou https://.")
        String imagemUrl) {
}
