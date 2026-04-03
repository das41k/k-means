import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const Dialog = styled.div`
    background: ${({ theme }) => theme.colors.background.card};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 24px;
    max-width: 400px;
    width: 90%;
    box-shadow: ${({ theme }) => theme.shadows.xl};
    animation: slideUp 0.3s ease;
    
    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

const Title = styled.h3`
    font-size: 20px;
    margin-bottom: 12px;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const Message = styled.p`
    margin-bottom: 24px;
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: 1.5;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
    justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
    padding: 10px 20px;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    transition: all ${({ theme }) => theme.animation.transition};
    
    ${({ variant, theme }) => {
    if (variant === 'primary') {
        return `
                background: ${theme.colors.error};
                color: white;
                &:hover {
                    background: #dc2626;
                    transform: translateY(-1px);
                }
            `;
    }
    return `
            background: ${theme.colors.border};
            color: ${theme.colors.text.secondary};
            &:hover {
                background: ${theme.colors.text.light};
                color: ${theme.colors.text.primary};
                transform: translateY(-1px);
            }
        `;
}}
`;

interface ConfirmDialogProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
                                                         isOpen,
                                                         title = 'Подтверждение',
                                                         message,
                                                         onConfirm,
                                                         onCancel,
                                                         confirmText = 'Удалить',
                                                         cancelText = 'Отмена',
                                                     }) => {
    if (!isOpen) return null;

    // Закрытие по клику на оверлей
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <Overlay onClick={handleOverlayClick}>
            <Dialog>
                <Title>{title}</Title>
                <Message>{message}</Message>
                <ButtonGroup>
                    <Button onClick={onCancel}>{cancelText}</Button>
                    <Button variant="primary" onClick={onConfirm}>{confirmText}</Button>
                </ButtonGroup>
            </Dialog>
        </Overlay>
    );
};

export default ConfirmDialog;