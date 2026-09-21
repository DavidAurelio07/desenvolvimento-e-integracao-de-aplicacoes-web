package com.example.SecureLoginPUC.exception;

public class SendEmailException extends RuntimeException {
    public SendEmailException(String message) {
        super(message);
    }

    public SendEmailException(String message, Throwable cause) {
        super(message, cause);
    }
}