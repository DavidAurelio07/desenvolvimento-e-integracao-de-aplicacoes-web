package com.example.sistema_matriculas.model;

import com.example.sistema_matriculas.model.enums.StatusMatricula;
import com.example.sistema_matriculas.model.enums.TipoDisciplina;
import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "matriculas")
public class Matricula {

    @Id
    private String id;

    private LocalDateTime dataMatricula;
    private TipoDisciplina tipo;
    private StatusMatricula status = StatusMatricula.ATIVA;
    @DBRef
    private Aluno aluno;
    @DBRef
    private Disciplina disciplina;
    @DBRef
    private Semestre semestre;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public LocalDateTime getDataMatricula() { return dataMatricula; }
    public void setDataMatricula(LocalDateTime dataMatricula) { this.dataMatricula = dataMatricula; }
    public TipoDisciplina getTipo() { return tipo; }
    public void setTipo(TipoDisciplina tipo) { this.tipo = tipo; }
    public StatusMatricula getStatus() { return status; }
    public void setStatus(StatusMatricula status) { this.status = status; }
    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }
    public Disciplina getDisciplina() { return disciplina; }
    public void setDisciplina(Disciplina disciplina) { this.disciplina = disciplina; }
    public Semestre getSemestre() { return semestre; }
    public void setSemestre(Semestre semestre) { this.semestre = semestre; }

    public void cancelar() {
        throw new UnsupportedOperationException("TODO: implementar");
    }

}
