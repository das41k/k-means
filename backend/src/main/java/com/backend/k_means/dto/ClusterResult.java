package com.backend.k_means.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClusterResult {
    private Long datasetId;
    private String name;
    private Integer k;
    private List<String> columns;

    // Центроиды финальные
    private List<List<Double>> finalCentroids;

    // Для каждой строки - какой кластер
    private List<Map<String, Object>> clusteredData;

    // Статистика по кластерам
    private List<ClusterStats> clusterStats;
}