package com.example.AluguelCarros.service;

import com.example.AluguelCarros.dto.ClienteRequest;
import com.example.AluguelCarros.dto.ClienteResponse;
import com.example.AluguelCarros.dto.ClienteUpdateRequest;
import com.example.AluguelCarros.dto.RendimentoRequest;
import com.example.AluguelCarros.dto.RendimentoResponse;
import com.example.AluguelCarros.exception.ConflitoException;
import com.example.AluguelCarros.exception.RecursoNaoEncontradoException;
import com.example.AluguelCarros.exception.RegraDeNegocioException;
import com.example.AluguelCarros.model.Cliente;
import com.example.AluguelCarros.model.Rendimento;
import com.example.AluguelCarros.repository.ClienteRepository;
import com.example.AluguelCarros.repository.PedidoAluguelRepository;
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
    private final PedidoAluguelRepository pedidoRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteService(ClienteRepository clienteRepository,
                          UsuarioRepository usuarioRepository,
                          PedidoAluguelRepository pedidoRepository,
                          PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.pedidoRepository = pedidoRepository;
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
        List<RendimentoRequest> rendimentos = validarRendimentos(request.rendimentos());

        Cliente cliente = new Cliente();
        cliente.setLogin(request.login());
        cliente.setSenha(passwordEncoder.encode(request.senha()));
        cliente.setNome(request.nome());
        cliente.setCpf(request.cpf());
        cliente.setRg(request.rg());
        cliente.setEndereco(request.endereco());
        cliente.setProfissao(request.profissao());
        adicionarRendimentos(cliente, rendimentos);

        return converter(clienteRepository.save(cliente));
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscar(String login) {
        return converter(obter(login));
    }

    @Transactional
    public ClienteResponse atualizar(String login, ClienteUpdateRequest request) {
        Cliente cliente = obter(login);
        List<RendimentoRequest> rendimentos = validarRendimentos(request.rendimentos());

        cliente.setNome(request.nome());
        cliente.setRg(request.rg());
        cliente.setEndereco(request.endereco());
        cliente.setProfissao(request.profissao());
        if (request.senha() != null && !request.senha().isBlank()) {
            cliente.setSenha(passwordEncoder.encode(request.senha()));
        }

        cliente.getRendimentos().clear();
        adicionarRendimentos(cliente, rendimentos);

        return converter(clienteRepository.save(cliente));
    }

    @Transactional
    public void excluir(String login) {
        Cliente cliente = obter(login);
        if (pedidoRepository.existsByClienteId(cliente.getId())) {
            throw new RegraDeNegocioException(
                    "Não é possível excluir o cadastro enquanto houver pedidos de aluguel associados.");
        }
        clienteRepository.delete(cliente);
    }

    private Cliente obter(String login) {
        return clienteRepository.findByLogin(login)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado."));
    }

    private List<RendimentoRequest> validarRendimentos(List<RendimentoRequest> rendimentos) {
        List<RendimentoRequest> lista = rendimentos == null ? List.of() : rendimentos;
        if (lista.size() > MAX_RENDIMENTOS) {
            throw new RegraDeNegocioException(
                    "Um cliente pode ter no máximo " + MAX_RENDIMENTOS + " rendimentos.");
        }
        return lista;
    }

    private void adicionarRendimentos(Cliente cliente, List<RendimentoRequest> rendimentos) {
        for (RendimentoRequest r : rendimentos) {
            Rendimento rendimento = new Rendimento();
            rendimento.setEntidadeEmpregadora(r.entidadeEmpregadora());
            rendimento.setValor(r.valor());
            cliente.adicionarRendimento(rendimento);
        }
    }

    private ClienteResponse converter(Cliente c) {
        List<RendimentoResponse> rendimentos = c.getRendimentos().stream()
                .map(r -> new RendimentoResponse(r.getId(), r.getEntidadeEmpregadora(), r.getValor()))
                .toList();
        return new ClienteResponse(c.getId(), c.getLogin(), c.getNome(), c.getCpf(),
                c.getRg(), c.getEndereco(), c.getProfissao(), rendimentos);
    }
}
