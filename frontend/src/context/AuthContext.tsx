import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/endpoints';
import { AuthRequest } from '../types';

interface AuthContextType {
    user: string | null;
    token: string | null;
    loading: boolean;
    login: (data: AuthRequest) => Promise<void>;
    register: (data: AuthRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Проверяем сохраненные данные при загрузке
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('username');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = async (data: AuthRequest) => {
        const response = await apiLogin(data);
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        setToken(response.token);
        setUser(response.username);
    };

    const register = async (data: AuthRequest) => {
        await apiRegister(data);
        // После регистрации автоматически логиним
        await login(data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout,
            isAuthenticated: !!token,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};