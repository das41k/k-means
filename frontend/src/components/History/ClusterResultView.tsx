import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { getClusterById, deleteCluster } from '../../api/endpoints';
import { ClusterResult } from '../../types';
import Button from '../common/Button';
import ClusterStatsDetails from '../Clustering/ClusterStatsDetails';
import ConfirmDialog from '../common/ConfirmDialog';

const Container = styled.div`
    background: ${({ theme }) => theme.colors.background.card};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 24px;
    box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
`;

const Title = styled.h2`
    font-size: 24px;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const Subtitle = styled.p`
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-top: 4px;
    font-size: 14px;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
`;

const BackButton = styled(Button)`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const DeleteButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    background: transparent;
    color: ${({ theme }) => theme.colors.error};
    border: 1px solid ${({ theme }) => theme.colors.error};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all ${({ theme }) => theme.animation.transition};

    &:hover {
        background: ${({ theme }) => theme.colors.error};
        color: white;
    }

    svg {
        display: block;
    }
`;

const LoadingState = styled.div`
    text-align: center;
    padding: 48px;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const InfoRow = styled.div`
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    padding: 16px;
    background: ${({ theme }) => `${theme.colors.primary.light}05`};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    flex-wrap: wrap;
`;

const InfoItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const InfoLabel = styled.span`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.text.light};
    text-transform: uppercase;
`;

const InfoValue = styled.span`
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary.light};
`;

// Новые стили для сетки таблиц по кластерам
const ClustersGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-top: 24px;
    margin-bottom: 24px;
    
    @media (max-width: 1200px) {
        grid-template-columns: 1fr;
    }
`;

const ClusterCard = styled.div`
    background: ${({ theme }) => theme.colors.background.card};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 20px;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    overflow: hidden;
`;

const ClusterHeader = styled.div<{ $clusterId: number }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid ${({ theme, $clusterId }) =>
    `hsl(${($clusterId * 60) % 360}, 70%, 50%)`};
`;

const ClusterTitle = styled.h4<{ $clusterId: number }>`
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme, $clusterId }) =>
    `hsl(${($clusterId * 60) % 360}, 70%, 50%)`};
    margin: 0;
`;

const ClusterCount = styled.span`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.secondary};
    background: ${({ theme }) => `${theme.colors.background.hover}80`};
    padding: 4px 8px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const TableWrapper = styled.div`
    overflow-x: auto;
    max-height: 400px;
    overflow-y: auto;
    
    /* Стилизация скроллбара */
    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    
    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.background.hover};
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.border};
        border-radius: 4px;
        
        &:hover {
            background: ${({ theme }) => theme.colors.text.light};
        }
    }
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    min-width: 400px;
`;

const Th = styled.th`
    text-align: left;
    padding: 8px 6px;
    background: ${({ theme }) => `${theme.colors.primary.light}10`};
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
    font-size: 12px;
    white-space: nowrap;
    
    &:first-child {
        padding-left: 8px;
    }
    
    &:last-child {
        padding-right: 8px;
    }
`;

const Td = styled.td`
    padding: 6px 6px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 12px;
    white-space: nowrap;
    
    &:first-child {
        padding-left: 8px;
    }
    
    &:last-child {
        padding-right: 8px;
    }
`;

const Tr = styled.tr`
    &:hover {
        background: ${({ theme }) => `${theme.colors.primary.light}05`};
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 40px;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 14px;
`;

interface ClusterResultViewProps {
    clusterId: number;
    onBack: () => void;
    onDelete?: () => void;
}

// Группировка данных по кластерам
const groupDataByCluster = (data: any[]) => {
    const grouped: { [key: number]: any[] } = {};
    data.forEach(item => {
        const clusterId = item.clusterId;
        if (!grouped[clusterId]) {
            grouped[clusterId] = [];
        }
        grouped[clusterId].push(item);
    });
    return grouped;
};

const ClusterResultView: React.FC<ClusterResultViewProps> = ({ clusterId, onBack, onDelete }) => {
    const [result, setResult] = useState<ClusterResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const fetchCluster = async () => {
            setLoading(true);
            try {
                const data = await getClusterById(clusterId);
                setResult(data);
            } catch (err: any) {
                alert(err.response?.data?.message || 'Ошибка загрузки кластеризации');
                onBack();
            } finally {
                setLoading(false);
            }
        };

        fetchCluster();
    }, [clusterId, onBack]);

    const handleDelete = async () => {
        try {
            await deleteCluster(clusterId);
            alert('Кластеризация удалена');
            if (onDelete) onDelete();
            onBack();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Ошибка удаления');
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <LoadingState>Загрузка результатов кластеризации...</LoadingState>
            </Container>
        );
    }

    if (!result) {
        return (
            <Container>
                <LoadingState>Кластеризация не найдена</LoadingState>
            </Container>
        );
    }

    // Группируем данные по кластерам
    const groupedData = result.clusteredData ? groupDataByCluster(result.clusteredData) : {};
    const clusterIds = Object.keys(groupedData).map(Number).sort((a, b) => a - b);
    const headers = result.columns;

    return (
        <>
            <Container>
                <Header>
                    <div>
                        <Title>{result.name || 'Результат кластеризации'}</Title>
                        <Subtitle>
                            Колонки: {result.columns.join(', ')}
                        </Subtitle>
                    </div>
                    <ButtonGroup>
                        <BackButton onClick={onBack} variant="secondary">
                            <FiArrowLeft size={18} style={{marginRight: '8px', marginBottom: '-3px' }} />
                            Назад к списку
                        </BackButton>
                        <DeleteButton onClick={() => setShowDeleteConfirm(true)} >
                            <FiTrash2 size={18} style={{marginLeft: '-3px', marginRight: '5px', marginBottom: '2px' }} />
                            Удалить
                        </DeleteButton>
                    </ButtonGroup>
                </Header>

                <InfoRow>
                    <InfoItem>
                        <InfoLabel>Количество кластеров (k)</InfoLabel>
                        <InfoValue>{result.k}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Количество точек</InfoLabel>
                        <InfoValue>{result.clusteredData?.length || 0}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Использованные колонки</InfoLabel>
                        <InfoValue>{result.columns.length}</InfoValue>
                    </InfoItem>
                </InfoRow>

                {/* Таблицы по кластерам в сетке */}
                {result.clusteredData && result.clusteredData.length > 0 && (
                    <ClustersGrid>
                        {clusterIds.map(clusterNum => {
                            const clusterData = groupedData[clusterNum];
                            return (
                                <ClusterCard key={clusterNum}>
                                    <ClusterHeader $clusterId={clusterNum}>
                                        <ClusterTitle $clusterId={clusterNum}>
                                            Кластер {clusterNum + 1}
                                        </ClusterTitle>
                                        <ClusterCount>
                                            {clusterData.length} записей
                                        </ClusterCount>
                                    </ClusterHeader>
                                    <TableWrapper>
                                        <StyledTable>
                                            <thead>
                                            <tr>
                                                {headers.map(header => (
                                                    <Th key={header}>{header}</Th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {clusterData.map((row, idx) => (
                                                <Tr key={idx}>
                                                    {headers.map(header => (
                                                        <Td key={header}>
                                                            {row[header]?.toString() ?? '-'}
                                                        </Td>
                                                    ))}
                                                </Tr>
                                            ))}
                                            </tbody>
                                        </StyledTable>
                                    </TableWrapper>
                                </ClusterCard>
                            );
                        })}
                    </ClustersGrid>
                )}

                {result.clusterStats && (
                    <ClusterStatsDetails
                        stats={result.clusterStats}
                        columns={result.columns}
                    />
                )}
            </Container>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Удалить кластеризацию?"
                message={`Вы уверены, что хотите удалить "${result.name}"? Это действие нельзя отменить.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
};

export default ClusterResultView;