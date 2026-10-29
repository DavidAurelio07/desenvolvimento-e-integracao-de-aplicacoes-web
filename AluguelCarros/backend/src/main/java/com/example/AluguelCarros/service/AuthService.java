package com.example.AluguelCarros.service;

import com.example.AluguelCarros.dto.LoginRequest;
import com.example.AluguelCarros.dto.LoginResponse;
import com.example.AluguelCarros.dto.UsuarioResponse;
import com.example.AluguelCarros.exception.CredenciaisInvalidasException;
import com.example.AluguelCarros.model.Agente;
import com.example.AluguelCarros.model.Cliente;
import com.example.AluguelCarros.model.Usuario;
import com.example.AluguelCarros.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByLogin(request.login())
                .filter(u -> passwordEncoder.matches(request.senha(), u.getSenha()))
                .orElseThrow(() -> new CredenciaisInvalidasException("Usuário ou senha inválidos."));

        UsuarioResponse resposta = converter(usuario);
        String token = jwtService.gerarToken(usuario.getLogin(), resposta.papel());
        return new LoginResponse(token, resposta);
    }

    private UsuarioResponse converter(Usuario usuario) {
        return switch (usuario) {
            case Cliente c -> new UsuarioResponse(c.getId(), c.getNome(), "CLIENTE");
            case Agente a -> new UsuarioResponse(a.getId(), a.getNome(), "AGENTE");
            default -> throw new IllegalStateException("Tipo de usuário desconhecido.");
        };
    }
}
