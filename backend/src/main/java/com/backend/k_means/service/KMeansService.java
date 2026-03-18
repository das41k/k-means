package com.backend.k_means.service;

import com.backend.k_means.model.Point;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Service
public class KMeansService {

    public KMeansResult cluster(List<Point> points, int k, int maxIterations) {
        log.info("Запуск K-means: {} точек, k={}", points.size(), k);

        if (points.size() < k) {
            throw new IllegalArgumentException("Точек меньше чем кластеров");
        }

        List<List<Double>> centroids = initializeCentroids(points, k);

        List<List<Double>> previousCentroids;
        int iteration = 0;
        boolean changed;

        do {
            // 2. Назначить каждую точку ближайшему центроиду
            assignPointsToClusters(points, centroids);

            // 3. Пересчитать центроиды
            previousCentroids = deepCopy(centroids);
            centroids = recalculateCentroids(points, centroids.size());

            // 4. Проверить, изменились ли центроиды
            changed = hasCentroidsChanged(previousCentroids, centroids);
            iteration++;

            log.debug("Итерация {}: центроиды изменились: {}", iteration, changed);

        } while (changed && iteration < maxIterations);

        log.info("Кластеризация завершена за {} итераций", iteration);

        return new KMeansResult(points, centroids);
    }

    private List<List<Double>> initializeCentroids(List<Point> points, int k) {
        List<List<Double>> centroids = new ArrayList<>();
        Random random = new Random();

        // Случайно выбираем k различных точек
        Set<Integer> selectedIndices = new HashSet<>();
        while (selectedIndices.size() < k) {
            int index = random.nextInt(points.size());
            if (selectedIndices.add(index)) {
                centroids.add(new ArrayList<>(points.get(index).getCoordinates()));
            }
        }

        return centroids;
    }

    private void assignPointsToClusters(List<Point> points, List<List<Double>> centroids) {
        for (Point point : points) {
            double minDistance = Double.MAX_VALUE;
            int closestCluster = -1;

            for (int i = 0; i < centroids.size(); i++) {
                double distance = euclideanDistance(point.getCoordinates(), centroids.get(i));
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCluster = i;
                }
            }

            point.setClusterId(closestCluster);
        }
    }

    private List<List<Double>> recalculateCentroids(List<Point> points, int k) {
        List<List<Double>> newCentroids = new ArrayList<>();

        for (int clusterId = 0; clusterId < k; clusterId++) {
            // Собираем все точки этого кластера
            int finalClusterId = clusterId;
            List<Point> clusterPoints = points.stream()
                    .filter(p -> p.getClusterId() == finalClusterId)
                    .collect(Collectors.toList());

            if (clusterPoints.isEmpty()) {
                // Если кластер пуст, оставляем случайную точку
                Random random = new Random();
                newCentroids.add(new ArrayList<>(points.get(random.nextInt(points.size())).getCoordinates()));
                continue;
            }

            // Вычисляем среднее по каждой координате
            int dimensions = clusterPoints.get(0).getCoordinates().size();
            List<Double> centroid = new ArrayList<>();

            for (int dim = 0; dim < dimensions; dim++) {
                final int dimension = dim;
                double sum = clusterPoints.stream()
                        .mapToDouble(p -> p.getCoordinates().get(dimension))
                        .sum();
                centroid.add(sum / clusterPoints.size());
            }

            newCentroids.add(centroid);
        }

        return newCentroids;
    }

    private double euclideanDistance(List<Double> a, List<Double> b) {
        double sum = 0;
        for (int i = 0; i < a.size(); i++) {
            sum += Math.pow(a.get(i) - b.get(i), 2);
        }
        return Math.sqrt(sum);
    }

    private boolean hasCentroidsChanged(List<List<Double>> oldCentroids, List<List<Double>> newCentroids) {
        for (int i = 0; i < oldCentroids.size(); i++) {
            for (int j = 0; j < oldCentroids.get(i).size(); j++) {
                if (Math.abs(oldCentroids.get(i).get(j) - newCentroids.get(i).get(j)) > 0.001) {
                    return true;
                }
            }
        }
        return false;
    }

    private List<List<Double>> deepCopy(List<List<Double>> original) {
        List<List<Double>> copy = new ArrayList<>();
        for (List<Double> list : original) {
            copy.add(new ArrayList<>(list));
        }
        return copy;
    }

    // Внутренний класс для результата
    public static class KMeansResult {
        private final List<Point> points;
        private final List<List<Double>> finalCentroids;

        public KMeansResult(List<Point> points, List<List<Double>> finalCentroids) {
            this.points = points;
            this.finalCentroids = finalCentroids;
        }

        public List<Point> getPoints() { return points; }
        public List<List<Double>> getFinalCentroids() { return finalCentroids; }
    }
}