package com.example.sistema_matriculas.repository;

import com.example.sistema_matriculas.model.PeriodoMatricula;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PeriodoMatriculaRepository extends MongoRepository<PeriodoMatricula, String> {}
