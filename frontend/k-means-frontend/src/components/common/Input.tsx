import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface InputProps {
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
    error?: string;
    label?: string;
    required?: boolean;
}

const InputWrapper = styled.div`
    margin-bottom: 20px;
    width: 100%;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const InputContainer = styled.div<{ $hasError?: boolean }>`
    position: relative;
    display: flex;
    align-items: center;
    border: 2px solid ${({ $hasError, theme }) =>
    $hasError ? theme.colors.error : theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme }) => theme.colors.background.card};
    transition: all ${({ theme }) => theme.animation.transition};

    &:focus-within {
        border-color: ${({ theme }) => theme.colors.primary.light};
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
`;

const StyledInput = styled.input`
    flex: 1;
    padding: 12px 16px;
    border: none;
    background: transparent;
    font-size: 16px;
    outline: none;
    color: ${({ theme }) => theme.colors.text.primary};

    &::placeholder {
        color: ${({ theme }) => theme.colors.text.light};
    }
`;

const IconWrapper = styled.div`
    padding-left: 12px;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.text.light};
`;

const ErrorMessage = styled(motion.div)`
    margin-top: 6px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.error};
`;

const Input: React.FC<InputProps> = ({
                                         type = 'text',
                                         placeholder,
                                         value,
                                         onChange,
                                         icon,
                                         error,
                                         label,
                                         required,
                                     }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <InputWrapper>
            {label && (
                <Label>
                    {label}
                    {required && <span style={{ color: '#ef4444' }}> *</span>}
                </Label>
            )}
            <InputContainer $hasError={!!error}>
                {icon && <IconWrapper>{icon}</IconWrapper>}
                <StyledInput
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </InputContainer>
            {error && (
                <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {error}
                </ErrorMessage>
            )}
        </InputWrapper>
    );
};

export default Input;