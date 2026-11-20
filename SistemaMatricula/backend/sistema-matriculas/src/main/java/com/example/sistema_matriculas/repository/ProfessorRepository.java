package com.example.sistema_matriculas.repository;

import com.example.sistema_matriculas.model.Professor;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProfessorRepository extends MongoRepository<Professor, String> {}
