package com.example.sistema_matriculas.repository;

import com.example.sistema_matriculas.model.Aluno;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AlunoRepository extends MongoRepository<Aluno, String> {}
