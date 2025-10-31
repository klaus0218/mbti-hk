import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Container, Section, Button } from '../../styles/theme';
import { useSession } from '../../contexts/SessionContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslations } from '../../locales';
import { getQuestions } from '../../services/api';

const QuestionsPage = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
  width: 100vw;
  max-width: 100%;
  overflow-x: hidden !important;
  box-sizing: border-box;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    /* Ensure mobile scrolling works */
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    min-height: calc(100vh + 100px);
  }
`;

const QuestionsSection = styled(Section)`
  padding-top: ${({ theme }) => theme.spacing.md}; // Reduced from xl
  padding-bottom: ${({ theme }) => theme.spacing.md}; // Reduced from xl
`;

const QuestionCard = styled(motion.div)`
  max-width: 1000px;
  margin: 0;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 100%;
  box-sizing: border-box;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 100%;
    margin: 0;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
  }
`;

const ProgressBar = styled.div`
  height: 6px;
  background: ${({ theme }) => theme.colors.gray200};
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.xl} ${({ theme }) => theme.borderRadius.xl} 0 0;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ progress }) => progress}%;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    transition: width 0.3s ease-in-out;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  }
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.md}; // Reduced from lg
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  background: ${({ theme }) => theme.colors.gray50};
  position: sticky;
  position: -webkit-sticky; /* Safari */
  top: 30px; // Reduced from 70px to prevent overlap
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 -1px; /* Extend to container edges */
  width: calc(100% + 2px);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: sticky;
    position: -webkit-sticky;
    top: 0px; /* Position below main header on mobile */
    margin: 0;
    width: 100%;
    padding: ${({ theme }) => theme.spacing.xs}; // Reduced from sm
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SectionInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs}; // Reduced from sm
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.typography.base};
  font-weight: ${({ theme }) => theme.typography.medium};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography['2xl']}; // Increased from xl to 2xl (24px)
  font-weight: ${({ theme }) => theme.typography.extrabold}; // Changed from bold to extrabold (800)
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.xl};
    font-weight: ${({ theme }) => theme.typography.extrabold};
  }
`;

const QuestionsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg}; // Reduced from xl
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.xl} ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.white};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm}; // Reduced from md
    border-radius: 0 0 ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg};
  }
`;

const QuestionItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg}; // Reduced from xl
  padding: ${({ theme }) => theme.spacing.md} 0; // Reduced from lg
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 200px; // Reduced from 240px
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: ${({ theme }) => theme.spacing.md}; // Reduced from lg
    padding: ${({ theme }) => theme.spacing.sm} 0; // Reduced from md
    min-height: 180px; // Reduced from 200px
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md}; // Reduced from lg
  justify-content: flex-start;
`;

const QuestionNumber = styled.div`
  width: 36px; // Reduced from 48px
  height: 36px; // Reduced from 48px
  background: ${({ theme }) => theme.colors.primary}; // Add back background color
  color: ${({ theme }) => theme.colors.white}; // Add back text color
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.bold};
  font-size: ${({ theme }) => theme.typography.base}; // Reduced from lg
  flex-shrink: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 32px; // Add mobile size
    height: 32px; // Add mobile size
    font-size: ${({ theme }) => theme.typography.sm};
  }
`;

const QuestionText = styled.h3`
  font-size: ${({ theme }) => theme.typography.xl};
  color: ${({ theme }) => theme.colors.gray900};
  line-height: 1.6;
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.medium};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.lg};
  }
`;

const ScaleContainer = styled.div`
  margin: ${({ theme }) => theme.spacing.md} 0; // Reduced from lg
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: ${({ theme }) => theme.spacing.sm} 0;
  }
`;

const ScaleLabels = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  min-height: 50px;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.xs};
    min-height: 40px;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const ScaleLabel = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.lg};
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.typography.medium};
  padding: 0 ${({ theme }) => theme.spacing.md};
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
  
  &:first-child {
    text-align: left;
  }
  
  &:last-child {
    text-align: right;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.base};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.colors.gray50};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    max-width: 48%;
    min-height: 60px;
    display: flex;
    align-items: center;
    line-height: 1.4;
    
    &:first-child {
      text-align: left;
      border-left: 4px solid ${({ theme }) => theme.colors.primary};
      margin-right: auto;
    }
    
    &:last-child {
      text-align: right;
      border-right: 4px solid ${({ theme }) => theme.colors.secondary};
      margin-left: auto;
    }
  }
  
  @media (max-width: 480px) {
    &:first-child, &:last-child {
      max-width: 45%;
      font-size: ${({ theme }) => theme.typography.sm};
      padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
      line-height: 1.4;
      min-height: 50px;
    }
  }
`;

const ScalePoints = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin: ${({ theme }) => theme.spacing.md} 0;
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: ${({ theme }) => theme.spacing.md};
    right: ${({ theme }) => theme.spacing.md};
    height: 2px;
    background: ${({ theme }) => theme.colors.gray300};
    z-index: 1;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: ${({ theme }) => theme.spacing.sm} 0;
    padding: 0 ${({ theme }) => theme.spacing.xs};
    
    &::before {
      left: ${({ theme }) => theme.spacing.xs};
      right: ${({ theme }) => theme.spacing.xs};
    }
  }
`;

const ScalePoint = styled.button`
  width: 50px; // Reduced from 60px
  height: 50px; // Reduced from 60px
  border-radius: 50%;
  border: 3px solid ${({ theme, $selected }) => 
    $selected ? theme.colors.primary : theme.colors.gray300};
  background: ${({ theme, $selected }) => 
    $selected ? theme.colors.primary : theme.colors.white};
  color: ${({ theme, $selected }) => 
    $selected ? theme.colors.white : theme.colors.gray600};
  font-weight: ${({ theme }) => theme.typography.bold};
  font-size: ${({ theme }) => theme.typography.lg};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  z-index: 2;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme, $selected }) => 
      $selected ? theme.colors.primaryDark : theme.colors.primary}20;
    transform: scale(1.1);
    z-index: 3;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 40px; // Reduced from 50px
    height: 40px; // Reduced from 50px
    font-size: ${({ theme }) => theme.typography.base};
  }
`;

const QuestionStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.success};
  font-weight: ${({ theme }) => theme.typography.medium};
  font-size: ${({ theme }) => theme.typography.sm};
  opacity: 0.8;
`;

const NavigationContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg}; // Reduced from xl
  background: ${({ theme }) => theme.colors.gray50};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md}; // Reduced from lg
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const NavButton = styled(Button)`
  min-width: 120px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const SectionProgress = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray600};
  font-weight: ${({ theme }) => theme.typography.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    order: -1;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: ${({ theme }) => theme.colors.gray600};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  color: ${({ theme }) => theme.colors.error};
`;

// Modal Components
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
  z-index: 10000;
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
  
  /* Ensure modal appears at current scroll position on mobile */
  -webkit-overflow-scrolling: touch;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
    margin: ${({ theme }) => theme.spacing.md};
    max-height: 70vh;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    /* Ensure modal is properly positioned on mobile */
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.warning};
  font-size: ${({ theme }) => theme.typography.xl};
  font-weight: ${({ theme }) => theme.typography.semibold};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.xl};
  color: ${({ theme }) => theme.colors.gray400};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    color: ${({ theme }) => theme.colors.gray600};
  }
`;

const ModalBody = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ModalMessage = styled.p`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.typography.base};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.5;
`;

const QuestionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

const QuestionListItem = styled.li`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.typography.base};
  line-height: 1.4;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  }
`;

const QuestionIcon = styled.span`
  background: ${({ theme }) => theme.colors.warning};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.sm};
  font-weight: ${({ theme }) => theme.typography.bold};
  margin-right: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ModalButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  font-weight: ${({ theme }) => theme.typography.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.sm};
  }
`;


const Questions = () => {
  const { sessionId, sectionId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { setTotalQuestions } = useSession();
  const t = useTranslations(language);
  
  const [sections, setSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [scaleInfo, setScaleInfo] = useState(null);

  // Local storage key for responses
  const getStorageKey = (sessionId) => `mbti_responses_${sessionId}`;

  // Load responses from localStorage
  const loadStoredResponses = (sessionId) => {
    try {
      const stored = localStorage.getItem(getStorageKey(sessionId));
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load stored responses:', error);
      return {};
    }
  };

  // Save responses to localStorage
  const saveResponsesToStorage = (sessionId, responses) => {
    try {
      localStorage.setItem(getStorageKey(sessionId), JSON.stringify(responses));
    } catch (error) {
      console.error('Failed to save responses to storage:', error);
    }
  };

  // Clear stored responses
  const clearStoredResponses = (sessionId) => {
    try {
      localStorage.removeItem(getStorageKey(sessionId));
    } catch (error) {
      console.error('Failed to clear stored responses:', error);
    }
  };

  useEffect(() => {
    loadQuestions();
    // Load stored responses
    const storedResponses = loadStoredResponses(sessionId);
    setResponses(storedResponses);
    // Auto scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [sessionId, language]);

  // Update current section based on URL parameter
  useEffect(() => {
    if (sections.length > 0 && sectionId) {
      // Convert sectionId from URL (string) to number for comparison
      const numericSectionId = parseInt(sectionId, 10);
      const sectionIndex = sections.findIndex(section => section.sectionId === numericSectionId);
      if (sectionIndex !== -1) {
        setCurrentSectionIndex(sectionIndex);
      } else {
        // Invalid sectionId, redirect to first section
        navigate(`/questions/${sessionId}/${sections[0].sectionId}`, { replace: true });
      }
    } else if (sections.length > 0 && !sectionId) {
      // No sectionId provided, redirect to first section
      navigate(`/questions/${sessionId}/${sections[0].sectionId}`, { replace: true });
    }
  }, [sections, sectionId, sessionId, navigate]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load questions from API with language support
      const response = await getQuestions(language);
      const questionsData = response.data;
      
      if (!questionsData || !questionsData.sections) {
        throw new Error('Invalid questions data structure');
      }
      
      setSections(questionsData.sections);
      setScaleInfo(questionsData.scale);
      
      // Calculate total questions across all sections
      const totalQuestions = questionsData.sections.reduce((total, section) => 
        total + section.questions.length, 0
      );
      setTotalQuestions(totalQuestions);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load questions:', error);
      setError('Failed to load questions. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, value, category, leftType, rightType, sectionId) => {
    const responseData = {
      questionId,
      answer: value,
      category,
      leftType,
      rightType,
      sectionId,
      timestamp: new Date().toISOString()
    };
    
    const updatedResponses = {
      ...responses,
      [questionId]: responseData
    };
    
    setResponses(updatedResponses);
    // Save to localStorage immediately
    saveResponsesToStorage(sessionId, updatedResponses);
    setShowIncompleteModal(false);
  };



  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      const prevSectionId = sections[currentSectionIndex - 1].sectionId;
      navigate(`/questions/${sessionId}/${prevSectionId}`);
      // Smooth scroll to top when moving to previous section
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  };

  const handleNext = () => {
    const currentSection = sections[currentSectionIndex];
    
    if (!currentSection) {
      console.error('No current section found');
      return;
    }
    
    // Check if all questions in current section are answered
    const unansweredQs = currentSection.questions.filter(
      question => !responses[question.questionId]
    );
    
    if (unansweredQs.length > 0) {
      setUnansweredQuestions(unansweredQs);
      setShowIncompleteModal(true);
      return;
    }

    if (currentSectionIndex < sections.length - 1) {
      // Navigate to next section
      const nextSectionId = sections[currentSectionIndex + 1].sectionId;
      navigate(`/questions/${sessionId}/${nextSectionId}`);
      // Smooth scroll to top when moving to next section
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    } else {
      // All sections completed, navigate to demographics form
      // Store final response count for validation
      const totalExpectedQuestions = sections.reduce((total, section) => 
        total + section.questions.length, 0
      );
      const currentResponseCount = Object.keys(responses).length;
      
      if (currentResponseCount === totalExpectedQuestions) {
        navigate(`/demographics/${sessionId}`);
      } else {
        // This shouldn't happen, but handle it gracefully
        console.warn('Not all questions answered before proceeding to demographics');
        navigate(`/demographics/${sessionId}`);
      }
    }
  };

  const getScaleLabel = (value) => {
    if (!scaleInfo) return value;
    
    const option = scaleInfo.options.find(opt => opt.value === value);
    return option ? option.label[language] || option.label.zh : value;
  };

  const closeIncompleteModal = () => {
    setShowIncompleteModal(false);
    setUnansweredQuestions([]);
    // Re-enable body scroll
    document.body.style.overflow = 'unset';
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showIncompleteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showIncompleteModal]);

  // All questions now use single select scale interface

  if (isLoading) {
    return (
      <QuestionsPage>
        <QuestionsSection>
          <Container>
            <LoadingContainer>
              {t.questions.loading}
            </LoadingContainer>
          </Container>
        </QuestionsSection>
      </QuestionsPage>
    );
  }

  if (error) {
    return (
      <QuestionsPage>
        <QuestionsSection>
          <Container>
            <ErrorContainer>
              {error}
            </ErrorContainer>
          </Container>
        </QuestionsSection>
      </QuestionsPage>
    );
  }

  if (sections.length === 0) {
    return (
      <QuestionsPage>
        <QuestionsSection>
          <Container>
            <ErrorContainer>
              No questions available.
            </ErrorContainer>
          </Container>
        </QuestionsSection>
      </QuestionsPage>
    );
  }

  const currentSection = sections[currentSectionIndex];
  const totalQuestions = sections.reduce((total, section) => total + section.questions.length, 0);
  const answeredQuestions = Object.keys(responses).length;
  const progress = (answeredQuestions / totalQuestions) * 100;
  const isLastSection = currentSectionIndex === sections.length - 1;
  
  // Get questions answered in current section
  const currentSectionAnswered = currentSection.questions.filter(
    question => responses[question.questionId]
  ).length;

  return (
    <QuestionsPage>
      <QuestionsSection>
        <Container>
          <QuestionCard
            key={currentSectionIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <ProgressBar progress={progress} />
            
            <Header>
              <SectionInfo>
                {currentSection.title[language] || currentSection.title.zh}：{currentSection.subtitle[language] || currentSection.subtitle.zh}
              </SectionInfo>
              <SectionTitle>
                {language === 'zh' ? 
                  `${t.questions.section}${currentSectionIndex + 1}${t.questions.of}，${t.questions.total}${sections.length}${t.questions.parts}` :
                  `${t.questions.section} ${currentSectionIndex + 1} ${t.questions.of} ${sections.length} ${t.questions.parts}`
                }
              </SectionTitle>
            </Header>

            <QuestionsContainer>
              {currentSection.questions.map((question, index) => {
                let questionText = question.text[language] || question.text.zh;
                return (
                  <QuestionItem key={question.questionId}>
                    <QuestionHeader>
                      <QuestionNumber>{question.questionId}</QuestionNumber>
                        <QuestionText>{questionText}</QuestionText>
                    </QuestionHeader>
                    
                    <ScaleContainer>
                      <ScaleLabels>
                        <ScaleLabel>{question.leftLabel[language] || question.leftLabel.zh}</ScaleLabel>
                        <ScaleLabel>{question.rightLabel[language] || question.rightLabel.zh}</ScaleLabel>
                      </ScaleLabels>
                      
                      <ScalePoints>
                        {[1, 2, 3, 4].map((value) => (
                          <ScalePoint
                            key={value}
                            $selected={responses[question.questionId]?.answer === value}
                            onClick={() => handleAnswerSelect(
                              question.questionId, 
                              value, 
                              question.category,
                              question.leftType,
                              question.rightType,
                              currentSection.sectionId
                            )}
                            title={getScaleLabel(value)}
                          >
                            {value}
                          </ScalePoint>
                        ))}
                      </ScalePoints>
                    </ScaleContainer>
                    
                    {responses[question.questionId] && (
                      <QuestionStatus>
                        <FontAwesomeIcon icon={faCheck} />
                        {language === 'zh' ? '已選擇答案' : 'Answer selected'}
                      </QuestionStatus>
                    )}
                  </QuestionItem>
                );
              })}
            </QuestionsContainer>

            <NavigationContainer>
              <NavButton
                onClick={handlePrevious}
                disabled={currentSectionIndex === 0}
                variant="outline"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                {t.questions.previous}
              </NavButton>

              <SectionProgress>
                {currentSectionAnswered} / {currentSection.questions.length} {language === 'zh' ? '已完成' : 'completed'}
              </SectionProgress>

              <NavButton
                onClick={handleNext}
                variant="primary"
              >
                {isLastSection ? t.questions.submit : t.questions.continue}
                <FontAwesomeIcon icon={faArrowRight} />
              </NavButton>
            </NavigationContainer>
          </QuestionCard>
        </Container>
      </QuestionsSection>

      {/* Incomplete Questions Modal */}
      {showIncompleteModal && (
        <ModalOverlay onClick={closeIncompleteModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{t.questions.incompleteTitle}</ModalTitle>
              <CloseButton onClick={closeIncompleteModal}>×</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <ModalMessage>{t.questions.incompleteMessage}</ModalMessage>
              <QuestionList>
                {unansweredQuestions.map((question) => (
                  <QuestionListItem key={question.questionId}>
                    <QuestionIcon>{question.questionId}</QuestionIcon>
                    <span>{question.text[language] || question.text.zh}</span>
                  </QuestionListItem>
                ))}
              </QuestionList>
            </ModalBody>
            
            <ModalFooter>
              <ModalButton onClick={closeIncompleteModal}>
                {t.questions.understood}
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </QuestionsPage>
  );
};

export default Questions; 
