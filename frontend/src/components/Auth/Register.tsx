import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiUserPlus, FiCheck } from 'react-icons/fi';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
`;

const Title = styled.h2`
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    background: ${({ theme }) => theme.colors.primary.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
`;

const Subtitle = styled.p`
    text-align: center;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 32px;
    font-size: 14px;
`;

const LinkWrapper = styled.div`
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.secondary};

    a {
        font-weight: 600;
    }
`;

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        if (password.length < 4) {
            setError('Пароль должен содержать минимум 4 символа');
            return;
        }

        setLoading(true);

        try {
            await register({ username, password });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: '460px' }}
            >
                <Card>
                    <Title>Создать аккаунт</Title>
                    <Subtitle>Присоединяйтесь к нам</Subtitle>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Логин"
                            type="text"
                            placeholder="Придумайте логин"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            icon={<FiUser size={20} />}
                            required
                        />

                        <Input
                            label="Пароль"
                            type="password"
                            placeholder="Придумайте пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<FiLock size={20} />}
                            required
                        />

                        <Input
                            label="Подтвердите пароль"
                            type="password"
                            placeholder="Повторите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={<FiCheck size={20} />}
                            required
                            error={confirmPassword && password !== confirmPassword ? 'Пароли не совпадают' : undefined}
                        />

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    padding: '12px',
                                    background: '#fee2e2',
                                    borderRadius: '8px',
                                    marginBottom: '20px',
                                    color: '#dc2626',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            isLoading={loading}
                            variant="primary"
                        >
                            <FiUserPlus style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Зарегистрироваться
                        </Button>
                    </form>

                    <LinkWrapper>
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </LinkWrapper>
                </Card>
            </motion.div>
        </Container>
    );
};

export default Register;