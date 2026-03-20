package com.backend.k_means.exception;

public class ClusterIsNotHaveUserException extends RuntimeException {
    public ClusterIsNotHaveUserException(String message) {
        super(message);
    }
}
