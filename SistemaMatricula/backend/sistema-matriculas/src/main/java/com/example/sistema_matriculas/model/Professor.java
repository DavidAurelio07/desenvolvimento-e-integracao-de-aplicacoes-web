package com.example.sistema_matriculas.model;

import java.util.List;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "usuarios")
public class Professor extends Usuario {



    public List<Aluno> consultarAlunosPorDisciplina(Disciplina disciplina) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

}
