import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Container, Section } from '../../styles/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslations } from '../../locales';
import { forceWindowScrollTop } from '../../utils/forceScrollTop';

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

const ContentContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing['2xl']};
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg};
  }
`;

const InfoSection = styled.div`
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray100};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-size: ${({ theme }) => theme.typography.xl};
  color: ${({ theme }) => theme.colors.gray900};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionDescription = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray700};
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.gray700};
  line-height: 1.8;
`;

const ContactGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.gray800};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  &[type='button'] {
    width: 100%;
    font: inherit;
    font-family: inherit;
    text-align: left;
    appearance: none;
    -webkit-appearance: none;
  }
`;

/** Lets clicks reach the anchor; SVG icons otherwise steal the activation in some browsers. */
const ContactItemInner = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  pointer-events: none;
`;

const ContactLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.medium};
`;

const EmailRowWrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CopyFeedback = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.sm};
  line-height: 1.5;
  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray800};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-left-width: 4px;
  border-left-color: ${({ $variant, theme }) =>
    $variant === 'success' ? theme.colors.success : theme.colors.error};
`;

const TapHint = styled.span`
  font-weight: ${({ theme }) => theme.typography.regular};
  opacity: 0.75;
`;

const Contact = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const contactEmail = String(t.contact?.contactEmail ?? '').trim();
  const [copyStatus, setCopyStatus] = useState(null);
  const copyFeedbackTimeoutRef = useRef(null);

  useLayoutEffect(() => {
    const scrollNow = () => {
      forceWindowScrollTop();
      document
        .getElementById('hkmbti-contact-page-top')
        ?.scrollIntoView({ block: 'start', inline: 'nearest' });
    };
    scrollNow();
    const t0 = window.setTimeout(scrollNow, 0);
    const t1 = window.setTimeout(scrollNow, 100);
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
    };
  }, []);

  const scheduleClearCopyStatus = useCallback(() => {
    if (copyFeedbackTimeoutRef.current != null) {
      window.clearTimeout(copyFeedbackTimeoutRef.current);
    }
    copyFeedbackTimeoutRef.current = window.setTimeout(() => {
      setCopyStatus(null);
      copyFeedbackTimeoutRef.current = null;
    }, 3500);
  }, []);

  const handleCopyEmail = useCallback(async () => {
    if (!contactEmail) return;

    const write = async () => {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(contactEmail);
        return;
      }
      const ta = document.createElement('textarea');
      ta.value = contactEmail;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (!ok) throw new Error('execCommand copy failed');
    };

    try {
      await write();
      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    }
    scheduleClearCopyStatus();
  }, [contactEmail, scheduleClearCopyStatus]);

  return (
    <ContactPage id="hkmbti-contact-page-top">
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

            <ContentContainer>
              <InfoSection>
                <SectionTitle>
                  <FontAwesomeIcon icon={faUserTie} />
                  {t.contact.serviceTitle}
                </SectionTitle>
                <SectionDescription>{t.contact.serviceDescription}</SectionDescription>
                <BulletList>
                  <li>{t.contact.servicePoint1}</li>
                  <li>{t.contact.servicePoint2}</li>
                  <li>{t.contact.servicePoint3}</li>
                </BulletList>
              </InfoSection>

              <InfoSection>
                <SectionTitle>
                  <FontAwesomeIcon icon={faPhone} />
                  {t.contact.reachUsTitle}
                </SectionTitle>
                <SectionDescription>{t.contact.reachUsDescription}</SectionDescription>
                <ContactGrid>
                  <EmailRowWrapper>
                    <ContactItem
                      as="button"
                      type="button"
                      onClick={handleCopyEmail}
                      aria-label={`${t.contact.emailTapToCopy}: ${contactEmail}`}
                    >
                      <ContactItemInner>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <ContactLabel>
                          {t.contact.email}: {contactEmail}
                          <TapHint>
                            {' '}
                            · {t.contact.emailTapToCopy}
                          </TapHint>
                        </ContactLabel>
                      </ContactItemInner>
                    </ContactItem>
                    {copyStatus === 'success' && (
                      <CopyFeedback $variant="success" role="status">
                        {t.contact.emailCopied}
                      </CopyFeedback>
                    )}
                    {copyStatus === 'error' && (
                      <CopyFeedback $variant="error" role="alert">
                        {t.contact.emailCopyFailed}
                      </CopyFeedback>
                    )}
                  </EmailRowWrapper>
                  <ContactItem href={`https://wa.me/${t.contact.whatsappNumber}`}>
                    <ContactItemInner>
                      <FontAwesomeIcon icon={faWhatsapp} />
                      <ContactLabel>WhatsApp: +{t.contact.whatsappNumber}</ContactLabel>
                    </ContactItemInner>
                  </ContactItem>
                  <ContactItem href={t.contact.instagramUrl} target="_blank" rel="noopener noreferrer">
                    <ContactItemInner>
                      <FontAwesomeIcon icon={faInstagram} />
                      <ContactLabel>Instagram: {t.contact.instagramHandle}</ContactLabel>
                    </ContactItemInner>
                  </ContactItem>
                </ContactGrid>
              </InfoSection>
            </ContentContainer>
          </ContactCard>
        </Container>
      </ContactSection>
    </ContactPage>
  );
};

export default Contact; 
