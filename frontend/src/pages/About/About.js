import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container, Section } from '../../styles/theme';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutPage = styled.div`
  min-height: 100vh;
  padding-top: 100px; // Account for fixed header
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 35px; // Reduced padding for mobile
  }
`;

const HeroSection = styled(Section)`
  background: ${({ theme }) => theme.colors.gradientSecondary};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing['4xl']};
  padding-bottom: ${({ theme }) => theme.spacing['4xl']};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: ${({ theme }) => theme.spacing['2xl']};
    padding-bottom: ${({ theme }) => theme.spacing['2xl']};
  }
`;

const HeroTitle = styled(motion.h1)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const HeroSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.xl};
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
`;

const ContentSection = styled(Section)`
  background: ${({ theme }) => theme.colors.white};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing['2xl']};
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const InfoCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.gray50};
  padding: ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const InfoTitle = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  line-height: 1.7;
`;

const About = () => {
  const { language } = useLanguage();
  
  const content = {
    en: {
      heroTitle: "About the MBTI Assessment",
      heroSubtitle: "Understanding personality types through the Myers-Briggs Type Indicator",
      whatIsMbti: {
        title: "What is MBTI?",
        text: "The Myers-Briggs Type Indicator (MBTI) is a psychological assessment tool designed to identify personality preferences in how people perceive the world and make decisions. Based on Carl Jung's theory of psychological types, it categorizes personalities into 16 distinct types."
      },
      fourDimensions: {
        title: "The Four Dimensions",
        text: (
          <>
            <strong>Extraversion (E) vs Introversion (I):</strong> How you direct your energy<br/>
            <strong>Sensing (S) vs Intuition (N):</strong> How you take in information<br/>
            <strong>Thinking (T) vs Feeling (F):</strong> How you make decisions<br/>
            <strong>Judging (J) vs Perceiving (P):</strong> How you approach the outside world
          </>
        )
      },
      howItWorks: {
        title: "How Our Test Works",
        text: "Our assessment presents you with scenarios and questions designed to reveal your natural preferences. There are no right or wrong answers - the goal is to understand your authentic self. The results provide insights into your strengths, communication style, and potential career paths."
      },
      disclaimer: {
        title: "Important Disclaimer",
        text: "This test is designed for educational and self-discovery purposes. While based on established psychological principles, it should not be used for clinical diagnosis or as the sole basis for important life decisions. For professional psychological assessment, please consult with a qualified mental health practitioner."
      }
    },
    zh: {
      heroTitle: "關於MBTI人格測評",
      heroSubtitle: "通過MBTI了解人格類型",
      whatIsMbti: {
        title: "什麼是MBTI？",
        text: "邁爾斯-布里格斯性格指標（MBTI）是一種心理評估工具，旨在識別人們感知世界和做決定時的性格偏好。基於卡爾·榮格的心理類型理論，它將性格分為16種不同的類型。"
      },
      fourDimensions: {
        title: "四個維度",
        text: (
          <>
            <strong>外向型 (E) vs 內向型 (I)：</strong> 你如何引導你的能量<br/>
            <strong>現實型 (S) vs 直覺型 (N)：</strong> 你如何接收信息<br/>
            <strong>思考型 (T) vs 情感型 (F)：</strong> 你如何做決定<br/>
            <strong>判斷型 (J) vs 感知型 (P)：</strong> 你如何對待外部世界
          </>
        )
      },
      howItWorks: {
        title: "我們的測試如何進行",
        text: "我們的評估會向您呈現旨在揭示您自然偏好的情境和問題。沒有對錯答案——目標是了解真實的自己。結果會提供關於您的優勢、溝通風格和潛在職業道路的洞察。"
      },
      disclaimer: {
        title: "重要免責聲明",
        text: "此測試專為教育和自我發現目的而設計。雖然基於既定的心理學原理，但不應用於臨床診斷或作為重要人生決定的唯一依據。如需專業心理評估，請諮詢合格的心理健康從業者。"
      }
    }
  };

  const currentContent = content[language];

  return (
    <AboutPage>
      <HeroSection>
        <Container>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {currentContent.heroTitle}
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {currentContent.heroSubtitle}
          </HeroSubtitle>
        </Container>
      </HeroSection>

      <ContentSection>
        <Container>
          <ContentGrid>
            <InfoCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <InfoTitle>{currentContent.whatIsMbti.title}</InfoTitle>
              <InfoText>
                {currentContent.whatIsMbti.text}
              </InfoText>
            </InfoCard>

            <InfoCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <InfoTitle>{currentContent.fourDimensions.title}</InfoTitle>
              <InfoText>
                {currentContent.fourDimensions.text}
              </InfoText>
            </InfoCard>

            <InfoCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <InfoTitle>{currentContent.howItWorks.title}</InfoTitle>
              <InfoText>
                {currentContent.howItWorks.text}
              </InfoText>
            </InfoCard>

            <InfoCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <InfoTitle>{currentContent.disclaimer.title}</InfoTitle>
              <InfoText>
                {currentContent.disclaimer.text}
              </InfoText>
            </InfoCard>
          </ContentGrid>
        </Container>
      </ContentSection>
    </AboutPage>
  );
};

export default About; 
