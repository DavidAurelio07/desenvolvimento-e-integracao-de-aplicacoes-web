package com.example.AluguelCarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.AluguelCarros.model.ContratoCredito;

public interface ContratoCreditoRepository extends JpaRepository<ContratoCredito, Long> {
}
