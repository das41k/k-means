package com.backend.k_means.exception;

public class InvalidColumnForCluster extends RuntimeException {
    public InvalidColumnForCluster(String message) {
        super(message);
    }
}
