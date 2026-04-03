import React, { useState } from 'react';
import styled from 'styled-components';
import { performClustering, saveCluster } from '../../api/endpoints';
import { ClusterResult } from '../../types';
import Button from '../common/Button';
import { FiSend, FiSave } from 'react-icons/fi';

const Container = styled.div`
    background: ${({ theme }) => theme.colors.background.card};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 32px;
    margin-bottom: 32px;
    box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h3`
    margin-bottom: 24px;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const Section = styled.div`
    margin-bottom: 24px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const ColumnsGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
`;

const ColumnCheckbox = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: ${({ theme }) => `${theme.colors.primary.light}08`};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    cursor: pointer;
    transition: all ${({ theme }) => theme.animation.transition};

    &:hover {
        background: ${({ theme }) => `${theme.colors.primary.light}15`};
    }

    input {
        cursor: pointer;
    }
`;

const SliderContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
`;

const Slider = styled.input`
    flex: 1;
    min-width: 200px;
    height: 4px;
    -webkit-appearance: none;
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
    outline: none;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        background: ${({ theme }) => theme.colors.primary.light};
        border-radius: 50%;
        cursor: pointer;
        transition: all ${({ theme }) => theme.animation.transition};

        &:hover {
            transform: scale(1.2);
        }
    }
`;

const KValue = styled.span`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary.light};
    background: ${({ theme }) => `${theme.colors.primary.light}10`};
    padding: 8px 20px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 24px;
`;

const ResultContainer = styled.div`
    margin-top: 32px;
    padding: 24px;
    background: ${({ theme }) => `${theme.colors.primary.light}08`};
    border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ResultTitle = styled.h4`
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
`;

const StatCard = styled.div`
    background: white;
    padding: 16px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    text-align: center;
`;

const ClusterId = styled.div`
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary.light};
    margin-bottom: 8px;
`;

const ClusterCount = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const SaveButton = styled(Button)`
    margin-top: 16px;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 14px;
    margin-bottom: 16px;
    
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary.light};
    }
`;

// Функция для склонения слова "точка"
const getPointsDeclension = (count: number): string => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return 'точек';
    }

    if (lastDigit === 1) {
        return 'точка';
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'точки';
    }

    return 'точек';
};

interface ClusterParamsProps {
    datasetId: number;
    headers: string[];
    onClusterSuccess?: (result: ClusterResult) => void;
    onSaveSuccess?: () => void;
}

const ClusterParams: React.FC<ClusterParamsProps> = ({
                                                         datasetId,
                                                         headers,
                                                         onClusterSuccess,
                                                         onSaveSuccess
                                                     }) => {
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [k, setK] = useState(3);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ClusterResult | null>(null);
    const [saving, setSaving] = useState(false);
    const [clusterName, setClusterName] = useState('');

    const handleColumnToggle = (column: string) => {
        setSelectedColumns(prev =>
            prev.includes(column)
                ? prev.filter(c => c !== column)
                : [...prev, column]
        );
    };

    const handleClusterize = async () => {
        if (selectedColumns.length === 0) {
            alert('Выберите хотя бы одну колонку для кластеризации');
            return;
        }

        setLoading(true);
        try {
            const response = await performClustering({
                datasetId,
                columns: selectedColumns,
                countK: k
            });
            setResult(response);
            if (onClusterSuccess) onClusterSuccess(response);
            setClusterName(`cluster_k${k}_${new Date().toLocaleDateString()}`);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Ошибка кластеризации');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!result) return;
        if (!clusterName.trim()) {
            alert('Введите название кластеризации');
            return;
        }

        setSaving(true);
        try {
            await saveCluster({
                ...result,
                name: clusterName
            });
            alert('Кластеризация сохранена в историю!');
            if (onSaveSuccess) onSaveSuccess();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Ошибка сохранения');
        } finally {
            setSaving(false);
        }
    };

    // Сортируем кластеры по ID для правильного порядка
    const sortedStats = result?.clusterStats ? [...result.clusterStats].sort((a, b) => a.clusterId - b.clusterId) : [];

    return (
        <Container>
            <Title>⚙️ Параметры кластеризации</Title>

            <Section>
                <Label>📊 Выберите колонки для кластеризации:</Label>
                <ColumnsGrid>
                    {headers.map(header => (
                        <ColumnCheckbox key={header}>
                            <input
                                type="checkbox"
                                checked={selectedColumns.includes(header)}
                                onChange={() => handleColumnToggle(header)}
                            />
                            {header}
                        </ColumnCheckbox>
                    ))}
                </ColumnsGrid>
                {selectedColumns.length === 0 && (
                    <small style={{ color: '#ef4444' }}>
                        ⚠️ Выберите хотя бы одну колонку
                    </small>
                )}
            </Section>

            <Section>
                <Label>🎯 Количество кластеров (k):</Label>
                <SliderContainer>
                    <Slider
                        type="range"
                        min={2}
                        max={10}
                        value={k}
                        onChange={(e) => setK(parseInt(e.target.value))}
                    />
                    <KValue>{k}</KValue>
                </SliderContainer>
            </Section>

            <ButtonGroup>
                <Button
                    onClick={handleClusterize}
                    isLoading={loading}
                    disabled={selectedColumns.length === 0}
                    variant="primary"
                >
                    <FiSend style={{ marginRight: '8px' }} />
                    Запустить кластеризацию
                </Button>
            </ButtonGroup>

            {result && (
                <ResultContainer>
                    <ResultTitle>📈 Результаты кластеризации</ResultTitle>

                    <StatsGrid>
                        {sortedStats.map(stat => (
                            <StatCard key={stat.clusterId}>
                                <ClusterId>Кластер {stat.clusterId + 1}</ClusterId>
                                <ClusterCount>
                                    {stat.count} {getPointsDeclension(stat.count)}
                                </ClusterCount>
                            </StatCard>
                        ))}
                    </StatsGrid>

                    <Input
                        type="text"
                        placeholder="Название кластеризации"
                        value={clusterName}
                        onChange={(e) => setClusterName(e.target.value)}
                    />

                    <SaveButton
                        onClick={handleSave}
                        isLoading={saving}
                        variant="secondary"
                    >
                        <FiSave size={18} style={{ marginLeft: '-4px', marginRight: '5px', marginBottom: '-2px' }} />
                        Сохранить в историю
                    </SaveButton>
                </ResultContainer>
            )}
        </Container>
    );
};

export default ClusterParams;