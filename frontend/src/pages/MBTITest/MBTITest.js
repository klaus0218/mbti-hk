import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faUser, faEnvelope, faClock, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Container, Section, Card, Button } from '../../styles/theme';
import { useSession } from '../../contexts/SessionContext';

const TestPage = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
`;

const TestSection = styled(Section)`
  padding-top: ${({ theme }) => theme.spacing['3xl']};
  padding-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

const TestCard = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const TestIcon = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TestTitle = styled.h1`
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TestDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.typography.lg};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const InfoList = styled.div`
  text-align: left;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.gray600};
`;

const InfoIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.lg};
  width: 24px;
  text-align: center;
`;

const Form = styled.form`
  text-align: left;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-weight: ${({ theme }) => theme.typography.medium};
  color: ${({ theme }) => theme.colors.gray700};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.base};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const OptionalText = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.typography.sm};
`;

const StartButton = styled(Button)`
  font-size: ${({ theme }) => theme.typography.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
  width: 100%;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.error}10;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const MBTITest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const navigate = useNavigate();
  const { createSession, isLoading, error } = useSession();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartTest = async (e) => {
    e.preventDefault();
    
    try {
      const response = await createSession(formData);
      // Navigate to first section - we'll assume section 1 exists, or Questions component will handle redirect
      navigate(`/questions/${response.sessionId}`);
    } catch (error) {
      console.error('Failed to start test:', error);
    }
  };

  return (
    <TestPage>
      <TestSection>
        <Container>
          <TestCard
            as={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TestIcon>
              <FontAwesomeIcon icon={faQuestionCircle} />
            </TestIcon>
            
            <TestTitle>Ready to Discover Your Personality Type?</TestTitle>
            
            <TestDescription>
              Take our comprehensive MBTI assessment to gain valuable insights into your 
              personality preferences, strengths, and potential career paths.
            </TestDescription>

            <InfoList>
              <InfoItem>
                <InfoIcon>
                  <FontAwesomeIcon icon={faClock} />
                </InfoIcon>
                <span>Takes approximately 10-15 minutes to complete</span>
              </InfoItem>
              <InfoItem>
                <InfoIcon>
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </InfoIcon>
                <span>16 carefully designed questions</span>
              </InfoItem>
              <InfoItem>
                <InfoIcon>
                  <FontAwesomeIcon icon={faUser} />
                </InfoIcon>
                <span>Personalized results and insights</span>
              </InfoItem>
            </InfoList>

            <Form onSubmit={handleStartTest}>
              <FormGroup>
                <Label htmlFor="name">
                  Name <OptionalText>(optional)</OptionalText>
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">
                  Email <OptionalText>(optional)</OptionalText>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </FormGroup>

              <StartButton 
                type="submit" 
                disabled={isLoading}
                variant="primary"
                size="lg"
              >
                <FontAwesomeIcon icon={faPlay} />
                {isLoading ? 'Starting Test...' : 'Start Test'}
              </StartButton>
            </Form>

            {isLoading && (
              <LoadingText>
                Preparing your personalized assessment...
              </LoadingText>
            )}

            {error && (
              <ErrorText>
                {error}
              </ErrorText>
            )}
          </TestCard>
        </Container>
      </TestSection>
    </TestPage>
  );
};

export default MBTITest; 
