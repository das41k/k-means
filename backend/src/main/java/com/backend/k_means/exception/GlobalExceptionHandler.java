package com.backend.k_means.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCsvDataException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCsv(InvalidCsvDataException e) {
        log.error("Ошибка валидации CSV: {}", e.getMessage());

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Invalid CSV data");
        response.put("message", e.getMessage());

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(DatasetNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(DatasetNotFoundException e) {
        log.error("Датасет не найден: {}", e.getMessage());

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.NOT_FOUND.value());
        response.put("error", "Not Found");
        response.put("message", e.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(InvalidColumnForCluster.class)
    public ResponseEntity<Map<String, Object>> handleInvalidColumnForCluster(InvalidColumnForCluster e) {
        log.error("Ошибка кластеризации: {}", e.getMessage());
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Invalid Column for cluster");
        response.put("message", e.getMessage());

        return ResponseEntity.badRequest().body(response);
    }
}