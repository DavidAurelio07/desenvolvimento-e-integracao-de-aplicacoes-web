package com.example.AluguelCarros.controller;

import com.example.AluguelCarros.dto.ClienteRequest;
import com.example.AluguelCarros.dto.ClienteResponse;
import com.example.AluguelCarros.dto.ClienteUpdateRequest;
import com.example.AluguelCarros.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> cadastrar(@Valid @RequestBody ClienteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.cadastrar(request));
    }

    @GetMapping("/me")
    public ClienteResponse consultar(Authentication autenticacao) {
        return clienteService.buscar(autenticacao.getName());
    }

    @PutMapping("/me")
    public ClienteResponse atualizar(Authentication autenticacao,
                                     @Valid @RequestBody ClienteUpdateRequest request) {
        return clienteService.atualizar(autenticacao.getName(), request);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> excluir(Authentication autenticacao) {
        clienteService.excluir(autenticacao.getName());
        return ResponseEntity.noContent().build();
    }
}
