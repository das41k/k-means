package com.backend.k_means.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String username;
    private List<ClusterUser> clustersByUser;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClusterUser {
        private Long clusterId;
        private String clusterName;
        private Integer k;
    }
}
