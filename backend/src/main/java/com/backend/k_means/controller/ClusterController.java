package com.backend.k_means.controller;

import com.backend.k_means.dto.ClusterRequest;
import com.backend.k_means.dto.ClusterResult;
import com.backend.k_means.model.SavedCluster;
import com.backend.k_means.service.ClusterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/clusters")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3333")
public class ClusterController {

    private final ClusterService clusterService;

    @PostMapping
    public ResponseEntity<ClusterResult> clusterization(@RequestBody ClusterRequest request) {
        log.info("POST /cluster - datasetId: {}, columns: {}, k={}",
                request.getDatasetId(), request.getColumns(), request.getCountK());

        ClusterResult response = clusterService.performClustering(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/save")
    public ResponseEntity<?> savedCluster(@RequestBody ClusterResult request) {
        log.info("POST /cluster/save - datasetId: {}, columns: {}, k= {}",
                request.getDatasetId(), request.getColumns(), request.getK());
        clusterService.saveCluster(request);
        return ResponseEntity.ok("Кластер был успешно сохранен");
    }
}