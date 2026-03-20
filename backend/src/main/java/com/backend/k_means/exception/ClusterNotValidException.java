package com.backend.k_means.exception;

public class ClusterNotValidException extends RuntimeException {
    public ClusterNotValidException(String message) {
        super(message);
    }
}
