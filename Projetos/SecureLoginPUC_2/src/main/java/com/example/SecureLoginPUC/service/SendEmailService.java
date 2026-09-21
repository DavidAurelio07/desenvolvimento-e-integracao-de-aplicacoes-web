package com.example.SecureLoginPUC.service;

import com.example.SecureLoginPUC.exception.SendEmailException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class SendEmailService {

    private final JavaMailSender mailSender;

    // Remetente = mesma conta usada para autenticar no SMTP (o Gmail exige isso)
    private final String from;

    public SendEmailService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}") String from) {

        this.mailSender = mailSender;
        this.from = from;
    }

    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true,
                            "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            helper.setFrom(from);

            mailSender.send(message);

        } catch (MailException | MessagingException e) {
            throw new SendEmailException(
                    "Falha ao enviar e-mail: " + e.getMessage(), e);
        }
    }
}
