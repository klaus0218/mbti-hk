import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPaperPlane, faUser, faPhone, faBuilding, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { Container, Section, Button } from '../../styles/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslations } from '../../locales';

const ContactPage = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
`;

const ContactSection = styled(Section)`
  padding-top: ${({ theme }) => theme.spacing['3xl']};
  padding-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

const ContactCard = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
`;

const Header = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
`;

const HeaderTitle = styled.h1`
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: ${({ theme }) => theme.colors.warning};
    border-radius: 2px;
  }
`;

const HeaderSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.typography.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ContactInfo = styled.div`
  background: ${({ theme }) => theme.colors.gray50};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const ContactInfoIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.lg};
`;

const ContactInfoText = styled.div`
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.typography.medium};
`;

const FormContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing['2xl']};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg};
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
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LabelIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.sm};
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.error};
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const RadioGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.regular};
  color: ${({ theme }) => theme.colors.gray700};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  border: 2px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 50%;
  position: relative;
  margin: 0;
  cursor: pointer;
  
  &:checked {
    border-color: ${({ theme }) => theme.colors.primary};
    
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      background: ${({ theme }) => theme.colors.primary};
      border-radius: 50%;
    }
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
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

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.base};
  font-family: inherit;
  resize: vertical;
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

const SubmitButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
  background: ${({ theme }) => theme.colors.warning};
  color: ${({ theme }) => theme.colors.white};
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.warning}dd;
    transform: translateY(-1px);
  }
`;

const SuccessMessage = styled(motion.div)`
  background: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-weight: ${({ theme }) => theme.typography.medium};
`;

const Contact = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const [formData, setFormData] = useState({
    salutation: '',
    name: '',
    phone: '',
    email: '',
    inquiry: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t.contact.nameRequired;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t.contact.emailAddressRequired;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t.contact.emailInvalid;
    }
    
    if (!formData.inquiry.trim()) {
      newErrors.inquiry = t.contact.inquiryRequired;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        salutation: '',
        name: '',
        phone: '',
        email: '',
        inquiry: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
      
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      alert(t.contact.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactPage>
      <ContactSection>
        <Container>
          <ContactCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Header>
              <HeaderTitle>{t.contact.title}</HeaderTitle>
              <HeaderSubtitle>{t.contact.subtitle}</HeaderSubtitle>
            </Header>
            
            <ContactInfo>
              <ContactInfoIcon>
                <FontAwesomeIcon icon={faEnvelope} />
              </ContactInfoIcon>
              <ContactInfoText>
                {t.contact.email}: {t.contact.emailPlaceholder}
              </ContactInfoText>
            </ContactInfo>
            
            <FormContainer>
              {showSuccess && (
                <SuccessMessage
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '8px' }} />
                  {t.contact.submitSuccess}
                </SuccessMessage>
              )}
              
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>
                    <LabelIcon>
                      <FontAwesomeIcon icon={faUser} />
                    </LabelIcon>
                    {t.contact.salutation}
                  </Label>
                  <RadioGroup>
                    <RadioOption>
                      <RadioInput
                        type="radio"
                        name="salutation"
                        value="mr"
                        checked={formData.salutation === 'mr'}
                        onChange={handleInputChange}
                      />
                      {t.contact.mr}
                    </RadioOption>
                    <RadioOption>
                      <RadioInput
                        type="radio"
                        name="salutation"
                        value="ms"
                        checked={formData.salutation === 'ms'}
                        onChange={handleInputChange}
                      />
                      {t.contact.ms}
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="name">
                    <LabelIcon>
                      <FontAwesomeIcon icon={faBuilding} />
                    </LabelIcon>
                    {t.contact.nameCompany}
                    <RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    $hasError={!!errors.name}
                    placeholder={t.contact.nameCompanyPlaceholder}
                  />
                  {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="phone">
                    <LabelIcon>
                      <FontAwesomeIcon icon={faPhone} />
                    </LabelIcon>
                    {t.contact.phone}
                  </Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t.contact.phonePlaceholder}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">
                    <LabelIcon>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </LabelIcon>
                    {t.contact.emailAddress}
                    <RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    $hasError={!!errors.email}
                    placeholder={t.contact.emailAddressPlaceholder}
                  />
                  {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="inquiry">
                    <LabelIcon>
                      <FontAwesomeIcon icon={faCommentDots} />
                    </LabelIcon>
                    {t.contact.inquiry}
                    <RequiredMark>*</RequiredMark>
                  </Label>
                  <TextArea
                    id="inquiry"
                    name="inquiry"
                    value={formData.inquiry}
                    onChange={handleInputChange}
                    $hasError={!!errors.inquiry}
                    placeholder={t.contact.inquiryPlaceholder}
                    rows={5}
                  />
                  {errors.inquiry && <ErrorText>{errors.inquiry}</ErrorText>}
                </FormGroup>

                <SubmitButton
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  fullWidth
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  {isSubmitting ? t.contact.submitting : t.contact.submit}
                </SubmitButton>
              </Form>
            </FormContainer>
          </ContactCard>
        </Container>
      </ContactSection>
    </ContactPage>
  );
};

export default Contact; 
