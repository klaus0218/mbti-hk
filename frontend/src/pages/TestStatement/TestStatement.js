import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Container, Section, Button } from '../../styles/theme';
import { useSession } from '../../contexts/SessionContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslations } from '../../locales';

const StatementPage = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
`;

const StatementSection = styled(Section)`
  padding-top: ${({ theme }) => theme.spacing['3xl']};
  padding-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

const StatementCard = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
`;

const Header = styled.div`
  background: ${({ theme }) => theme.colors.gradientPrimary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
`;

const HeaderTitle = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography['2xl']};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.xl};
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.lg};
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.gray700};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.base};
  }
`;

const InstructionsTitle = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.xl};
`;

const InstructionsList = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const InstructionItem = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.gray50};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray700};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.sm};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const RetrieveButton = styled(Button)`
  width: 100%;
  font-size: ${({ theme }) => theme.typography.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
  background: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.gray700};
  border: 2px solid ${({ theme }) => theme.colors.gray200};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    border-color: ${({ theme }) => theme.colors.gray300};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const StartButton = styled(Button)`
  width: 100%;
  font-size: ${({ theme }) => theme.typography.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.error}10;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  max-width: 500px;
  width: 100%;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.typography.xl};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.lg};
  color: ${({ theme }) => theme.colors.gray500};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    color: ${({ theme }) => theme.colors.gray700};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.base};
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
  }
`;

const ModalButton = styled(Button)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

// Add this helper function at the top of the file, outside the component
const transformResultData = (apiResult) => {
  const { mbtiType, typeInfo, scores, celebrities, recommendations, statistics, compatibility } = apiResult;
  
  // Transform scores from API format to component format
  const transformedScores = {
    EI: {
      E: scores.normalized.E,
      I: scores.normalized.I,
      color: '#8B5A3C'
    },
    SN: {
      S: scores.normalized.S,
      N: scores.normalized.N,
      color: '#8B5A3C'
    },
    TF: {
      T: scores.normalized.T,
      F: scores.normalized.F,
      color: '#8B5A3C'
    },
    JP: {
      J: scores.normalized.J,
      P: scores.normalized.P,
      color: '#8B5A3C'
    }
  };

  // Transform celebrities to expected format
  const transformedCelebrities = celebrities.map(celeb => ({
    ...celeb,
    initials: celeb.name.split(' ').map(n => n[0]).join('')
  }));

  // Mock population statistics that the Results component expects
  const mockPopulationStats = {
    totalPopulation: 3.4,
    maleRatio: 52.1,
    femaleRatio: 47.9
  };

  return {
    type: mbtiType,
    typeName: typeInfo.title,
    description: typeInfo.description,
    scores: transformedScores,
    celebrities: transformedCelebrities,
    recommendations,
    stats: mockPopulationStats,
    statistics,
    compatibility,
    rawScores: scores.raw,
    normalizedScores: scores.normalized,
    dimensions: apiResult.dimensions,
    confidence: apiResult.confidence,
    typeStrength: apiResult.typeStrength,
    demographics: apiResult.demographics || {} // Include demographics data
  };
};

const TestStatement = () => {
  const navigate = useNavigate();
  const { createSession, isLoading, error } = useSession();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [retrieveError, setRetrieveError] = useState('');

  const handleStartTest = async () => {
    try {
      // Create session without user info requirement
      const response = await createSession({});
      navigate(`/questions/${response.sessionId}`);
    } catch (error) {
      console.error('Failed to start test:', error);
    }
  };

  const handleRetrieveResults = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setRetrieveError(t.statement.emailRequired || 'Please enter your email address');
      return;
    }

    setIsRetrieving(true);
    setRetrieveError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/results/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();
      console.log('📧 Email lookup response:', data);

      if (response.ok && data.result) {
        console.log('📊 Raw result from email lookup:', data.result);
        console.log('📧 Demographics in email lookup result:', data.result.demographics);
        
        // Transform the result data to the format expected by the Results component
        const transformedResult = transformResultData(data.result);
        console.log('🔄 Transformed result from email lookup:', transformedResult);
        console.log('📧 Demographics in transformed result:', transformedResult.demographics);
        
        // Store the transformed result in localStorage so the Results page can access it
        const resultWithTimestamp = {
          ...transformedResult,
          timestamp: Date.now()
        };
        console.log('💾 Saving email lookup result to localStorage:', resultWithTimestamp);
        localStorage.setItem('mbtiResult', JSON.stringify(resultWithTimestamp));
        
        // Navigate to results page with the found session ID
        navigate(`/results/${data.result.sessionId}`);
      } else {
        setRetrieveError(t.statement.noRecordFound || 'No test results found for this email address');
      }
    } catch (error) {
      console.error('Failed to retrieve results:', error);
      setRetrieveError(t.statement.retrieveError || 'Failed to retrieve results. Please try again.');
    } finally {
      setIsRetrieving(false);
    }
  };

  const openEmailModal = () => {
    setShowEmailModal(true);
    setEmail('');
    setRetrieveError('');
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmail('');
    setRetrieveError('');
  };

  return (
    <StatementPage>
      <StatementSection>
        <Container>
          <StatementCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Header>
              <HeaderTitle>{t.statement.title}</HeaderTitle>
            </Header>
            
            <Content>
              <Description>
                {t.statement.description}
              </Description>
              
              <Description>
                {t.statement.benefit}
              </Description>
              
              <Description>
                {t.statement.privacy}
              </Description>
              
              <InstructionsTitle>
                {t.statement.instructions}
              </InstructionsTitle>
              
              <InstructionsList>
                <InstructionItem>
                  {t.statement.point1}
                </InstructionItem>
                <InstructionItem>
                  {t.statement.point2}
                </InstructionItem>
                <InstructionItem>
                  {t.statement.point3}
                </InstructionItem>
                <InstructionItem>
                  {t.statement.point4}
                </InstructionItem>
              </InstructionsList>
              
              <ButtonGroup>                
                <StartButton 
                  onClick={handleStartTest}
                  disabled={isLoading}
                  variant="primary"
                  size="lg"
                >
                  <FontAwesomeIcon icon={faPlay} />
                  {isLoading ? t.test.loading : t.statement.startTest}
                </StartButton>
                <RetrieveButton 
                  onClick={openEmailModal}
                  variant="secondary"
                  size="lg"
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  {t.statement.retrieveResults || 'Retrieve Previous Results'}
                </RetrieveButton>
              </ButtonGroup>
              
              {isLoading && (
                <LoadingText>
                  {t.test.loading}
                </LoadingText>
              )}
              
              {error && (
                <ErrorText>
                  {error}
                </ErrorText>
              )}
            </Content>
          </StatementCard>
        </Container>
      </StatementSection>

      {/* Email Modal */}
      {showEmailModal && (
        <ModalOverlay onClick={closeEmailModal}>
          <ModalContent
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ModalHeader>
              <ModalTitle>{t.statement.retrieveResults || 'Retrieve Previous Results'}</ModalTitle>
              <CloseButton onClick={closeEmailModal}>
                <FontAwesomeIcon icon={faTimes} />
              </CloseButton>
            </ModalHeader>
            
            <form onSubmit={handleRetrieveResults}>
              <FormGroup>
                <Label htmlFor="email">
                  {t.statement.emailLabel || 'Email Address'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.statement.emailPlaceholder || 'Enter your email address'}
                  required
                />
              </FormGroup>
              
              {retrieveError && (
                <ErrorText>
                  {retrieveError}
                </ErrorText>
              )}
              
              <ModalButton 
                type="submit"
                disabled={isRetrieving}
                variant="primary"
              >
                {isRetrieving 
                  ? (t.statement.retrieving || 'Retrieving...') 
                  : (t.statement.findResults || 'Find My Results')
                }
              </ModalButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </StatementPage>
  );
};

export default TestStatement; 
