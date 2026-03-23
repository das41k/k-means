import api from './axiosConfig';
import {
    AuthRequest,
    AuthResponse,
    UploadDatasetRequest,
    DatasetResponse,
    ClusterRequest,
    ClusterResult,
    UserResponse,
} from '../types';

// ============= AUTH =============
export const register = (data: AuthRequest): Promise<string> =>
    api.post('/auth/register', data).then(res => res.data);

export const login = (data: AuthRequest): Promise<AuthResponse> =>
    api.post('/auth/login', data).then(res => res.data);

// ============= DATASET =============
export const uploadDataset = (data: UploadDatasetRequest): Promise<DatasetResponse> =>
    api.post('/datasets/upload', data).then(res => res.data);

// ============= CLUSTERING =============
export const performClustering = (data: ClusterRequest): Promise<ClusterResult> =>
    api.post('/clusters', data).then(res => res.data);

export const saveCluster = (data: ClusterResult): Promise<string> =>
    api.post('/clusters/save', data).then(res => res.data);

export const getClusterById = (id: number): Promise<ClusterResult> =>
    api.get(`/clusters/${id}`).then(res => res.data);

export const deleteCluster = (id: number): Promise<string> =>
    api.delete(`/clusters/${id}`).then(res => res.data);

// ============= USER =============
export const getUserByUsername = (username: string): Promise<UserResponse> =>
    api.get(`/users/${username}`).then(res => res.data);