package com.example.AluguelCarros.controller;

import com.example.AluguelCarros.dto.ContratoRequest;
import com.example.AluguelCarros.dto.CreditoRequest;
import com.example.AluguelCarros.dto.PedidoResponse;
import com.example.AluguelCarros.service.ContratoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pedidos")
public class ContratoController {

    private final ContratoService contratoService;

    public ContratoController(ContratoService contratoService) {
        this.contratoService = contratoService;
    }

    @PostMapping("/{id}/contrato")
    public ResponseEntity<PedidoResponse> executar(@PathVariable Long id,
                                                   Authentication autenticacao,
                                                   @Valid @RequestBody ContratoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(contratoService.executar(id, autenticacao.getName(), request));
    }

    @PostMapping("/{id}/credito")
    public ResponseEntity<PedidoResponse> concederCredito(@PathVariable Long id,
                                                          Authentication autenticacao,
                                                          @Valid @RequestBody CreditoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(contratoService.concederCredito(id, autenticacao.getName(), request));
    }
}
