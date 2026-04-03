import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
    background: ${({ theme }) => theme.colors.background.card};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 24px;
    margin-bottom: 32px;
    box-shadow: ${({ theme }) => theme.shadows.md};
    overflow-x: auto;
`;

const Title = styled.h3`
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
`;

const Th = styled.th`
    text-align: left;
    padding: 12px;
    background: ${({ theme }) => `${theme.colors.primary.light}10`};
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
`;

const Td = styled.td`
    padding: 10px 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const Tr = styled.tr`
    &:hover {
        background: ${({ theme }) => `${theme.colors.primary.light}05`};
    }
`;

const ScrollWrapper = styled.div`
    max-height: 400px;
    overflow-y: auto;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

interface DatasetTableProps {
    data: Record<string, any>[];
    headers: string[];
}

const DatasetTable: React.FC<DatasetTableProps> = ({ data, headers }) => {
    if (!data || data.length === 0) return null;

    return (
        <TableContainer>
            <Title>📋 Предпросмотр данных ({data.length} строк)</Title>
            <ScrollWrapper>
                <StyledTable>
                    <thead>
                    <tr>
                        {headers.map(header => (
                            <Th key={header}>{header}</Th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, idx) => (
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
            </ScrollWrapper>
        </TableContainer>
    );
};

export default DatasetTable;