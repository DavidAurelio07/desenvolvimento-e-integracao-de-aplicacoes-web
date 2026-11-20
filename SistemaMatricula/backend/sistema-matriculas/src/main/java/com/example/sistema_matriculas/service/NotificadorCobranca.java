package com.example.sistema_matriculas.service;

import com.example.sistema_matriculas.model.Aluno;
import com.example.sistema_matriculas.model.Matricula;
import com.example.sistema_matriculas.model.Semestre;
import java.util.List;

/**
 * Contrato de integracao com o Sistema de Cobrancas (ator externo).
 */
public interface NotificadorCobranca {

    void notificarMatricula(Aluno aluno, Semestre semestre, List<Matricula> matriculas);
}
