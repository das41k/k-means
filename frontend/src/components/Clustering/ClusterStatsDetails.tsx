import React from 'react';
import styled from 'styled-components';
import { ClusterStats } from '../../types';

const Container = styled.div`
    background: ${({ theme }) => theme.colors.background.card};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 24px;
    margin-top: 24px;
    box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h4`
    margin-bottom: 20px;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 20px;
`;

const StatCard = styled.div`
    background: ${({ theme }) => `${theme.colors.primary.light}05`};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: 20px;
    border-left: 4px solid ${({ theme }) => theme.colors.primary.light};
`;

const ClusterHeader = styled.div`
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary.light};
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatSection = styled.div`
    margin-bottom: 16px;
`;

const StatLabel = styled.div`
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.light};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
`;

const MetricRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 13px;
`;

const MetricName = styled.span`
    color: ${({ theme }) => theme.colors.text.light};
`;

const MetricNumber = styled.span`
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.primary};
    font-family: 'Monaco', 'Menlo', monospace;
`;

const CountBadge = styled.div`
    display: inline-block;
    background: ${({ theme }) => `${theme.colors.primary.light}15`};
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary.light};
    margin-bottom: 12px;
`;

// Функция для форматирования чисел (убираем лишние нули)
const formatNumber = (value: number): string => {
    if (value === undefined || value === null) return '-';
    // Если число целое, показываем без десятичных знаков
    if (Number.isInteger(value)) {
        return value.toString();
    }
    // Убираем лишние нули в конце
    return parseFloat(value.toFixed(6)).toString();
};

interface ClusterStatsDetailsProps {
    stats: ClusterStats[];
    columns: string[];
}

const ClusterStatsDetails: React.FC<ClusterStatsDetailsProps> = ({ stats, columns }) => {
    if (!stats || stats.length === 0) return null;

    // Сортируем кластеры по ID для правильного порядка
    const sortedStats = [...stats].sort((a, b) => a.clusterId - b.clusterId);

    return (
        <Container>
            <Title>📊 Детальная статистика по кластерам</Title>
            <StatsGrid>
                {sortedStats.map(stat => (
                    <StatCard key={stat.clusterId}>
                        <ClusterHeader>
                            Кластер {stat.clusterId + 1}  {/* 👈 Нумерация с 1 */}
                            <CountBadge style={{ marginLeft: '12px' }}>
                                {stat.count} {stat.count === 1 ? 'точка' :
                                stat.count >= 2 && stat.count <= 4 ? 'точки' : 'точек'}
                            </CountBadge>
                        </ClusterHeader>

                        <StatSection>
                            <StatLabel>📈 Средние значения (means)</StatLabel>
                            {columns.map(col => (
                                <MetricRow key={`means-${stat.clusterId}-${col}`}>
                                    <MetricName>{col}:</MetricName>
                                    <MetricNumber>
                                        {stat.means[col] !== undefined
                                            ? formatNumber(stat.means[col])
                                            : '-'}
                                    </MetricNumber>
                                </MetricRow>
                            ))}
                        </StatSection>

                        <StatSection>
                            <StatLabel>📉 Минимальные значения (mins)</StatLabel>
                            {columns.map(col => (
                                <MetricRow key={`mins-${stat.clusterId}-${col}`}>
                                    <MetricName>{col}:</MetricName>
                                    <MetricNumber>
                                        {stat.mins[col] !== undefined
                                            ? formatNumber(stat.mins[col])
                                            : '-'}
                                    </MetricNumber>
                                </MetricRow>
                            ))}
                        </StatSection>

                        <StatSection>
                            <StatLabel>📈 Максимальные значения (maxs)</StatLabel>
                            {columns.map(col => (
                                <MetricRow key={`maxs-${stat.clusterId}-${col}`}>
                                    <MetricName>{col}:</MetricName>
                                    <MetricNumber>
                                        {stat.maxs[col] !== undefined
                                            ? formatNumber(stat.maxs[col])
                                            : '-'}
                                    </MetricNumber>
                                </MetricRow>
                            ))}
                        </StatSection>
                    </StatCard>
                ))}
            </StatsGrid>
        </Container>
    );
};

export default ClusterStatsDetails;