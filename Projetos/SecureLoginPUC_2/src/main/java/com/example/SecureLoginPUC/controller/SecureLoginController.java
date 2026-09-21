package com.example.SecureLoginPUC.controller;

import com.example.SecureLoginPUC.exception.SendEmailException;
import com.example.SecureLoginPUC.service.PasswordResetService;
import com.example.SecureLoginPUC.service.SendEmailService;
import com.example.SecureLoginPUC.service.UserService;
import com.example.SecureLoginPUC.validation.PasswordPolicy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Controller
public class SecureLoginController {

    private static final Logger log = LoggerFactory.getLogger(SecureLoginController.class);

    private static final int MAX_EMAIL_LENGTH = 254;

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*\\.[A-Za-z]{2,}$");

    private final SendEmailService sendEmailService;
    private final UserService userService;
    private final PasswordResetService passwordResetService;
    private final String baseUrl;

    public SecureLoginController(
            SendEmailService sendEmailService,
            UserService userService,
            PasswordResetService passwordResetService,
            @Value("${app.base-url:http://localhost:8080}") String baseUrl) {

        this.sendEmailService = sendEmailService;
        this.userService = userService;
        this.passwordResetService = passwordResetService;
        this.baseUrl = baseUrl.endsWith("/")
                ? baseUrl.substring(0, baseUrl.length() - 1)
                : baseUrl;
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/home")
    public String home() {
        return "home";
    }

    @GetMapping("/error")
    public String error() {
        return "error";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin";
    }

    /*
     * ============================================================
     * REGISTRO
     * ============================================================
     */

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @PostMapping("/register")
    public String handleRegister(
            @RequestParam(value = "nome", defaultValue = "") String nome,
            @RequestParam(value = "email", defaultValue = "") String email,
            @RequestParam(value = "cpf", defaultValue = "") String cpf,
            @RequestParam(value = "rg", defaultValue = "") String rg,
            @RequestParam(value = "endereco", defaultValue = "") String endereco,
            @RequestParam(value = "instituicao", defaultValue = "") String instituicao,
            @RequestParam(value = "senha", defaultValue = "") String senha,
            @RequestParam(value = "confirmarSenha", defaultValue = "") String confirmarSenha,
            Model model) {

        String nomeLimpo = nome.trim();
        String emailNormalizado = email.trim().toLowerCase();
        String cpfLimpo = cpf.trim();
        String rgLimpo = rg.trim();
        String enderecoLimpo = endereco.trim();
        String instituicaoLimpa = instituicao.trim();

        List<String> erros = new ArrayList<>();

        // Campos obrigatórios vazios (o "required" do HTML é fácil de burlar)
        if (nomeLimpo.isEmpty() || emailNormalizado.isEmpty() || cpfLimpo.isEmpty()
                || rgLimpo.isEmpty() || enderecoLimpo.isEmpty() || instituicaoLimpa.isEmpty()
                || senha.isEmpty() || confirmarSenha.isEmpty()) {
            erros.add("Preencha todos os campos obrigatórios.");
        }

        // E-mail inválido / duplicado
        if (!emailNormalizado.isEmpty()) {
            if (emailNormalizado.length() > MAX_EMAIL_LENGTH
                    || !EMAIL_PATTERN.matcher(emailNormalizado).matches()) {
                erros.add("Informe um e-mail válido.");
            } else if (userService.exists(emailNormalizado)) {
                erros.add("Já existe uma conta com esse e-mail.");
            }
        }

        // Requisitos da senha
        if (!senha.isEmpty()) {
            String erroSenha = PasswordPolicy.validate(senha);
            if (erroSenha != null) {
                erros.add(erroSenha);
            }
        }

        // Senhas incompatíveis
        if (!senha.isEmpty() && !confirmarSenha.isEmpty() && !senha.equals(confirmarSenha)) {
            erros.add("As senhas não coincidem.");
        }

        if (!erros.isEmpty()) {
            // Volta para o formulário com os erros e mantém o que foi digitado (menos as senhas)
            model.addAttribute("erros", erros);
            model.addAttribute("nome", nomeLimpo);
            model.addAttribute("email", emailNormalizado);
            model.addAttribute("cpf", cpfLimpo);
            model.addAttribute("rg", rgLimpo);
            model.addAttribute("endereco", enderecoLimpo);
            model.addAttribute("instituicao", instituicaoLimpa);
            return "register";
        }

        userService.createUser(emailNormalizado, senha, nomeLimpo);

        return "redirect:/login?registered=true";
    }

    /*
     * ============================================================
     * RECUPERAÇÃO DE SENHA - PASSO 1: PEDIR O LINK
     * ============================================================
     */

    @GetMapping("/recoverpassword")
    public String recoverpassword() {
        return "recoverpassword";
    }

    @PostMapping("/recoverpassword")
    public String handleRecoverPassword(@RequestParam("email") String email) {

        String emailNormalizado = email.trim().toLowerCase();

        if (userService.exists(emailNormalizado)) {

            String token = passwordResetService.createToken(emailNormalizado);
            String link = baseUrl + "/resetpassword?token=" + token;

            try {
                sendEmailService.sendEmail(
                        emailNormalizado,
                        "Recuperação de senha",
                        buildRecoveryEmail(link));

            } catch (SendEmailException e) {
                // A causa real (senha de app errada, SMTP fora do ar...) aparece aqui, no console
                log.error("Falha ao enviar o e-mail de recuperação para {}", emailNormalizado, e);
            }
        }

        // Resposta idêntica exista o e-mail ou não, para não revelar quais e-mails estão cadastrados
        return "redirect:/recoverpassword?sent=true";
    }

    /*
     * ============================================================
     * RECUPERAÇÃO DE SENHA - PASSO 2: DEFINIR A NOVA SENHA
     * ============================================================
     */

    @GetMapping("/resetpassword")
    public String resetPassword(
            @RequestParam(value = "token", required = false) String token,
            Model model) {

        model.addAttribute("token", token);
        model.addAttribute("tokenValido", passwordResetService.validate(token).isPresent());

        return "resetpassword";
    }

    @PostMapping("/resetpassword")
    public String handleResetPassword(
            @RequestParam("token") String token,
            @RequestParam("senha") String senha,
            @RequestParam("confirmarSenha") String confirmarSenha,
            Model model) {

        if (passwordResetService.validate(token).isEmpty()) {
            model.addAttribute("tokenValido", false);
            return "resetpassword";
        }

        String erro = PasswordPolicy.validate(senha);

        if (erro == null && !senha.equals(confirmarSenha)) {
            erro = "As senhas não coincidem.";
        }

        if (erro != null) {
            model.addAttribute("token", token);
            model.addAttribute("tokenValido", true);
            model.addAttribute("erro", erro);
            return "resetpassword";
        }

        // Consome o token (uso único) e só então troca a senha
        Optional<String> email = passwordResetService.consume(token);

        if (email.isEmpty()) {
            model.addAttribute("tokenValido", false);
            return "resetpassword";
        }

        userService.updatePassword(email.get(), senha);

        return "redirect:/login?reset=true";
    }

    private String buildRecoveryEmail(String link) {
        return """
                <h1>Recuperação de senha</h1>
                <p>Você solicitou a recuperação da sua senha.</p>
                <p><a href="%s">Clique aqui para definir uma nova senha</a></p>
                <p>Este link vale por %d minutos e só pode ser usado uma vez.</p>
                <p>Se você não fez essa solicitação, ignore este e-mail: sua senha continua a mesma.</p>
                """.formatted(link, passwordResetService.getValidityMinutes());
    }
}
