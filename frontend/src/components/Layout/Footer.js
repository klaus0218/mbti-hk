import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram as faInstagramBrand } from '@fortawesome/free-brands-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Container } from '../../styles/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslations } from '../../locales';

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.gray900};
  color: ${({ theme }) => theme.colors.gray300};
  padding: ${({ theme }) => theme.spacing['3xl']} 0 ${({ theme }) => theme.spacing.xl} 0;
  margin-top: auto;
`;

const FooterContainer = styled(Container)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h4`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.lg};
  font-weight: ${({ theme }) => theme.typography.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.gray400};
  text-decoration: none;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FooterExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.gray400};
  text-decoration: none;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.gray400};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.typography.xl};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    transform: scale(1.1);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray700};
  padding-top: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.typography.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const HeartIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.colors.secondary};
  animation: heartbeat 1.5s ease-in-out infinite;
  
  @keyframes heartbeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterSection>
          <FooterTitle>{t.footer.title}</FooterTitle>
          <FooterText>
            {t.footer.description}
          </FooterText>
          <SocialLinks>
            <SocialLink
              href="https://instagram.com/mbti_station"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.footer.socialLabel}
            >
              <FontAwesomeIcon icon={faInstagramBrand} />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <FooterTitle>{t.footer.quickLinks}</FooterTitle>
          <FooterLink to="/">{t.footer.home}</FooterLink>
          <FooterLink to="/about">{t.footer.about}</FooterLink>
          <FooterLink to="/test">{t.footer.takeTest}</FooterLink>
          <FooterLink to="/articles">{t.footer.articles}</FooterLink>
          <FooterLink to="/contact">{t.footer.contact}</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>{t.footer.resources}</FooterTitle>
          <FooterExternalLink 
            href="https://www.16personalities.com/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            16Personalities
          </FooterExternalLink>
          <FooterExternalLink 
            href="https://en.wikipedia.org/wiki/Myers%E2%80%93Briggs_Type_Indicator" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            MBTI Wikipedia
          </FooterExternalLink>
          <FooterExternalLink 
            href="https://www.myersbriggs.org/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Myers & Briggs Foundation
          </FooterExternalLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>{t.footer.aboutSection}</FooterTitle>
          <FooterText>
            {t.footer.aboutText}
          </FooterText>
          <FooterText>
            <strong>{t.footer.disclaimer}</strong> {t.footer.disclaimerText}
          </FooterText>
        </FooterSection>
      </FooterContainer>

      <Container>
        <FooterBottom>
          <Copyright>
            © {currentYear} {t.footer.copyright} <HeartIcon icon={faHeart} /> {t.footer.copyrightEnd}
          </Copyright>
        </FooterBottom>
      </Container>
    </FooterWrapper>
  );
};

export default Footer; 
