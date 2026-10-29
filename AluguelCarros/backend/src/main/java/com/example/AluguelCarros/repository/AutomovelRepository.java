package com.example.AluguelCarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.AluguelCarros.model.Automovel;

public interface AutomovelRepository extends JpaRepository<Automovel, Long> {
}
