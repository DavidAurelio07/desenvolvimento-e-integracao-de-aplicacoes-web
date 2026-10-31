package com.example.AluguelCarros.dto;

public record AutomovelResponse(
        Long id,
        String matricula,
        Integer ano,
        String marca,
        String modelo,
        String placa) {
}
