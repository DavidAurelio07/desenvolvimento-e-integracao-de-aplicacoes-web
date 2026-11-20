package com.example.sistema_matriculas.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "semestres")
public class Semestre {

    @Id
    private String id;

    private int ano;
    private int periodo;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public int getAno() { return ano; }
    public void setAno(int ano) { this.ano = ano; }
    public int getPeriodo() { return periodo; }
    public void setPeriodo(int periodo) { this.periodo = periodo; }

}
