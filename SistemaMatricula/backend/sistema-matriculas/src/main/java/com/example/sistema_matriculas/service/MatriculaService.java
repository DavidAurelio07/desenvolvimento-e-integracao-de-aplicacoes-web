package com.example.sistema_matriculas.service;

import com.example.sistema_matriculas.model.Aluno;
import com.example.sistema_matriculas.model.Disciplina;
import com.example.sistema_matriculas.model.Matricula;
import com.example.sistema_matriculas.model.PeriodoMatricula;
import org.springframework.stereotype.Service;

/**
 * Regras de negocio de matricula: periodo aberto (RN04), limite 4+2 (RN03),
 * maximo de 60 alunos (RN05), minimo de 3 alunos (RN06) e cobranca (RN07).
 */
@Service
public class MatriculaService {

    private final NotificadorCobranca notificadorCobranca;

    public MatriculaService(NotificadorCobranca notificadorCobranca) {
        this.notificadorCobranca = notificadorCobranca;
    }

    public Matricula matricular(Aluno aluno, Disciplina disciplina) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

    public void cancelar(Matricula matricula) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

    public void validarRegras(Aluno aluno, Disciplina disciplina) {
        throw new UnsupportedOperationException("TODO: implementar");
    }

    public void processarFimDoPeriodo(PeriodoMatricula periodo) {
        throw new UnsupportedOperationException("TODO: implementar");
    }
}
