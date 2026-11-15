package com.example.AluguelCarros.service;

import com.example.AluguelCarros.dto.AutomovelRequest;
import com.example.AluguelCarros.dto.AutomovelResponse;
import com.example.AluguelCarros.exception.ConflitoException;
import com.example.AluguelCarros.exception.RecursoNaoEncontradoException;
import com.example.AluguelCarros.model.Automovel;
import com.example.AluguelCarros.model.Usuario;
import com.example.AluguelCarros.repository.AutomovelRepository;
import com.example.AluguelCarros.repository.PedidoAluguelRepository;
import com.example.AluguelCarros.repository.UsuarioRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AutomovelService {

    private final AutomovelRepository automovelRepository;
    private final UsuarioRepository usuarioRepository;
    private final PedidoAluguelRepository pedidoAluguelRepository;

    public AutomovelService(AutomovelRepository automovelRepository,
                            UsuarioRepository usuarioRepository,
                            PedidoAluguelRepository pedidoAluguelRepository) {
        this.automovelRepository = automovelRepository;
        this.usuarioRepository = usuarioRepository;
        this.pedidoAluguelRepository = pedidoAluguelRepository;
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
        preencher(automovel, request);
        automovel.setProprietario(proprietario);

        return converter(automovelRepository.save(automovel));
    }

    @Transactional
    public AutomovelResponse atualizar(Long id, AutomovelRequest request) {
        Automovel automovel = automovelRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Automóvel não encontrado."));
        if (automovelRepository.existsByPlacaAndIdNot(request.placa(), id)) {
            throw new ConflitoException("Placa já cadastrada.");
        }
        preencher(automovel, request);
        return converter(automovelRepository.save(automovel));
    }

    @Transactional
    public void excluir(Long id) {
        Automovel automovel = automovelRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Automóvel não encontrado."));
        if (pedidoAluguelRepository.existsByAutomovelId(id)) {
            throw new ConflitoException(
                    "Não é possível excluir um automóvel com pedidos de aluguel vinculados.");
        }
        automovelRepository.delete(automovel);
    }

    private void preencher(Automovel automovel, AutomovelRequest request) {
        automovel.setMatricula(request.matricula());
        automovel.setAno(request.ano());
        automovel.setMarca(request.marca());
        automovel.setModelo(request.modelo());
        automovel.setPlaca(request.placa());
        automovel.setImagemUrl(
                request.imagemUrl() == null || request.imagemUrl().isBlank() ? null : request.imagemUrl().trim());
    }

    private AutomovelResponse converter(Automovel a) {
        return new AutomovelResponse(a.getId(), a.getMatricula(), a.getAno(),
                a.getMarca(), a.getModelo(), a.getPlaca(), a.getImagemUrl());
    }
}
