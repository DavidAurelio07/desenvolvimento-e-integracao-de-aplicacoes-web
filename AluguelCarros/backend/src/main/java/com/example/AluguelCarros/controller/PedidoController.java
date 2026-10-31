package com.example.AluguelCarros.controller;

import com.example.AluguelCarros.dto.AvaliacaoRequest;
import com.example.AluguelCarros.dto.PedidoRequest;
import com.example.AluguelCarros.dto.PedidoResponse;
import com.example.AluguelCarros.service.PedidoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<PedidoResponse> listar(Authentication autenticacao) {
        return pedidoService.listar(autenticacao.getName(), ehAgente(autenticacao));
    }

    @GetMapping("/{id}")
    public PedidoResponse buscar(@PathVariable Long id, Authentication autenticacao) {
        return pedidoService.buscar(id, autenticacao.getName(), ehAgente(autenticacao));
    }

    @PostMapping
    public ResponseEntity<PedidoResponse> criar(Authentication autenticacao,
                                                @Valid @RequestBody PedidoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pedidoService.criar(autenticacao.getName(), request));
    }

    @PutMapping("/{id}")
    public PedidoResponse atualizar(@PathVariable Long id, Authentication autenticacao,
                                    @Valid @RequestBody PedidoRequest request) {
        return pedidoService.atualizar(id, autenticacao.getName(), ehAgente(autenticacao), request);
    }

    @PatchMapping("/{id}/cancelar")
    public PedidoResponse cancelar(@PathVariable Long id, Authentication autenticacao) {
        return pedidoService.cancelar(id, autenticacao.getName());
    }

    @PostMapping("/{id}/avaliacoes")
    public PedidoResponse avaliar(@PathVariable Long id, Authentication autenticacao,
                                  @Valid @RequestBody AvaliacaoRequest request) {
        return pedidoService.avaliar(id, autenticacao.getName(), request);
    }

    private boolean ehAgente(Authentication autenticacao) {
        return autenticacao.getAuthorities().stream()
                .anyMatch(a -> "ROLE_AGENTE".equals(a.getAuthority()));
    }
}
