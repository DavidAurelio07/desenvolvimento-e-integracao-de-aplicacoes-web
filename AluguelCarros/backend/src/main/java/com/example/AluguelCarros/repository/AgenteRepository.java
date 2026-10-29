package com.example.AluguelCarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.AluguelCarros.model.Agente;

public interface AgenteRepository extends JpaRepository<Agente, Long> {
}
