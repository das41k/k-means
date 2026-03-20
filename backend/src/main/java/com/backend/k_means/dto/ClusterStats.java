package com.backend.k_means.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClusterStats {
    private Integer clusterId;
    private Integer count;  // количество точек
    private Map<String, Double> means;  // средние значения по колонкам
    private Map<String, Double> mins;
    private Map<String, Double> maxs;
}