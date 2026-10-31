package com.example.AluguelCarros.repository;

import com.example.AluguelCarros.model.PedidoAluguel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoAluguelRepository extends JpaRepository<PedidoAluguel, Long> {

    List<PedidoAluguel> findByClienteLoginOrderByIdDesc(String login);

    List<PedidoAluguel> findAllByOrderByIdDesc();

    boolean existsByClienteId(Long clienteId);
}
