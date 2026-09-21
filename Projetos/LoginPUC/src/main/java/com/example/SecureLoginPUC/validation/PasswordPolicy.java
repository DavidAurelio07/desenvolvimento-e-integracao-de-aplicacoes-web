package com.example.SecureLoginPUC.validation;

import java.nio.charset.StandardCharsets;

/*
 * ============================================================
 * REGRA DE SENHA
 * ============================================================
 *
 * Fica em um lugar só: o registro e a redefinição de senha
 * usam a mesma regra. Para mudar a política, edite aqui.
 *
 * Regra atual:
 * - mínimo de 8 caracteres
 * - pelo menos uma letra
 * - pelo menos um número
 * - máximo de 72 bytes (limite do BCrypt)
 */
public final class PasswordPolicy {

    public static final int MIN_LENGTH = 8;
    public static final int MAX_BYTES = 72;

    private PasswordPolicy() {
    }

    /*
     * Retorna a mensagem de erro, ou null se a senha é válida.
     */
    public static String validate(String senha) {

        if (senha == null || senha.length() < MIN_LENGTH || !hasLetterAndDigit(senha)) {
            return "A senha deve ter no mínimo " + MIN_LENGTH
                    + " caracteres, com pelo menos uma letra e um número.";
        }

        if (senha.getBytes(StandardCharsets.UTF_8).length > MAX_BYTES) {
            return "A senha deve ter no máximo " + MAX_BYTES + " caracteres.";
        }

        return null;
    }

    private static boolean hasLetterAndDigit(String senha) {

        boolean letra = false;
        boolean numero = false;

        for (char c : senha.toCharArray()) {
            if (Character.isLetter(c)) {
                letra = true;
            } else if (Character.isDigit(c)) {
                numero = true;
            }
        }

        return letra && numero;
    }
}
