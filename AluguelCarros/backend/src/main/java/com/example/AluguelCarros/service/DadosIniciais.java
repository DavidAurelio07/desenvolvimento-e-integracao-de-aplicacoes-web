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
 * e alguns automóveis. As fotos são informadas depois, pelo link, na tela
 * de Automóveis do agente; sem foto, o site mostra uma ilustração.
 */
@Component
public class DadosIniciais implements CommandLineRunner {

    // matrícula, ano, marca, modelo, placa
    private static final Object[][] CARROS = {
        {"MAT-001", 2023, "Fiat", "Mobi", "BDR1A01"},
        {"MAT-002", 2022, "Volkswagen", "Gol", "BDR1A02"},
        {"MAT-003", 2024, "Chevrolet", "Onix", "BDR1A03"},
        {"MAT-004", 2023, "Hyundai", "HB20", "BDR1A04"},
        {"MAT-005", 2024, "Toyota", "Corolla", "BDR1A05"},
    };

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
        if (agenteRepository.count() == 0) {
            criarAgentesECarros();
        }
    }

    private void criarAgentesECarros() {
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
            for (Object[] c : CARROS) {
                Automovel automovel = new Automovel();
                automovel.setMatricula((String) c[0]);
                automovel.setAno((Integer) c[1]);
                automovel.setMarca((String) c[2]);
                automovel.setModelo((String) c[3]);
                automovel.setPlaca((String) c[4]);
                automovel.setProprietario(empresa);
                automovelRepository.save(automovel);
            }
        }
    }
}
