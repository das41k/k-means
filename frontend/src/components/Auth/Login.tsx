import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
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

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ username, password });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data || 'Неверный логин или пароль');
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
                    <Title>Добро пожаловать</Title>
                    <Subtitle>Войдите в свой аккаунт</Subtitle>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Логин"
                            type="text"
                            placeholder="Введите ваш логин"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            icon={<FiUser size={20} />}
                            required
                            error={error && !username ? error : undefined}
                        />

                        <Input
                            label="Пароль"
                            type="password"
                            placeholder="Введите ваш пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<FiLock size={20} />}
                            required
                            error={error && !password ? error : undefined}
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
                            <FiLogIn style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Войти
                        </Button>
                    </form>

                    <LinkWrapper>
                        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                    </LinkWrapper>
                </Card>
            </motion.div>
        </Container>
    );
};

export default Login;