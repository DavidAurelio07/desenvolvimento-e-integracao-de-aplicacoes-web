package com.example.SecureLoginPUC.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/*
 * ============================================================
 * TOKENS DE RECUPERAÇÃO DE SENHA
 * ============================================================
 *
 * Gera e valida os tokens enviados por e-mail.
 *
 * - O token é aleatório (SecureRandom), impossível de adivinhar.
 * - Expira depois de alguns minutos.
 * - Só pode ser usado UMA vez.
 * - Fica em memória (assim como os usuários do
 *   InMemoryUserDetailsManager): reiniciar a aplicação
 *   invalida todos os links pendentes.
 */
@Service
public class PasswordResetService {

    private record ResetToken(String email, Instant expiresAt) {
    }

    private final Map<String, ResetToken> tokens = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();
    private final long validityMinutes;

    public PasswordResetService(
            @Value("${app.password-reset.expiration-minutes:30}") long validityMinutes) {

        this.validityMinutes = validityMinutes;
    }

    public long getValidityMinutes() {
        return validityMinutes;
    }

    /*
     * Cria um token novo para o e-mail.
     * Tokens anteriores do mesmo e-mail deixam de valer.
     */
    public String createToken(String email) {

        removeExpired();
        tokens.values().removeIf(t -> t.email().equalsIgnoreCase(email));

        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        String token = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        tokens.put(token, new ResetToken(
                email,
                Instant.now().plus(Duration.ofMinutes(validityMinutes))));

        return token;
    }

    /*
     * Confere se o token existe e não expirou (sem consumir).
     * Retorna o e-mail dono do token.
     */
    public Optional<String> validate(String token) {

        if (token == null) {
            return Optional.empty();
        }

        ResetToken resetToken = tokens.get(token);

        if (resetToken == null) {
            return Optional.empty();
        }

        if (resetToken.expiresAt().isBefore(Instant.now())) {
            tokens.remove(token);
            return Optional.empty();
        }

        return Optional.of(resetToken.email());
    }

    /*
     * Valida E consome o token (uso único).
     * Retorna o e-mail dono do token.
     */
    public Optional<String> consume(String token) {

        if (token == null) {
            return Optional.empty();
        }

        ResetToken resetToken = tokens.remove(token);

        if (resetToken == null || resetToken.expiresAt().isBefore(Instant.now())) {
            return Optional.empty();
        }

        return Optional.of(resetToken.email());
    }

    private void removeExpired() {
        Instant now = Instant.now();
        tokens.values().removeIf(t -> t.expiresAt().isBefore(now));
    }
}
