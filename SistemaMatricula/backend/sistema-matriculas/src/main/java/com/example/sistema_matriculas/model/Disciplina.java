package com.example.sistema_matriculas.model;

import com.example.sistema_matriculas.model.enums.StatusDisciplina;
import com.example.sistema_matriculas.model.enums.TipoDisciplina;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "disciplinas")
public class Disciplina {

    @Id
    private String id;

    private String nome;
    private int creditos;
    private TipoDisciplina tipo;
    private StatusDisciplina status = StatusDisciplina.ABERTA;
    private int vagasMaximas = 60;
    private int minimoAlunos = 3;
    @DBRef
    private Curso curso;
    @DBRef
    private Professor professor;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public int getCreditos() { return creditos; }
    public void setCreditos(int creditos) { this.creditos = creditos; }
    public TipoDisciplina getTipo() { return tipo; }
    public void setTipo(TipoDisciplina tipo) { this.tipo = tipo; }
    public StatusDisciplina getStatus() { return status; }
    public void setStatus(StatusDisciplina status) { this.status = status; }
    public int getVagasMaximas() { return vagasMaximas; }
    public void setVagasMaximas(int vagasMaximas) { this.vagasMaximas = vagasMaximas; }
    public int getMinimoAlunos() { return minimoAlunos; }
    public void setMinimoAlunos(int minimoAlunos) { this.minimoAlunos = minimoAlunos; }
    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }
    public Professor getProfessor() { return professor; }
    public void setProfessor(Professor professor) { this.professor = professor; }

    public int totalInscritos() {
        throw new UnsupportedOperationException("TODO: implementar");
    }

    public boolean estaLotada() {
        throw new UnsupportedOperationException("TODO: implementar");
    }

    public boolean atingiuMinimo() {
        throw new UnsupportedOperationException("TODO: implementar");
    }

    public void ativar() {
        throw new UnsupportedOperationException("TODO: implementar");
    }

    public void cancelar() {
        throw new UnsupportedOperationException("TODO: implementar");
    }

}
