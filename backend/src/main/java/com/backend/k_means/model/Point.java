package com.backend.k_means.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Point {
    private List<Double> coordinates;
    private Integer clusterId;
    private Integer rowIndex;

    public Point(List<Double> coordinates, Integer rowIndex) {
        this.coordinates = coordinates;
        this.rowIndex = rowIndex;
        this.clusterId = -1;  // -1 значит еще не кластеризован
    }
}