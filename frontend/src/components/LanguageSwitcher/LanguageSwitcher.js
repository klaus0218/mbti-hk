import React from 'react';
import styled from 'styled-components';
import { useLanguage, LANGUAGES } from '../../contexts/LanguageContext';

const SwitcherContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-left: 15px
`;

const LanguageButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.white};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.white : theme.colors.gray700};
  font-size: ${({ theme }) => theme.typography.sm};
  font-weight: ${({ theme }) => theme.typography.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ $active, theme }) => 
      $active ? theme.colors.primaryDark : theme.colors.gray50};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.xs};
  }
`;

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <SwitcherContainer>
      <LanguageButton
        $active={language === LANGUAGES.EN}
        onClick={() => setLanguage(LANGUAGES.EN)}
      >
        EN
      </LanguageButton>
      <LanguageButton
        $active={language === LANGUAGES.ZH}
        onClick={() => setLanguage(LANGUAGES.ZH)}
      >
        中文
      </LanguageButton>
    </SwitcherContainer>
  );
};

export default LanguageSwitcher; 
