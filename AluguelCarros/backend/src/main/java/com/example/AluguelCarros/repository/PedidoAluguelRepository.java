package com.example.AluguelCarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.AluguelCarros.model.PedidoAluguel;

public interface PedidoAluguelRepository extends JpaRepository<PedidoAluguel, Long> {
}
