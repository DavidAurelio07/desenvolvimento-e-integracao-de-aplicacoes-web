package com.example.AluguelCarros.repository;

import com.example.AluguelCarros.model.Agente;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgenteRepository extends JpaRepository<Agente, Long> {

    Optional<Agente> findByLogin(String login);
}
