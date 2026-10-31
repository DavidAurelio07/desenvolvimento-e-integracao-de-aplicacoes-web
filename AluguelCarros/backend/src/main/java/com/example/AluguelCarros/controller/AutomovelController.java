package com.example.AluguelCarros.controller;

import com.example.AluguelCarros.dto.AutomovelRequest;
import com.example.AluguelCarros.dto.AutomovelResponse;
import com.example.AluguelCarros.service.AutomovelService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/automoveis")
public class AutomovelController {

    private final AutomovelService automovelService;

    public AutomovelController(AutomovelService automovelService) {
        this.automovelService = automovelService;
    }

    @GetMapping
    public List<AutomovelResponse> listar() {
        return automovelService.listar();
    }

    @PostMapping
    public ResponseEntity<AutomovelResponse> cadastrar(Authentication autenticacao,
                                                       @Valid @RequestBody AutomovelRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(automovelService.cadastrar(autenticacao.getName(), request));
    }
}
