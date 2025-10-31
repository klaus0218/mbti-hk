import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShare, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Container, Section, Button, Card } from '../../styles/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslations } from '../../locales';
import mbtiTypesData from '../../data/mbtiTypesData';

const TypesPage = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
  padding-top: 100px; // Account for fixed header
  padding-bottom: ${({ theme }) => theme.spacing['3xl']};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 35px; // Reduced padding for mobile
  }
`;

const HeaderSection = styled.div`
  background: ${({ theme }) => theme.colors.gradientPrimary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['2xl']} 0;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} 0;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const TypeCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const TypeHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TypeCode = styled.h2`
  font-size: ${({ theme }) => theme.typography['3xl']};
  font-weight: ${({ theme }) => theme.typography.extrabold};
  color: #8B5A3C;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TypeName = styled.h3`
  color: ${({ theme }) => theme.colors.gray800};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TypeShortDesc = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.typography.sm};
  line-height: 1.5;
`;

const DetailedTypeView = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
`;

const DetailCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const DetailHeader = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  background: ${({ theme }) => theme.colors.gradientSecondary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl} ${({ theme }) => theme.borderRadius.xl} 0 0;
  margin: -${({ theme }) => theme.spacing.xl} -${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl};
`;

const LargeTypeCode = styled.h1`
  font-size: ${({ theme }) => theme.typography['5xl']};
  font-weight: ${({ theme }) => theme.typography.extrabold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography['4xl']};
  }
`;

const DetailTitle = styled.h2`
  color: #D2691E;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TraitSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TraitItem = styled.div`
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TraitTitle = styled.h4`
  color: ${({ theme }) => theme.colors.gray800};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TraitDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  line-height: 1.6;
`;

const QuoteSection = styled.div`
  background: #8B5A3C;
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const QuoteItem = styled.blockquote`
  font-style: italic;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.lg};
  border-left: 3px solid ${({ theme }) => theme.colors.white};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ListCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const ListTitle = styled.h4`
  color: #D2691E;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ListItem = styled.li`
  color: ${({ theme }) => theme.colors.gray700};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const BackButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const mbtiTypesKeys = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP', 
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

const MBTITypes = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const [selectedType, setSelectedType] = useState(type || null);

  useEffect(() => {
    if (type && mbtiTypesData[type.toUpperCase()]) {
      setSelectedType(type.toUpperCase());
    }
  }, [type]);

  const handleTypeSelect = (typeCode) => {
    setSelectedType(typeCode);
    navigate(`/mbti-types/${typeCode.toLowerCase()}`);
  };

  const handleBack = () => {
    if (selectedType) {
      setSelectedType(null);
      navigate('/mbti-types');
    } else {
      navigate(-1);
    }
  };

  const renderTypeGrid = () => (
    <Container>
      <HeaderSection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>{language === 'zh' ? 'MBTI 16種人格類型' : '16 MBTI Personality Types'}</h1>
            <p>
              {language === 'zh' 
                ? '深入了解每種人格類型的特質、優勢和挑戰。點擊任何類型以獲得詳細分析。'
                : 'Explore the traits, strengths, and challenges of each personality type. Click on any type for detailed analysis.'}
            </p>
          </motion.div>
        </Container>
      </HeaderSection>
      
      <Container>
        <TypeGrid>
          {mbtiTypesKeys.map((typeCode, index) => {
            const typeData = mbtiTypesData[typeCode];
            if (!typeData) return null;
            
            return (
              <TypeCard
                key={typeCode}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => handleTypeSelect(typeCode)}
              >
                <TypeHeader>
                  <TypeCode>{typeCode}</TypeCode>
                  <TypeName>
                    {language === 'zh' ? typeData.name.zh : typeData.name.en}
                  </TypeName>
                  <TypeShortDesc>
                    {language === 'zh' ? typeData.shortDescription.zh : typeData.shortDescription.en}
                  </TypeShortDesc>
                </TypeHeader>
              </TypeCard>
            );
          })}
        </TypeGrid>
      </Container>
    </Container>
  );

  const renderDetailedView = () => {
    const typeData = mbtiTypesData[selectedType];
    if (!typeData) return null;

    return (
      <Container>
        <BackButton onClick={handleBack} variant="outline">
          <FontAwesomeIcon icon={faArrowLeft} />
          {language === 'zh' ? '返回類型列表' : 'Back to Types'}
        </BackButton>

        <DetailedTypeView
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <DetailCard>
            <DetailHeader>
              <LargeTypeCode>{selectedType}</LargeTypeCode>
              <h2>{language === 'zh' ? typeData.name.zh : typeData.name.en}</h2>
              <p>{language === 'zh' ? typeData.shortDescription.zh : typeData.shortDescription.en}</p>
            </DetailHeader>

            <TraitSection>
              <DetailTitle>
                {language === 'zh' ? '核心特質' : 'Core Traits'}
              </DetailTitle>
              {(language === 'zh' ? typeData.traits.zh : typeData.traits.en).map((trait, index) => (
                <TraitItem key={index}>
                  <TraitTitle>{trait.title}</TraitTitle>
                  <TraitDescription>{trait.description}</TraitDescription>
                </TraitItem>
              ))}
            </TraitSection>

            <QuoteSection>
              <DetailTitle style={{ color: 'white' }}>
                {language === 'zh' ? `${selectedType} 語句錄` : `${selectedType} Quotes`}
              </DetailTitle>
              {(language === 'zh' ? typeData.quotes.zh : typeData.quotes.en).map((quote, index) => (
                <QuoteItem key={index}>{quote}</QuoteItem>
              ))}
            </QuoteSection>

            <ListGrid>
              <ListCard>
                <ListTitle>{language === 'zh' ? '優勢' : 'Strengths'}</ListTitle>
                <ul>
                  {(language === 'zh' ? typeData.strengths.zh : typeData.strengths.en).map((strength, index) => (
                    <ListItem key={index}>{strength}</ListItem>
                  ))}
                </ul>
              </ListCard>

              <ListCard>
                <ListTitle>{language === 'zh' ? '挑戰' : 'Challenges'}</ListTitle>
                <ul>
                  {(language === 'zh' ? typeData.challenges.zh : typeData.challenges.en).map((challenge, index) => (
                    <ListItem key={index}>{challenge}</ListItem>
                  ))}
                </ul>
              </ListCard>

              <ListCard>
                <ListTitle>{language === 'zh' ? '適合職業' : 'Ideal Careers'}</ListTitle>
                <ul>
                  {(language === 'zh' ? typeData.careers.zh : typeData.careers.en).map((career, index) => (
                    <ListItem key={index}>{career}</ListItem>
                  ))}
                </ul>
              </ListCard>
            </ListGrid>

            <TraitSection>
              <DetailTitle>{language === 'zh' ? '在關係中' : 'In Relationships'}</DetailTitle>
              <TraitDescription>
                {language === 'zh' ? typeData.relationships.zh : typeData.relationships.en}
              </TraitDescription>
            </TraitSection>

            <TraitSection>
              <DetailTitle>{language === 'zh' ? '總結' : 'Summary'}</DetailTitle>
              <TraitDescription>
                {language === 'zh' ? typeData.summary.zh : typeData.summary.en}
              </TraitDescription>
            </TraitSection>

            <ActionButtons>
              <Button variant="primary">
                <FontAwesomeIcon icon={faShare} />
                {language === 'zh' ? '分享此類型' : 'Share This Type'}
              </Button>
              <Button variant="outline">
                <FontAwesomeIcon icon={faDownload} />
                {language === 'zh' ? '下載詳情' : 'Download Details'}
              </Button>
            </ActionButtons>
          </DetailCard>
        </DetailedTypeView>
      </Container>
    );
  };

  return (
    <TypesPage>
      {selectedType ? renderDetailedView() : renderTypeGrid()}
    </TypesPage>
  );
};

export default MBTITypes;
