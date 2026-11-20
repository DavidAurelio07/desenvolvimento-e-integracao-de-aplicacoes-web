package com.example.sistema_matriculas.repository;

import com.example.sistema_matriculas.model.Curriculo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CurriculoRepository extends MongoRepository<Curriculo, String> {}
