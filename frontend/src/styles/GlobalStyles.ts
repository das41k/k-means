import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        background: linear-gradient(135deg, #f5f7fa 0%, #f8fafc 100%);
        color: ${({ theme }) => theme.colors.text.primary};
        min-height: 100vh;
    }

    a {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.primary.light};
        transition: ${({ theme }) => theme.animation.transition};
        
        &:hover {
            color: ${({ theme }) => theme.colors.primary.dark};
        }
    }

    button {
        cursor: pointer;
    }

    /* Анимация для появления элементов */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes gradientShift {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
`;