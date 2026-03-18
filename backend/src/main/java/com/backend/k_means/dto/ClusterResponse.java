package com.backend.k_means.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClusterResponse {
    private Long datasetId;
    private Integer k;
    private List<String> columns;

    // Центроиды финальные
    private List<List<Double>> finalCentroids;

    // Для каждой строки - какой кластер
    private List<Map<String, Object>> clusteredData;  // исходные данные + clusterId

    // Статистика по кластерам
    private List<ClusterStats> clusterStats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClusterStats {
        private Integer clusterId;
        private Integer count;  // количество точек
        private Map<String, Double> means;  // средние значения по колонкам
        private Map<String, Double> mins;
        private Map<String, Double> maxs;
    }
}