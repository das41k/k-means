import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/common/Header';
import DatasetUpload from '../components/Dataset/DatasetUpload';
import DatasetTable from '../components/Dataset/DatasetTable';
import ClusterParams from '../components/Clustering/ClusterParams';
import ClusterStatsDetails from '../components/Clustering/ClusterStatsDetails';

const Container = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background.main};
`;

const Content = styled.main`
    max-width: 1400px;
    margin: 0 auto;
    padding: 32px;
`;

const Title = styled.h1`
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 8px;
`;

const Subtitle = styled.p`
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 32px;
    font-size: 16px;
`;

const UploadedInfo = styled.div`
    margin-bottom: 24px;
    padding: 16px;
    background: ${({ theme }) => `${theme.colors.primary.light}10`};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ClearButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.error};
    cursor: pointer;
    font-size: 18px;
    padding: 4px 8px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    transition: all ${({ theme }) => theme.animation.transition};
    
    &:hover {
        background: ${({ theme }) => `${theme.colors.error}10`};
    }
`;

interface UploadedDataset {
    id: number;
    headers: string[];
    data: Record<string, any>[];
    fileName: string;
}

const Dashboard: React.FC = () => {
    const [uploadedDataset, setUploadedDataset] = useState<UploadedDataset | null>(null);
    const [clusterResult, setClusterResult] = useState<any | null>(null);

    const handleUploadSuccess = (datasetId: number, headers: string[], data: Record<string, any>[], fileName: string) => {
        setUploadedDataset({ id: datasetId, headers, data, fileName });
        setClusterResult(null); // Сбрасываем результаты при новой загрузке
    };

    const handleClear = () => {
        if (window.confirm('Очистить все данные? Прогресс будет потерян.')) {
            setUploadedDataset(null);
            setClusterResult(null);
        }
    };

    const handleClusterSuccess = (result: any) => {
        setClusterResult(result);
    };

    return (
        <Container>
            <Header />
            <Content>
                <Title>📊 Кластеризация данных</Title>
                <Subtitle>
                    Загрузите CSV файл, выберите параметры и запустите K-Means кластеризацию
                </Subtitle>

                <DatasetUpload onUploadSuccess={handleUploadSuccess} />

                {uploadedDataset && (
                    <>
                        <UploadedInfo>
                            <span>📁 Текущий датасет: <strong>{uploadedDataset.fileName}</strong></span>
                            <ClearButton onClick={handleClear} title="Очистить всё">✕</ClearButton>
                        </UploadedInfo>

                        <DatasetTable data={uploadedDataset.data} headers={uploadedDataset.headers} />

                        <ClusterParams
                            datasetId={uploadedDataset.id}
                            headers={uploadedDataset.headers}
                            onClusterSuccess={handleClusterSuccess}
                        />
                    </>
                )}

                {clusterResult && clusterResult.clusterStats && (
                    <ClusterStatsDetails
                        stats={clusterResult.clusterStats}
                        columns={clusterResult.columns}
                    />
                )}
            </Content>
        </Container>
    );
};

export default Dashboard;