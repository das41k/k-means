package com.backend.k_means.service;

import com.backend.k_means.dto.ClusterRequest;
import com.backend.k_means.dto.ClusterResult;
import com.backend.k_means.exception.DatasetNotFoundException;
import com.backend.k_means.exception.InvalidColumnForCluster;
import com.backend.k_means.model.Dataset;
import com.backend.k_means.model.Point;
import com.backend.k_means.repository.DatasetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClusterService {

    private final DatasetRepository datasetRepository;
    private final KMeansService kMeansService;

    public ClusterResult performClustering(ClusterRequest request) {
        log.info("Кластеризация датасета ID: {}, колонки: {}, k={}",
                request.getDatasetId(), request.getColumns(), request.getCountK());

        // 1. Получаем данные
        Dataset dataset = getDataset(request.getDatasetId());
        List<Map<String, Object>> rawData = dataset.getDataJson();

        // 2. Подготавливаем точки
        List<Point> points = convertToPoints(rawData, request.getColumns());

        // 3. Запускаем кластеризацию
        KMeansService.KMeansResult result = kMeansService.cluster(points, request.getCountK(), 100);

        // 4. Формируем результат
        return buildClusterResponse(request, rawData, result);
    }

    private Dataset getDataset(Long datasetId) {
        return datasetRepository.findById(datasetId)
                .orElseThrow(() -> new DatasetNotFoundException(datasetId));
    }

    private List<Point> convertToPoints(List<Map<String, Object>> rawData, List<String> columns) {
        List<Point> points = new ArrayList<>();

        for (int i = 0; i < rawData.size(); i++) {
            Point point = createPointFromRow(rawData.get(i), columns, i);
            points.add(point);
        }

        return points;
    }

    private Point createPointFromRow(Map<String, Object> row, List<String> columns, int rowIndex) {
        List<Double> coordinates = extractCoordinates(row, columns, rowIndex);
        return new Point(coordinates, rowIndex);
    }

    private List<Double> extractCoordinates(Map<String, Object> row, List<String> columns, int rowIndex) {
        List<Double> coordinates = new ArrayList<>();

        for (String column : columns) {
            Double value = extractNumericValue(row, column, rowIndex);
            coordinates.add(value);
        }

        return coordinates;
    }

    private Double extractNumericValue(Map<String, Object> row, String column, int rowIndex) {
        Object value = row.get(column);

        validateNotNull(value, column, rowIndex);
        validateIsNumber(value, column, rowIndex);

        return ((Number) value).doubleValue();
    }

    private void validateNotNull(Object value, String column, int rowIndex) {
        if (value == null) {
            throw new InvalidColumnForCluster(
                    String.format("Строка %d, колонка '%s': значение null", rowIndex + 1, column)
            );
        }
    }

    private void validateIsNumber(Object value, String column, int rowIndex) {
        if (!(value instanceof Number)) {
            throw new InvalidColumnForCluster(
                    String.format("Строка %d, колонка '%s': нечисловое значение '%s'",
                            rowIndex + 1, column, value)
            );
        }
    }

    private ClusterResult buildClusterResponse(
            ClusterRequest request,
            List<Map<String, Object>> rawData,
            KMeansService.KMeansResult result) {

        List<Map<String, Object>> clusteredData = enrichDataWithClusters(rawData, result.getPoints());
        List<ClusterResult.ClusterStats> stats = calculateStatistics(result.getPoints(), rawData, request.getColumns());

        return new ClusterResult(
                request.getDatasetId(),
                request.getCountK(),
                request.getColumns(),
                result.getFinalCentroids(),
                clusteredData,
                stats
        );
    }

    private List<Map<String, Object>> enrichDataWithClusters(
            List<Map<String, Object>> rawData,
            List<Point> points) {

        List<Map<String, Object>> enrichedData = new ArrayList<>();

        for (int i = 0; i < rawData.size(); i++) {
            Map<String, Object> enrichedRow = enrichRowWithCluster(rawData.get(i), points.get(i));
            enrichedData.add(enrichedRow);
        }

        return enrichedData;
    }

    private Map<String, Object> enrichRowWithCluster(Map<String, Object> row, Point point) {
        Map<String, Object> enrichedRow = new HashMap<>(row);
        enrichedRow.put("clusterId", point.getClusterId());
        return enrichedRow;
    }

    private List<ClusterResult.ClusterStats> calculateStatistics(
            List<Point> points,
            List<Map<String, Object>> rawData,
            List<String> columns) {

        Map<Integer, List<Point>> pointsByCluster = groupPointsByCluster(points);
        List<ClusterResult.ClusterStats> stats = new ArrayList<>();

        for (Map.Entry<Integer, List<Point>> entry : pointsByCluster.entrySet()) {
            ClusterResult.ClusterStats clusterStat = calculateClusterStat(entry, rawData, columns);
            stats.add(clusterStat);
        }

        return stats;
    }

    private Map<Integer, List<Point>> groupPointsByCluster(List<Point> points) {
        return points.stream()
                .collect(Collectors.groupingBy(Point::getClusterId));
    }

    private ClusterResult.ClusterStats calculateClusterStat(
            Map.Entry<Integer, List<Point>> entry,
            List<Map<String, Object>> rawData,
            List<String> columns) {

        Integer clusterId = entry.getKey();
        List<Point> clusterPoints = entry.getValue();

        List<Map<String, Object>> clusterRows = extractClusterRows(clusterPoints, rawData);
        Map<String, DoubleSummaryStatistics> columnStats = calculateColumnStats(clusterRows, columns);

        return buildClusterStat(clusterId, clusterRows.size(), columnStats, columns);
    }

    private List<Map<String, Object>> extractClusterRows(
            List<Point> clusterPoints,
            List<Map<String, Object>> rawData) {

        Set<Integer> rowIndices = extractRowIndices(clusterPoints);

        return rawData.stream()
                .filter(row -> rowIndices.contains(rawData.indexOf(row)))
                .collect(Collectors.toList());
    }

    private Set<Integer> extractRowIndices(List<Point> clusterPoints) {
        return clusterPoints.stream()
                .map(Point::getRowIndex)
                .collect(Collectors.toSet());
    }

    private Map<String, DoubleSummaryStatistics> calculateColumnStats(
            List<Map<String, Object>> rows,
            List<String> columns) {

        Map<String, DoubleSummaryStatistics> stats = new HashMap<>();

        for (String column : columns) {
            DoubleSummaryStatistics columnStat = calculateColumnStat(rows, column);
            stats.put(column, columnStat);
        }

        return stats;
    }

    private DoubleSummaryStatistics calculateColumnStat(List<Map<String, Object>> rows, String column) {
        return rows.stream()
                .mapToDouble(row -> ((Number) row.get(column)).doubleValue())
                .summaryStatistics();
    }

    private ClusterResult.ClusterStats buildClusterStat(
            Integer clusterId,
            int size,
            Map<String, DoubleSummaryStatistics> columnStats,
            List<String> columns) {

        Map<String, Double> means = extractMeans(columnStats, columns);
        Map<String, Double> mins = extractMins(columnStats, columns);
        Map<String, Double> maxs = extractMaxs(columnStats, columns);

        return new ClusterResult.ClusterStats(clusterId, size, means, mins, maxs);
    }

    private Map<String, Double> extractMeans(
            Map<String, DoubleSummaryStatistics> columnStats,
            List<String> columns) {

        Map<String, Double> means = new HashMap<>();
        for (String column : columns) {
            means.put(column, columnStats.get(column).getAverage());
        }
        return means;
    }

    private Map<String, Double> extractMins(
            Map<String, DoubleSummaryStatistics> columnStats,
            List<String> columns) {

        Map<String, Double> mins = new HashMap<>();
        for (String column : columns) {
            mins.put(column, columnStats.get(column).getMin());
        }
        return mins;
    }

    private Map<String, Double> extractMaxs(
            Map<String, DoubleSummaryStatistics> columnStats,
            List<String> columns) {

        Map<String, Double> maxs = new HashMap<>();
        for (String column : columns) {
            maxs.put(column, columnStats.get(column).getMax());
        }
        return maxs;
    }
}