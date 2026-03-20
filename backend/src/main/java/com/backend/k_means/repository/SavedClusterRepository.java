package com.backend.k_means.repository;

import com.backend.k_means.model.SavedCluster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SavedClusterRepository extends JpaRepository<SavedCluster, Long> {
}
