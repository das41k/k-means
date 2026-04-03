import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiUser, FiHome, FiClock } from 'react-icons/fi';

const HeaderContainer = styled.header`
    background: ${({ theme }) => theme.colors.background.card};
    backdrop-filter: blur(10px);
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: 0 32px;
    position: sticky;
    top: 0;
    z-index: 100;
`;

const Nav = styled.nav`
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
`;

const Logo = styled(Link)`
    font-size: 24px;
    font-weight: 700;
    background: ${({ theme }) => theme.colors.primary.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
    
    &:hover {
        opacity: 0.8;
    }
`;

const NavLinks = styled.div`
    display: flex;
    gap: 32px;
    align-items: center;
`;

const NavLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: 500;
    transition: all ${({ theme }) => theme.animation.transition};
    padding: 8px 12px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    
    &:hover {
        color: ${({ theme }) => theme.colors.primary.light};
        background: ${({ theme }) => `${theme.colors.primary.light}10`};
    }
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding-left: 24px;
    border-left: 1px solid ${({ theme }) => theme.colors.border};
`;

const Username = styled.span`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 500;
`;

const LogoutButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: 500;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    transition: all ${({ theme }) => theme.animation.transition};
    
    &:hover {
        color: ${({ theme }) => theme.colors.error};
        background: ${({ theme }) => `${theme.colors.error}10`};
    }
`;

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <HeaderContainer>
            <Nav>
                <Logo to="/">
                    🧬 K-Means
                </Logo>

                <NavLinks>
                    <NavLink to="/">
                        <FiHome size={18} />
                        Главная
                    </NavLink>
                    <NavLink to="/history">
                        <FiClock size={18} />
                        История
                    </NavLink>

                    <UserInfo>
                        <Username>
                            <FiUser size={18} />
                            {user}
                        </Username>
                        <LogoutButton onClick={handleLogout}>
                            <FiLogOut size={18} />
                            Выйти
                        </LogoutButton>
                    </UserInfo>
                </NavLinks>
            </Nav>
        </HeaderContainer>
    );
};

export default Header;