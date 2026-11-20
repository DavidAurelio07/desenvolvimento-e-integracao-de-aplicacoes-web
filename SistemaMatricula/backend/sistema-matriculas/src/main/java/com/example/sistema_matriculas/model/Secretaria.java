package com.example.sistema_matriculas.model;

import java.util.List;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "usuarios")
public class Secretaria extends Usuario {



    public Curriculo gerarCurriculo(Semestre semestre, List<Disciplina> disciplinas) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

    public void abrirPeriodoMatricula(PeriodoMatricula periodo) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

    public void encerrarPeriodoMatricula(PeriodoMatricula periodo) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

    public void processarFimDoPeriodo(PeriodoMatricula periodo) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

}
