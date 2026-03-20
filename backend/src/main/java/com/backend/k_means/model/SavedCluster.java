package com.backend.k_means.model;

import com.backend.k_means.dto.ClusterStats;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "saved_clusters")
@Data
@NoArgsConstructor
public class SavedCluster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "dataset_id", nullable = false)
    private Dataset dataset;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @Column(name = "count_k", nullable = false)
    private Integer k;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private List<String> columns;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private List<List<Double>> finalCentroids;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private List<Map<String, Object>> clusteredData;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private List<ClusterStats> clusterStats;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

}
