package com.backend.k_means.service;

import com.backend.k_means.dto.UploadDatasetRequest;
import com.backend.k_means.exception.InvalidCsvDataException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class DatasetService {

    public void validate(UploadDatasetRequest request) {
        log.debug("Начало валидации CSV данных");

        validateName(request.getName());
        validateHeaders(request.getHeaders());
        validateData(request.getData(), request.getHeaders());

        log.debug("Валидация успешно пройдена");
    }


    private void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new InvalidCsvDataException("Имя файла обязательно");
        }

        if (name.length() > 255) {
            throw new InvalidCsvDataException("Имя файла слишком длинное (макс. 255 символов)");
        }

        if (!name.toLowerCase().endsWith(".csv")) {
            throw new InvalidCsvDataException("Файл должен иметь расширение .csv");
        }
    }

    private void validateHeaders(List<String> headers) {
        if (headers == null || headers.isEmpty()) {
            throw new InvalidCsvDataException("Заголовки CSV обязательны");
        }

        for (String header : headers) {
            if (header == null || header.trim().isEmpty()) {
                throw new InvalidCsvDataException("Заголовок не может быть пустым");
            }
        }

        long uniqueCount = headers.stream().distinct().count();
        if (uniqueCount != headers.size()) {
            throw new InvalidCsvDataException("Заголовки не должны повторяться");
        }

    }

    private void validateData(List<Map<String, Object>> data, List<String> headers) {
        if (data == null || data.isEmpty()) {
            throw new InvalidCsvDataException("Данные CSV не могут быть пустыми");
        }
        int expectedColumns = headers.size();
        for (int i = 0; i < data.size(); i++) {
            Map<String, Object> row = data.get(i);
            // Проверяем количество колонок
            if (row.size() != expectedColumns) {
                throw new InvalidCsvDataException(
                        String.format("Строка %d содержит %d колонок, ожидалось %d",
                                i + 1, row.size(), expectedColumns)
                );
            }
            // Проверяем, что все ключи соответствуют заголовкам
            for (String header : headers) {
                if (!row.containsKey(header)) {
                    throw new InvalidCsvDataException(
                            String.format("В строке %d отсутствует колонка '%s'", i + 1, header)
                    );
                }
                Object value = row.get(header);
                validateDataType(header, value, i + 1);
            }
        }
    }

    private void validateDataType(String columnName, Object value, int rowNumber) {
        if (value == null) {
            return; // null допустим для любой колонки
        }

        // Проверяем тип значения
        if (value instanceof String) {
            log.trace("Колонка '{}', строка {}: тип String", columnName, rowNumber);

        } else if (value instanceof Boolean) {
            log.trace("Колонка '{}', строка {}: тип Boolean", columnName, rowNumber);

        } else if (value instanceof Integer) {
            log.trace("Колонка '{}', строка {}: тип Integer", columnName, rowNumber);

        } else if (value instanceof Double) {
            log.trace("Колонка '{}', строка {}: тип Double", columnName, rowNumber);

        }  else {
            // Неподдерживаемый тип
            throw new InvalidCsvDataException(
                    String.format("Строка %d, колонка '%s': неподдерживаемый тип данных '%s'. " +
                                    "Допустимы: String, Boolean, Integer, Double",
                            rowNumber, columnName, value.getClass().getSimpleName())
            );
        }
    }
}
