// ============= AUTH =============
export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    type: string;
}

// ============= DATASET =============
export interface UploadDatasetRequest {
    name: string;
    headers: string[];
    data: Record<string, any>[];  // List<Map<String, Object>>
}

export interface DatasetResponse {
    id: number;
    name: string;
    headers: string[];
    rowCount: number;
    createdAt: string;
}

// ============= CLUSTERING =============
export interface ClusterRequest {
    datasetId: number;
    columns: string[];
    countK: number;
}

export interface ClusterStats {
    clusterId: number;
    count: number;
    means: Record<string, number>;
    mins: Record<string, number>;
    maxs: Record<string, number>;
}

export interface ClusterResult {
    datasetId: number;
    name?: string;          // для сохранения
    k: number;
    columns: string[];
    finalCentroids: number[][];
    clusteredData: Record<string, any>[];  // каждая строка содержит clusterId
    clusterStats: ClusterStats[];
}

// ============= USER HISTORY =============
export interface ClusterUser {
    clusterId: number;
    clusterName: string;
    k: number;
}

export interface UserResponse {
    username: string;
    clustersByUser: ClusterUser[];
}