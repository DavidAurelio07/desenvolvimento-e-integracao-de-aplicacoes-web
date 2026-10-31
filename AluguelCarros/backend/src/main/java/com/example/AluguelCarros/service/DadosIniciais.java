package com.example.AluguelCarros.service;

import com.example.AluguelCarros.model.Automovel;
import com.example.AluguelCarros.model.Banco;
import com.example.AluguelCarros.model.Empresa;
import com.example.AluguelCarros.repository.AgenteRepository;
import com.example.AluguelCarros.repository.AutomovelRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cria dados de teste na primeira execução: uma empresa e um banco (agentes)
 * e alguns automóveis. Só executa se ainda não existir nenhum agente.
 */
@Component
public class DadosIniciais implements CommandLineRunner {

    private final AgenteRepository agenteRepository;
    private final AutomovelRepository automovelRepository;
    private final PasswordEncoder passwordEncoder;

    public DadosIniciais(AgenteRepository agenteRepository,
                         AutomovelRepository automovelRepository,
                         PasswordEncoder passwordEncoder) {
        this.agenteRepository = agenteRepository;
        this.automovelRepository = automovelRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (agenteRepository.count() > 0) {
            return;
        }

        Empresa empresa = new Empresa();
        empresa.setLogin("locadora");
        empresa.setSenha(passwordEncoder.encode("locadora123"));
        empresa.setNome("Locadora Bão de Roda");
        agenteRepository.save(empresa);

        Banco banco = new Banco();
        banco.setLogin("banco");
        banco.setSenha(passwordEncoder.encode("banco123"));
        banco.setNome("Banco Bão de Roda");
        agenteRepository.save(banco);

        if (automovelRepository.count() == 0) {
            criarAutomovel(empresa, "MAT-001", 2023, "Fiat", "Mobi", "BDR1A01");
            criarAutomovel(empresa, "MAT-002", 2022, "Volkswagen", "Gol", "BDR1A02");
            criarAutomovel(empresa, "MAT-003", 2024, "Chevrolet", "Onix", "BDR1A03");
            criarAutomovel(empresa, "MAT-004", 2023, "Hyundai", "HB20", "BDR1A04");
            criarAutomovel(empresa, "MAT-005", 2024, "Toyota", "Corolla", "BDR1A05");
        }
    }

    private void criarAutomovel(Empresa dono, String matricula, int ano,
                                String marca, String modelo, String placa) {
        Automovel automovel = new Automovel();
        automovel.setMatricula(matricula);
        automovel.setAno(ano);
        automovel.setMarca(marca);
        automovel.setModelo(modelo);
        automovel.setPlaca(placa);
        automovel.setProprietario(dono);
        automovelRepository.save(automovel);
    }
}
