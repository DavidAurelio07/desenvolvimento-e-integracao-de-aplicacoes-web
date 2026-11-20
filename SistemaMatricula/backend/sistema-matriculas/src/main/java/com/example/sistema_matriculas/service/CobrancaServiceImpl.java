package com.example.sistema_matriculas.service;

import com.example.sistema_matriculas.model.Aluno;
import com.example.sistema_matriculas.model.Matricula;
import com.example.sistema_matriculas.model.Semestre;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * Stub do Sistema de Cobrancas: por enquanto apenas registra a notificacao.
 */
@Service
public class CobrancaServiceImpl implements NotificadorCobranca {

    @Override
    public void notificarMatricula(Aluno aluno, Semestre semestre, List<Matricula> matriculas) {
        throw new UnsupportedOperationException("TODO: implementar");
    }
}
