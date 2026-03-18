package com.backend.k_means.controller;

import com.backend.k_means.dto.ClusterRequest;
import com.backend.k_means.dto.ClusterResponse;
import com.backend.k_means.service.ClusterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/cluster")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3333")
public class ClusterController {

    private final ClusterService clusterService;

    @PostMapping
    public ResponseEntity<ClusterResponse> cluster(@RequestBody ClusterRequest request) {
        log.info("POST /cluster - datasetId: {}, columns: {}, k={}",
                request.getDatasetId(), request.getColumns(), request.getCountK());

        ClusterResponse response = clusterService.performClustering(request);

        return ResponseEntity.ok(response);
    }
}