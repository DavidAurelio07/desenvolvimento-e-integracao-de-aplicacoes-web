package com.example.AluguelCarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.AluguelCarros.model.Avaliacao;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
}
