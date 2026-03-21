package com.backend.k_means.exception;

public class ClusterNotFoundException extends RuntimeException {
    public ClusterNotFoundException(String message) {
        super(message);
    }
}
