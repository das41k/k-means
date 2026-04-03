import styled from 'styled-components';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    animate?: boolean;
}

const StyledCard = styled(motion.div)`
    background: ${({ theme }) => theme.colors.background.card};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 32px;
    box-shadow: ${({ theme }) => theme.shadows.xl};
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
`;

const Card: React.FC<CardProps> = ({ children, animate = true }) => {
    return (
        <StyledCard
            initial={animate ? { opacity: 0, y: 30 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {children}
        </StyledCard>
    );
};

export default Card;