package com.example.AluguelCarros.dto;

// tipoAgente: "EMPRESA" ou "BANCO" para agentes; nulo para clientes
public record UsuarioResponse(Long id, String nome, String papel, String tipoAgente) {
}
