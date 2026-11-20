package com.example.sistema_matriculas.repository;

import com.example.sistema_matriculas.model.Semestre;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SemestreRepository extends MongoRepository<Semestre, String> {}
