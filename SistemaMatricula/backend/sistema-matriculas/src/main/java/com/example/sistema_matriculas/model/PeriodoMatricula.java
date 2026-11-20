package com.example.sistema_matriculas.model;

import java.time.LocalDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "periodos_matricula")
public class PeriodoMatricula {

    @Id
    private String id;

    @DBRef
    private Semestre semestre;
    private LocalDate dataInicio;
    private LocalDate dataFim;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Semestre getSemestre() { return semestre; }
    public void setSemestre(Semestre semestre) { this.semestre = semestre; }
    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }

    public boolean estaAberto() {
        throw new UnsupportedOperationException("TODO: implementar");
    }

}
