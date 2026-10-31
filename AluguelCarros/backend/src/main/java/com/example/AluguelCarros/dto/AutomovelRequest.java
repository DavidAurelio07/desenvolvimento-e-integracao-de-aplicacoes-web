package com.example.AluguelCarros.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AutomovelRequest(
        @NotBlank(message = "Informe a matrícula.") String matricula,
        @NotNull(message = "Informe o ano.") Integer ano,
        @NotBlank(message = "Informe a marca.") String marca,
        @NotBlank(message = "Informe o modelo.") String modelo,
        @NotBlank(message = "Informe a placa.") String placa) {
}
