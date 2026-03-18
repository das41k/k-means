package com.backend.k_means.dto;

import lombok.Data;

import java.util.List;

@Data
public class ClusterRequest {
    private Long datasetId;
    private List<String> columns;
    private Integer countK;
}
