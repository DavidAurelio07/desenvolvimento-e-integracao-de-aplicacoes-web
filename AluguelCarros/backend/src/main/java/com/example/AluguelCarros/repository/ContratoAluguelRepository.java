package com.example.AluguelCarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.AluguelCarros.model.ContratoAluguel;

public interface ContratoAluguelRepository extends JpaRepository<ContratoAluguel, Long> {
}
