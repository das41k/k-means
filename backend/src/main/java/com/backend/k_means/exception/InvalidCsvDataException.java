package com.backend.k_means.exception;

public class InvalidCsvDataException extends RuntimeException {
    public InvalidCsvDataException(String message) {
        super(message);
    }
}
