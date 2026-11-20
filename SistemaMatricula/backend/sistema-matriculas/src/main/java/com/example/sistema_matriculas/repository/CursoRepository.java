package com.example.sistema_matriculas.repository;

import com.example.sistema_matriculas.model.Curso;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CursoRepository extends MongoRepository<Curso, String> {}
