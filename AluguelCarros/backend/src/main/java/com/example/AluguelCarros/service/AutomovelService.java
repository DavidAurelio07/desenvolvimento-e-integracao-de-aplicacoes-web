package com.example.AluguelCarros.service;

import com.example.AluguelCarros.dto.AutomovelRequest;
import com.example.AluguelCarros.dto.AutomovelResponse;
import com.example.AluguelCarros.exception.ConflitoException;
import com.example.AluguelCarros.exception.RecursoNaoEncontradoException;
import com.example.AluguelCarros.model.Automovel;
import com.example.AluguelCarros.model.Usuario;
import com.example.AluguelCarros.repository.AutomovelRepository;
import com.example.AluguelCarros.repository.UsuarioRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AutomovelService {

    private final AutomovelRepository automovelRepository;
    private final UsuarioRepository usuarioRepository;

    public AutomovelService(AutomovelRepository automovelRepository,
                            UsuarioRepository usuarioRepository) {
        this.automovelRepository = automovelRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<AutomovelResponse> listar() {
        return automovelRepository.findAll().stream().map(this::converter).toList();
    }

    @Transactional
    public AutomovelResponse cadastrar(String loginProprietario, AutomovelRequest request) {
        if (automovelRepository.existsByPlaca(request.placa())) {
            throw new ConflitoException("Placa já cadastrada.");
        }
        Usuario proprietario = usuarioRepository.findByLogin(loginProprietario)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));

        Automovel automovel = new Automovel();
        automovel.setMatricula(request.matricula());
        automovel.setAno(request.ano());
        automovel.setMarca(request.marca());
        automovel.setModelo(request.modelo());
        automovel.setPlaca(request.placa());
        automovel.setProprietario(proprietario);

        return converter(automovelRepository.save(automovel));
    }

    private AutomovelResponse converter(Automovel a) {
        return new AutomovelResponse(a.getId(), a.getMatricula(), a.getAno(),
                a.getMarca(), a.getModelo(), a.getPlaca());
    }
}
