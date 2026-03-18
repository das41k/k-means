package com.backend.k_means.dto;

import com.backend.k_means.model.Dataset;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DatasetResponse {
    private Long id;
    private String name;
    private List<String> headers;
    private Integer rowCount;
    private LocalDateTime createdAt;

    public static DatasetResponse fromEntity(Dataset dataset) {
        DatasetResponse dto = new DatasetResponse();
        dto.setId(dataset.getId());
        dto.setName(dataset.getName());
        dto.setHeaders(List.of(dataset.getHeaders()));
        dto.setRowCount(dataset.getRowCount());
        dto.setCreatedAt(dataset.getCreatedAt());
        return dto;
    }
}