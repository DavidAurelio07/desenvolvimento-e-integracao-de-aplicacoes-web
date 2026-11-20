package com.example.sistema_matriculas.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "usuarios")
public abstract class Usuario {

    @Id
    private String id;

    private String nome;
    @Indexed(unique = true)
    private String login;
    private String senhaHash;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }
    public String getSenhaHash() { return senhaHash; }
    public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }

    public boolean autenticar(String login, String senha) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

}
