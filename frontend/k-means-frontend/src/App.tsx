import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

const DashboardPage = () => <div style={{ padding: '2rem', textAlign: 'center' }}>Главная страница (скоро)</div>;
const HistoryPage = () => <div style={{ padding: '2rem', textAlign: 'center' }}>История (скоро)</div>;

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Загрузка...</div>;
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        } />
                        <Route path="/history" element={
                            <PrivateRoute>
                                <HistoryPage />
                            </PrivateRoute>
                        } />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;