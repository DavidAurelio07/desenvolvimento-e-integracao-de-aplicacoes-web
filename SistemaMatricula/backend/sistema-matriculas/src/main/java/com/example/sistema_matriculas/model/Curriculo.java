package com.example.sistema_matriculas.model;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "curriculos")
public class Curriculo {

    @Id
    private String id;

    @DBRef
    private Semestre semestre;
    @DBRef
    private List<Disciplina> disciplinas = new ArrayList<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Semestre getSemestre() { return semestre; }
    public void setSemestre(Semestre semestre) { this.semestre = semestre; }
    public List<Disciplina> getDisciplinas() { return disciplinas; }
    public void setDisciplinas(List<Disciplina> disciplinas) { this.disciplinas = disciplinas; }

    public void adicionarDisciplina(Disciplina disciplina) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

    public void removerDisciplina(Disciplina disciplina) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

}
