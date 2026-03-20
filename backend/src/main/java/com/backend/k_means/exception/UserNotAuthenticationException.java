package com.backend.k_means.exception;

public class UserNotAuthenticationException extends RuntimeException {
    public UserNotAuthenticationException(String message) {
        super(message);
    }
}
