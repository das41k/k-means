package com.backend.k_means.exception;

public class DatasetNotFoundException extends RuntimeException {
    public DatasetNotFoundException(Long id) {
        super("Датасет с ID " + id + " не найден");
    }
}
