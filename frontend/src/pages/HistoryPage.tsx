import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import HistoryList from '../components/History/HistoryList';
import ClusterResultView from '../components/History/ClusterResultView';

const Container = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background.main};
`;

const Content = styled.main`
    max-width: 1400px;
    margin: 0 auto;
    padding: 32px;
`;

const HistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [viewingClusterId, setViewingClusterId] = useState<number | null>(null);

    const handleViewCluster = (clusterId: number) => {
        setViewingClusterId(clusterId);
    };

    const handleBack = () => {
        setViewingClusterId(null);
    };

    const handleDeleteSuccess = () => {
        // Если удалили кластер, который сейчас просматриваем, возвращаемся к списку
        if (viewingClusterId) {
            setViewingClusterId(null);
        }
    };

    return (
        <Container>
            <Header />
            <Content>
                {viewingClusterId ? (
                    <ClusterResultView
                        clusterId={viewingClusterId}
                        onBack={handleBack}
                        onDelete={handleDeleteSuccess}
                    />
                ) : (
                    <HistoryList
                        onViewCluster={handleViewCluster}
                        onDeleteSuccess={handleDeleteSuccess}
                    />
                )}
            </Content>
        </Container>
    );
};

export default HistoryPage;