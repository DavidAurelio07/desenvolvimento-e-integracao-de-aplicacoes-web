package com.example.sistema_matriculas.repository;

import com.example.sistema_matriculas.model.Matricula;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MatriculaRepository extends MongoRepository<Matricula, String> {}
