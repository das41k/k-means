import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Временные заглушки для других страниц
const DashboardPage = () => <div style={{ padding: '2rem' }}>Главная страница (будет позже)</div>;
const HistoryPage = () => <div style={{ padding: '2rem' }}>История кластеризаций (будет позже)</div>;

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div style={{ padding: '2rem' }}>Загрузка...</div>;
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
    return (
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
    );
};

export default App;