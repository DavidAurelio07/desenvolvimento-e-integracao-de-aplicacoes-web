package com.example.sistema_matriculas.repository;

import com.example.sistema_matriculas.model.Disciplina;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DisciplinaRepository extends MongoRepository<Disciplina, String> {}
