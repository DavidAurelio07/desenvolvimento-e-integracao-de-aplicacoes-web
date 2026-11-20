package com.example.sistema_matriculas.model;

import java.util.List;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "usuarios")
public class Aluno extends Usuario {

    private String numeroMatricula;
    @DBRef
    private Curso curso;

    public String getNumeroMatricula() { return numeroMatricula; }
    public void setNumeroMatricula(String numeroMatricula) { this.numeroMatricula = numeroMatricula; }
    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }

    public Matricula matricularEmDisciplina(Disciplina disciplina) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

    public void cancelarMatricula(Matricula matricula) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

    public List<Matricula> consultarMatriculas(Semestre semestre) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

}
