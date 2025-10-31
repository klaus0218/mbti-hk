import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Container, Button } from '../../styles/theme';

const NotFoundWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.gradientLight};
`;

const NotFoundContent = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['4xl']};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  max-width: 500px;
  width: 100%;
`;

const NotFoundCode = styled.h1`
  font-size: 6rem;
  font-weight: ${({ theme }) => theme.typography.extrabold};
  background: ${({ theme }) => theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 4rem;
  }
`;

const NotFoundTitle = styled.h2`
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const NotFoundMessage = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const NotFound = () => {
  return (
    <NotFoundWrapper>
      <Container>
        <NotFoundContent>
          <NotFoundCode>404</NotFoundCode>
          <NotFoundTitle>Page Not Found</NotFoundTitle>
          <NotFoundMessage>
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or the URL might be incorrect.
          </NotFoundMessage>
          <ActionButtons>
            <Button as={Link} to="/" variant="primary">
              <FontAwesomeIcon icon={faHome} />
              Go Home
            </Button>
            <Button onClick={() => window.history.back()} variant="secondary">
              <FontAwesomeIcon icon={faArrowLeft} />
              Go Back
            </Button>
          </ActionButtons>
        </NotFoundContent>
      </Container>
    </NotFoundWrapper>
  );
};

export default NotFound; 
