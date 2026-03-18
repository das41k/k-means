package com.backend.k_means.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class UploadDatasetRequest {
    private String name;
    private List<String> headers;
    private List<Map<String, Object>> data;
}