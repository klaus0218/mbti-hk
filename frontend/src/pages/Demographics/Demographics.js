import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Container, Section, Button } from '../../styles/theme';
import { useSession } from '../../contexts/SessionContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslations } from '../../locales';

const DemographicsPage = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
`;

const DemographicsSection = styled(Section)`
  padding-top: ${({ theme }) => theme.spacing['3xl']};
  padding-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

const DemographicsCard = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
`;

const Header = styled.div`
  background: ${({ theme }) => theme.colors.gradientSecondary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
`;

const HeaderIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const HeaderTitle = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const HeaderSubtitle = styled.p`
  opacity: 0.9;
  font-size: ${({ theme }) => theme.typography.lg};
`;

const FormContainer = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: ${({ theme }) => theme.typography.medium};
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.typography.base};
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.error};
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.base};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  ${({ $hasError, theme }) => $hasError && `
    border-color: ${theme.colors.error};
    
    &:focus {
      border-color: ${theme.colors.error};
      box-shadow: 0 0 0 3px ${theme.colors.error}20;
    }
  `}
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.base};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  ${({ $hasError, theme }) => $hasError && `
    border-color: ${theme.colors.error};
    
    &:focus {
      border-color: ${theme.colors.error};
      box-shadow: 0 0 0 3px ${theme.colors.error}20;
    }
  `}
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const HelpText = styled.p`
  font-size: ${({ theme }) => theme.typography.sm};
  color: ${({ theme }) => theme.colors.gray600};
  margin-top: ${({ theme }) => theme.spacing.xs};
  line-height: 1.4;
`;

const SubmitButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Demographics = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { calculateResults, submitAllResponses, isLoading } = useSession();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    ageRange: '',
    industry: '',
    email: '',
    contact: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const industries = [
    'technology', 'healthcare', 'education', 'finance', 'marketing', 
    'sales', 'engineering', 'creative', 'legal', 'government', 
    'nonprofit', 'retail', 'manufacturing', 'consulting', 'realEstate', 
    'student', 'unemployed', 'other'
  ];

  const getStorageKey = (sessionId) => `mbti_responses_${sessionId}`;

  const loadStoredResponses = (sessionId) => {
    try {
      const stored = localStorage.getItem(getStorageKey(sessionId));
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading stored responses:', error);
      return null;
    }
  };

  const clearStoredResponses = (sessionId) => {
    try {
      localStorage.removeItem(getStorageKey(sessionId));
    } catch (error) {
      console.error('Error clearing stored responses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t.demographics.nameRequired;
    }
    
    if (!formData.gender) {
      newErrors.gender = t.demographics.genderRequired;
    }
    
    if (!formData.ageRange) {
      newErrors.ageRange = t.demographics.ageRequired;
    }
    
    if (!formData.industry) {
      newErrors.industry = t.demographics.industryRequired;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Load stored responses
      const storedResponses = loadStoredResponses(sessionId);
      
      if (!storedResponses || storedResponses.length === 0) {
        throw new Error('No quiz responses found');
      }
      
      // First, submit all responses to the backend
      await submitAllResponses(storedResponses, sessionId, language);
      
      // Then calculate results with user data
      const result = await calculateResults(sessionId, {
        demographics: formData
      });
      
      // Clear stored responses after successful submission
      clearStoredResponses(sessionId);
      
      // Navigate to results page
      navigate(`/results/${sessionId}`);
      
    } catch (error) {
      console.error('Error submitting demographics:', error);
      
      let errorMessage = 'Failed to process your information. Please try again.';
      if (error.message.includes('No quiz responses found')) {
        errorMessage = 'Please complete the quiz questions before submitting your information.';
      } else if (error.message.includes('No session ID')) {
        errorMessage = 'Session expired. Please start the test again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DemographicsPage>
      <DemographicsSection>
        <Container>
          <DemographicsCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Header>
              <HeaderIcon>
                <FontAwesomeIcon icon={faUser} />
              </HeaderIcon>
              <HeaderTitle>{t.demographics.title}</HeaderTitle>
              <HeaderSubtitle>{t.demographics.subtitle}</HeaderSubtitle>
            </Header>
            
            <FormContainer>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="name">
                    {t.demographics.name}
                    <RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    $hasError={!!errors.name}
                    placeholder={t.demographics.name}
                  />
                  {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="gender">
                    {t.demographics.gender}
                    <RequiredMark>*</RequiredMark>
                  </Label>
                  <Select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    $hasError={!!errors.gender}
                  >
                    <option value="">{t.demographics.genderRequired}</option>
                    <option value="male">{t.demographics.male}</option>
                    <option value="female">{t.demographics.female}</option>
                    <option value="other">{t.demographics.other}</option>
                    <option value="prefer_not_to_say">{t.demographics.preferNotToSay}</option>
                  </Select>
                  {errors.gender && <ErrorText>{errors.gender}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="ageRange">
                    {t.demographics.ageRange}
                    <RequiredMark>*</RequiredMark>
                  </Label>
                  <Select
                    id="ageRange"
                    name="ageRange"
                    value={formData.ageRange}
                    onChange={handleInputChange}
                    $hasError={!!errors.ageRange}
                  >
                    <option value="">{t.demographics.ageRequired}</option>
                    <option value="under_18">{t.demographics.under18}</option>
                    <option value="18_25">{t.demographics.age18to25}</option>
                    <option value="26_35">{t.demographics.age26to35}</option>
                    <option value="36_45">{t.demographics.age36to45}</option>
                    <option value="46_55">{t.demographics.age46to55}</option>
                    <option value="over_55">{t.demographics.over55}</option>
                  </Select>
                  {errors.ageRange && <ErrorText>{errors.ageRange}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="industry">
                    {t.demographics.industry}
                    <RequiredMark>*</RequiredMark>
                  </Label>
                  <Select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    $hasError={!!errors.industry}
                  >
                    <option value="">{t.demographics.industryRequired}</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>
                        {t.demographics.industries[industry]}
                      </option>
                    ))}
                  </Select>
                  {errors.industry && <ErrorText>{errors.industry}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">
                    {t.demographics.email}
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.demographics.email}
                  />
                  <HelpText>
                    {t.demographics.emailHelp || 'Enter your email to retrieve your results later if you leave the page'}
                  </HelpText>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="contact">
                    {t.demographics.contact}
                  </Label>
                  <Input
                    type="text"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder={t.demographics.contact}
                  />
                </FormGroup>

                <SubmitButton
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  variant="primary"
                  size="lg"
                  fullWidth
                >
                  <FontAwesomeIcon icon={faChartLine} />
                  {isSubmitting || isLoading ? t.demographics.submitting : t.demographics.getResults}
                </SubmitButton>
                
                {(isSubmitting || isLoading) && (
                  <LoadingText>
                    {t.demographics.submitting}
                  </LoadingText>
                )}
              </Form>
            </FormContainer>
          </DemographicsCard>
        </Container>
      </DemographicsSection>
    </DemographicsPage>
  );
};

export default Demographics; 
