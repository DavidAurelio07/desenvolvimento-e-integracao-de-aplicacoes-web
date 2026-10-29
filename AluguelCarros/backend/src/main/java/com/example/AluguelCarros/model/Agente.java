package com.example.AluguelCarros.model;

import jakarta.persistence.*;

@Entity
@Table(name = "agentes")
public abstract class Agente extends Usuario {

    @Column(nullable = false)
    private String nome;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
