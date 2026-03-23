import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
    isLoading?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    disabled?: boolean;
}

const StyledButton = styled(motion.button)<{
    $variant: string;
    $fullWidth: boolean;
}>`
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
    cursor: pointer;
    transition: all ${({ theme }) => theme.animation.transition};
    position: relative;
    overflow: hidden;

    ${({ $variant, theme }) => {
        switch ($variant) {
            case 'primary':
                return `
                    background: ${theme.colors.primary.gradient};
                    color: white;
                    box-shadow: ${theme.shadows.md};
                    
                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: ${theme.shadows.lg};
                    }
                    
                    &:active {
                        transform: translateY(0);
                    }
                `;
            case 'secondary':
                return `
                    background: ${theme.colors.background.card};
                    color: ${theme.colors.primary.light};
                    border: 1px solid ${theme.colors.border};
                    
                    &:hover {
                        background: ${theme.colors.border};
                        transform: translateY(-1px);
                    }
                `;
            case 'outline':
                return `
                    background: transparent;
                    color: ${theme.colors.primary.light};
                    border: 2px solid ${theme.colors.primary.light};
                    
                    &:hover {
                        background: ${theme.colors.primary.light};
                        color: white;
                    }
                `;
            default:
                return '';
        }
    }}

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
`;

const Button: React.FC<ButtonProps> = ({
                                           variant = 'primary',
                                           fullWidth = false,
                                           isLoading = false,
                                           children,
                                           onClick,
                                           type = 'button',
                                           disabled,
                                       }) => {
    return (
        <StyledButton
            $variant={variant}
            $fullWidth={fullWidth}
            onClick={onClick}
            type={type}
            disabled={disabled || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {isLoading ? 'Загрузка...' : children}
        </StyledButton>
    );
};

export default Button;