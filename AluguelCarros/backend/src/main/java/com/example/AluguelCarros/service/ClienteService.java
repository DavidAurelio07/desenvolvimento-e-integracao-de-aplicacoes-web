package com.example.AluguelCarros.service;

import com.example.AluguelCarros.dto.ClienteRequest;
import com.example.AluguelCarros.dto.ClienteResponse;
import com.example.AluguelCarros.dto.RendimentoRequest;
import com.example.AluguelCarros.dto.RendimentoResponse;
import com.example.AluguelCarros.exception.ConflitoException;
import com.example.AluguelCarros.exception.RegraDeNegocioException;
import com.example.AluguelCarros.model.Cliente;
import com.example.AluguelCarros.model.Rendimento;
import com.example.AluguelCarros.repository.ClienteRepository;
import com.example.AluguelCarros.repository.UsuarioRepository;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClienteService {

    private static final int MAX_RENDIMENTOS = 3;

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteService(ClienteRepository clienteRepository,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public ClienteResponse cadastrar(ClienteRequest request) {
        if (usuarioRepository.existsByLogin(request.login())) {
            throw new ConflitoException("Este usuário já está em uso.");
        }
        if (clienteRepository.existsByCpf(request.cpf())) {
            throw new ConflitoException("CPF já cadastrado.");
        }

        List<RendimentoRequest> rendimentos =
                request.rendimentos() == null ? List.of() : request.rendimentos();
        if (rendimentos.size() > MAX_RENDIMENTOS) {
            throw new RegraDeNegocioException(
                    "Um cliente pode ter no máximo " + MAX_RENDIMENTOS + " rendimentos.");
        }

        Cliente cliente = new Cliente();
        cliente.setLogin(request.login());
        cliente.setSenha(passwordEncoder.encode(request.senha()));
        cliente.setNome(request.nome());
        cliente.setCpf(request.cpf());
        cliente.setRg(request.rg());
        cliente.setEndereco(request.endereco());
        cliente.setProfissao(request.profissao());

        for (RendimentoRequest r : rendimentos) {
            Rendimento rendimento = new Rendimento();
            rendimento.setEntidadeEmpregadora(r.entidadeEmpregadora());
            rendimento.setValor(r.valor());
            cliente.adicionarRendimento(rendimento);
        }

        return converter(clienteRepository.save(cliente));
    }

    private ClienteResponse converter(Cliente c) {
        List<RendimentoResponse> rendimentos = c.getRendimentos().stream()
                .map(r -> new RendimentoResponse(r.getId(), r.getEntidadeEmpregadora(), r.getValor()))
                .toList();
        return new ClienteResponse(c.getId(), c.getLogin(), c.getNome(), c.getCpf(),
                c.getRg(), c.getEndereco(), c.getProfissao(), rendimentos);
    }
}
