import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, 
  faUsers, 
  faBrain, 
  faChartLine,
  faArrowRight,
  faCheckCircle,
  faFlask
} from '@fortawesome/free-solid-svg-icons';
import { Container, Section, Card, Button } from '../../styles/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslations } from '../../locales';

const HeroSection = styled(Section)`
  background: ${({ theme }) => theme.colors.gradientPrimary};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing['5xl']};
  padding-bottom: ${({ theme }) => theme.spacing['5xl']};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Ccircle cx='39' cy='39' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled(motion.h1)`
  font-size: ${({ theme }) => theme.typography['5xl']};
  font-weight: ${({ theme }) => theme.typography.extrabold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography['4xl']};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography['3xl']};
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.xl};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  opacity: 0.9;
  line-height: 1.6;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.lg};
  }
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const HeroButton = styled(Button)`
  font-size: ${({ theme }) => theme.typography.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const LearnMoreButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.white};
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled(Section)`
  background: ${({ theme }) => theme.colors.gray50};
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.gray900};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

const FeatureCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  text-align: center;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FeatureTitle = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  line-height: 1.6;
`;

const StatsSection = styled(Section)`
  background: ${({ theme }) => theme.colors.white};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const StatCard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.typography['4xl']};
  font-weight: ${({ theme }) => theme.typography.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  font-weight: ${({ theme }) => theme.typography.medium};
`;

const BenefitsSection = styled(Section)`
  background: ${({ theme }) => theme.colors.gray50};
`;

const BenefitsList = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const BenefitItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const BenefitIcon = styled.div`
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.typography.xl};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const BenefitText = styled.div`
  h4 {
    color: ${({ theme }) => theme.colors.gray900};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray600};
    margin-bottom: 0;
  }
`;

const CTASection = styled(Section)`
  background: ${({ theme }) => theme.colors.gradientSecondary};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
`;

const CTATitle = styled.h2`
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CTADescription = styled.p`
  font-size: ${({ theme }) => theme.typography.lg};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const features = [
  {
    icon: faBrain,
    title: "Scientific Approach",
    description: "Based on Carl Jung's psychological theory and decades of research in personality psychology."
  },
  {
    icon: faUsers,
    title: "16 Personality Types",
    description: "Discover which of the 16 distinct personality types best describes your preferences and behavior."
  },
  {
    icon: faChartLine,
    title: "Detailed Results",
    description: "Get comprehensive insights into your strengths, challenges, and potential career paths."
  }
];

const benefits = [
  {
    key: 'selfUnderstanding',
    icon: faCheckCircle
  },
  {
    key: 'careerGuidance',
    icon: faCheckCircle
  },
  {
    key: 'improvedRelationships',
    icon: faCheckCircle
  },
  {
    key: 'personalGrowth',
    icon: faCheckCircle
  }
];

const Home = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <>
      <HeroSection>
        <Container>
          <HeroContent>
            <HeroTitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t.home.heroTitle}
            </HeroTitle>
            
            <HeroSubtitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t.home.heroSubtitle}
            </HeroSubtitle>
            
            <HeroActions
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <HeroButton as={Link} to="/test" size="lg">
                <FontAwesomeIcon icon={faPlay} />
                {t.home.startTest}
              </HeroButton>
              <LearnMoreButton as={Link} to="/about" variant="outline" size="lg">
                {t.home.learnMore}
                <FontAwesomeIcon icon={faArrowRight} />
              </LearnMoreButton>
            </HeroActions>
          </HeroContent>
        </Container>
      </HeroSection>

      <FeaturesSection>
        <Container>
          <SectionTitle>{t.home.whyTakeTest}</SectionTitle>
          <FeaturesGrid>
            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>
                <FontAwesomeIcon icon={faFlask} />
              </FeatureIcon>
              <FeatureTitle>{t.home.scientificTitle}</FeatureTitle>
              <FeatureDescription>{t.home.scientificDesc}</FeatureDescription>
            </FeatureCard>
            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>
                <FontAwesomeIcon icon={faUsers} />
              </FeatureIcon>
              <FeatureTitle>{t.home.typesTitle}</FeatureTitle>
              <FeatureDescription>{t.home.typesDesc}</FeatureDescription>
            </FeatureCard>
            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>
                <FontAwesomeIcon icon={faChartLine} />
              </FeatureIcon>
              <FeatureTitle>{t.home.resultsTitle}</FeatureTitle>
              <FeatureDescription>{t.home.resultsDesc}</FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      <StatsSection>
        <Container>
          <SectionTitle>{t.home.trustedBy}</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>50K+</StatNumber>
              <StatLabel>{t.home.testsCompleted}</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>16</StatNumber>
              <StatLabel>{t.home.personalityTypes}</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>95%</StatNumber>
              <StatLabel>{t.home.accuracyRate}</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>24/7</StatNumber>
              <StatLabel>{t.home.available}</StatLabel>
            </StatCard>
          </StatsGrid>
        </Container>
      </StatsSection>

      <BenefitsSection>
        <Container>
          <SectionTitle>{t.home.whatYoullGain}</SectionTitle>
          <BenefitsList>
            {benefits.map((benefit, index) => (
              <BenefitItem
                key={benefit.key}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <BenefitIcon>
                  <FontAwesomeIcon icon={benefit.icon} />
                </BenefitIcon>
                <BenefitText>
                  <h4>{t.home.benefits[benefit.key].title}</h4>
                  <p>{t.home.benefits[benefit.key].description}</p>
                </BenefitText>
              </BenefitItem>
            ))}
          </BenefitsList>
        </Container>
      </BenefitsSection>

      <CTASection>
        <Container>
          <CTATitle>{t.home.ctaTitle}</CTATitle>
          <CTADescription>
            {t.home.ctaDesc}
          </CTADescription>
          <Button as={Link} to="/test" size="lg" variant="secondary">
            <FontAwesomeIcon icon={faPlay} />
            {t.home.startTest}
          </Button>
        </Container>
      </CTASection>
    </>
  );
};

export default Home; 
 