import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiCheck, FiX } from 'react-icons/fi';
import { uploadDataset } from '../../api/endpoints';
import Button from '../common/Button';

const UploadContainer = styled.div`
    background: ${({ theme }) => theme.colors.background.card};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 32px;
    margin-bottom: 32px;
    box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Dropzone = styled.div<{ $isDragActive: boolean }>`
    border: 2px dashed ${({ $isDragActive, theme }) =>
    $isDragActive ? theme.colors.primary.light : theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: 48px;
    text-align: center;
    cursor: pointer;
    transition: all ${({ theme }) => theme.animation.transition};
    background: ${({ $isDragActive, theme }) =>
    $isDragActive ? `${theme.colors.primary.light}08` : 'transparent'};

    &:hover {
        border-color: ${({ theme }) => theme.colors.primary.light};
        background: ${({ theme }) => `${theme.colors.primary.light}08`};
    }
`;

const FileInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24px;
    padding: 16px;
    background: ${({ theme }) => `${theme.colors.primary.light}08`};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const FileName = styled.span`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const SuccessMessage = styled.span`
    color: ${({ theme }) => theme.colors.success};
    display: flex;
    align-items: center;
    gap: 8px;
`;

const ErrorMessage = styled.span`
    color: ${({ theme }) => theme.colors.error};
    display: flex;
    align-items: center;
    gap: 8px;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 24px;
`;

interface DatasetUploadProps {
    onUploadSuccess: (datasetId: number, headers: string[], data: Record<string, any>[], fileName: string) => void;
}

const DatasetUpload: React.FC<DatasetUploadProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const parseCSV = (text: string): { headers: string[]; data: Record<string, any>[] } => {
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/["']/g, ''));

        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/["']/g, ''));
            const row: Record<string, any> = {};
            headers.forEach((header, idx) => {
                const val = values[idx];
                // Пробуем преобразовать в число, если возможно
                row[header] = isNaN(Number(val)) ? val : Number(val);
            });
            data.push(row);
        }

        return { headers, data };
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile && selectedFile.name.endsWith('.csv')) {
            setFile(selectedFile);
            setError(null);
            setSuccess(false);
        } else {
            setError('Пожалуйста, выберите файл с расширением .csv');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv']
        },
        maxFiles: 1
    });

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const text = await file.text();
            const { headers, data } = parseCSV(text);

            const response = await uploadDataset({
                name: file.name,
                headers: headers,
                data: data
            });

            setSuccess(true);
            onUploadSuccess(response.id, headers, data, file.name);

            // Сбрасываем файл через 2 секунды
            setTimeout(() => {
                setFile(null);
                setSuccess(false);
            }, 2000);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка загрузки файла');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFile(null);
        setError(null);
        setSuccess(false);
    };

    return (
        <UploadContainer>
            <h3>📁 Загрузить CSV файл</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
                Поддерживаются файлы с расширением .csv. Первая строка должна содержать заголовки колонок.
            </p>

            {!file ? (
                <Dropzone {...getRootProps()} $isDragActive={isDragActive}>
                    <input {...getInputProps()} />
                    <FiUpload size={48} style={{ marginBottom: '16px', color: '#94a3b8' }} />
                    {isDragActive ? (
                        <p>Отпустите файл для загрузки...</p>
                    ) : (
                        <>
                            <p>Перетащите CSV файл сюда или нажмите для выбора</p>
                            <small style={{ color: '#94a3b8' }}>поддерживаются только .csv файлы </small>
                        </>
                    )}
                </Dropzone>
            ) : (
                <>
                    <FileInfo>
                        <FileName>
                            <FiFile />
                            {file.name}
                        </FileName>
                        {success ? (
                            <SuccessMessage>
                                <FiCheck />
                                Загружено успешно!
                            </SuccessMessage>
                        ) : error ? (
                            <ErrorMessage>
                                <FiX />
                                {error}
                            </ErrorMessage>
                        ) : null}
                    </FileInfo>

                    <ButtonContainer>
                        <Button
                            onClick={handleUpload}
                            isLoading={loading}
                            variant="primary"
                        >
                            Загрузить
                        </Button>
                        <Button
                            onClick={handleCancel}
                            variant="secondary"
                            disabled={loading}
                        >
                            Отмена
                        </Button>
                    </ButtonContainer>
                </>
            )}
        </UploadContainer>
    );
};

export default DatasetUpload;