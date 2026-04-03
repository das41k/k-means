import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiEye, FiTrash2, FiClock } from 'react-icons/fi';
import { getUserByUsername, deleteCluster } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';

const Container = styled.div`
    background: ${({ theme }) => theme.colors.background.card};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 24px;
    box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h2`
    font-size: 24px;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const Subtitle = styled.p`
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 24px;
    font-size: 14px;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 48px;
    color: ${({ theme }) => theme.colors.text.light};
    font-size: 16px;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
`;

const Card = styled.div`
    background: ${({ theme }) => `${theme.colors.primary.light}05`};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: 20px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    transition: all ${({ theme }) => theme.animation.transition};
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.md};
        border-color: ${({ theme }) => theme.colors.primary.light};
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
`;

const ClusterName = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary.light};
    margin-bottom: 4px;
`;

const ClusterK = styled.span`
    display: inline-block;
    background: ${({ theme }) => `${theme.colors.primary.light}15`};
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.primary.light};
`;

const DateInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.text.light};
    margin-bottom: 16px;
`;

const CardActions = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActionButton = styled.button<{ variant?: 'view' | 'delete' }>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all ${({ theme }) => theme.animation.transition};
    
    ${({ variant, theme }) => {
    if (variant === 'delete') {
        return `
                background: ${theme.colors.error}10;
                color: ${theme.colors.error};
                &:hover {
                    background: ${theme.colors.error}20;
                }
            `;
    }
    return `
            background: ${theme.colors.primary.light}10;
            color: ${theme.colors.primary.light};
            &:hover {
                background: ${theme.colors.primary.light}20;
            }
        `;
}}
`;

const LoadingState = styled.div`
    text-align: center;
    padding: 48px;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

interface ClusterUser {
    clusterId: number;
    clusterName: string;
    k: number;
}

interface HistoryListProps {
    onViewCluster: (clusterId: number) => void;
    onDeleteSuccess?: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ onViewCluster, onDeleteSuccess }) => {
    const [clusters, setClusters] = useState<ClusterUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; clusterId: number | null; clusterName: string }>({
        isOpen: false,
        clusterId: null,
        clusterName: '',
    });
    const { user } = useAuth();

    const fetchHistory = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const response = await getUserByUsername(user);
            setClusters(response.clustersByUser || []);
        } catch (err: any) {
            console.error('Ошибка загрузки истории:', err);
            alert('Не удалось загрузить историю');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const handleDelete = async () => {
        if (!deleteConfirm.clusterId) return;

        try {
            await deleteCluster(deleteConfirm.clusterId);
            alert('Кластеризация удалена');
            await fetchHistory();
            if (onDeleteSuccess) onDeleteSuccess();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Ошибка удаления');
        } finally {
            setDeleteConfirm({ isOpen: false, clusterId: null, clusterName: '' });
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <Container>
                <LoadingState>Загрузка истории...</LoadingState>
            </Container>
        );
    }

    return (
        <>
            <Container>
                <Title>📜 История кластеризаций</Title>
                <Subtitle>
                    Сохраненные результаты K-Means кластеризации
                </Subtitle>

                {clusters.length === 0 ? (
                    <EmptyState>
                        <FiClock size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>У вас пока нет сохраненных кластеризаций</p>
                        <p style={{ fontSize: '12px', marginTop: '8px' }}>
                            Выполните кластеризацию на главной странице и сохраните результат
                        </p>
                    </EmptyState>
                ) : (
                    <Grid>
                        {clusters.map((cluster) => (
                            <Card key={cluster.clusterId}>
                                <CardHeader>
                                    <div>
                                        <ClusterName>{cluster.clusterName}</ClusterName>
                                        <ClusterK>k = {cluster.k}</ClusterK>
                                    </div>
                                </CardHeader>

                                <DateInfo>
                                    <FiClock size={14} />
                                    {/* Временная метка, пока нет поля createdAt в ответе */}
                                    <span>Сохранено</span>
                                </DateInfo>

                                <CardActions>
                                    <ActionButton
                                        variant="view"
                                        onClick={() => onViewCluster(cluster.clusterId)}
                                    >
                                        <FiEye size={16} />
                                        Просмотреть
                                    </ActionButton>
                                    <ActionButton
                                        variant="delete"
                                        onClick={() => setDeleteConfirm({
                                            isOpen: true,
                                            clusterId: cluster.clusterId,
                                            clusterName: cluster.clusterName,
                                        })}
                                    >
                                        <FiTrash2 size={16} />
                                        Удалить
                                    </ActionButton>
                                </CardActions>
                            </Card>
                        ))}
                    </Grid>
                )}
            </Container>

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Удалить кластеризацию?"
                message={`Вы уверены, что хотите удалить "${deleteConfirm.clusterName}"? Это действие нельзя отменить.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, clusterId: null, clusterName: '' })}
            />
        </>
    );
};

export default HistoryList;