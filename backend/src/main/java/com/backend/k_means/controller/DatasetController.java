package com.backend.k_means.controller;

import com.backend.k_means.dto.DatasetResponse;
import com.backend.k_means.dto.UploadDatasetRequest;
import com.backend.k_means.model.Dataset;
import com.backend.k_means.repository.DatasetRepository;
import com.backend.k_means.service.DatasetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/api/datasets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3333")
public class DatasetController {

    private final DatasetRepository datasetRepository;
    private final DatasetService datasetService;

    @PostMapping("/upload")
    public ResponseEntity<DatasetResponse> uploadDataset(@RequestBody UploadDatasetRequest request) {
        log.info("Загрузка файла: {}", request.getName());

        datasetService.validate(request);

        Dataset dataset = new Dataset();
        dataset.setName(request.getName());
        dataset.setHeaders(request.getHeaders().toArray(new String[0]));
        dataset.setDataJson(request.getData());
        dataset.setRowCount(request.getData().size());
        dataset.setCreatedAt(LocalDateTime.now());

        Dataset saved = datasetRepository.save(dataset);
        log.info("Датасет сохранен с ID: {}", saved.getId());

        return ResponseEntity.ok(DatasetResponse.fromEntity(saved));
    }
}
