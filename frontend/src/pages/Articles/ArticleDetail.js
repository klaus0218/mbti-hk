import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faCalendar, 
  faClock, 
  faUser, 
  faTag,
  faShare,
  faFacebook,
  faTwitter,
  faLinkedin,
  faInstagram
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook as faFacebookBrand, faTwitter as faTwitterBrand, faLinkedin as faLinkedinBrand } from '@fortawesome/free-brands-svg-icons';
import { Container, Section, Card } from '../../styles/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslations } from '../../locales';
import api from '../../services/api';

const ArticleDetailPage = styled(Section)`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  background: ${({ theme }) => theme.colors.gray50};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg} 0;
    min-height: calc(100vh + 200px);
    overflow-x: hidden !important;
    overflow-y: auto;
    width: 100vw;
    max-width: 100%;
    box-sizing: border-box;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.medium};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
  }
`;

const ArticleHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const ArticleCategory = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primary}10;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.sm};
  font-weight: ${({ theme }) => theme.typography.medium};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ArticleTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography['3xl']};
  font-weight: ${({ theme }) => theme.typography.bold};
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.2;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.sm};
  color: ${({ theme }) => theme.colors.gray600};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ShareSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: wrap;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ platform, theme }) => {
    switch(platform) {
      case 'facebook': return '#1877F2';
      case 'twitter': return '#1DA1F2';
      case 'linkedin': return '#0A66C2';
      case 'instagram': return '#E4405F';
      default: return theme.colors.gray600;
    }
  }};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.xs};
  font-weight: ${({ theme }) => theme.typography.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography['2xs'] || '0.6875rem'};
  }
`;

const ArticleContent = styled(Card)`
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const ContentText = styled.div`
  font-size: ${({ theme }) => theme.typography.base};
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.gray800};
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  h2 {
    font-size: ${({ theme }) => theme.typography.xl};
    font-weight: ${({ theme }) => theme.typography.bold};
    color: ${({ theme }) => theme.colors.gray900};
    margin: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.md};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.lg};
    font-weight: ${({ theme }) => theme.typography.semibold};
    color: ${({ theme }) => theme.colors.gray900};
    margin: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.sm};
  }
  
  ul, ol {
    margin: ${({ theme }) => theme.spacing.md} 0;
    padding-left: ${({ theme }) => theme.spacing.xl};
  }
  
  li {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  strong {
    font-weight: ${({ theme }) => theme.typography.bold};
    color: ${({ theme }) => theme.colors.gray900};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sm};
    line-height: 1.7;
    
    h2 {
      font-size: ${({ theme }) => theme.typography.lg};
      margin: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.sm};
    }
    
    h3 {
      font-size: ${({ theme }) => theme.typography.base};
      margin: ${({ theme }) => theme.spacing.md} 0 ${({ theme }) => theme.spacing.xs};
    }
  }
`;

const TagsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const TagsLabel = styled.h4`
  font-size: ${({ theme }) => theme.typography.sm};
  font-weight: ${({ theme }) => theme.typography.medium};
  color: ${({ theme }) => theme.colors.gray700};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.xs};
  font-weight: ${({ theme }) => theme.typography.medium};
`;

const RelatedSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const RelatedTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.xl};
  font-weight: ${({ theme }) => theme.typography.bold};
  color: ${({ theme }) => theme.colors.gray900};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const RelatedCard = styled(motion.div)`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const RelatedImage = styled.div`
  height: 150px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}20, ${({ theme }) => theme.colors.secondary}20);
  background-image: ${({ imageUrl }) => imageUrl ? `url(${imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const RelatedContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const RelatedCardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.base};
  font-weight: ${({ theme }) => theme.typography.semibold};
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.4;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sm};
  }
`;

const RelatedExcerpt = styled.p`
  font-size: ${({ theme }) => theme.typography.sm};
  color: ${({ theme }) => theme.colors.gray600};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.xs};
  }
`;

const ReadMoreLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.sm};
  font-weight: ${({ theme }) => theme.typography.medium};
  text-decoration: none;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.xs};
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: ${({ theme }) => theme.typography.lg};
  color: ${({ theme }) => theme.colors.gray500};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.red500};
  font-size: ${({ theme }) => theme.typography.lg};
`;

const ArticleDetail = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/articles/${identifier}`);
        const data = response.data.data;
        
        setArticle(data.article);
        setRelatedArticles(data.relatedArticles);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Article not found' : err.message);
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [identifier]);

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article?.title || '');
    
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const formatContent = (content) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  };

  if (loading) {
    return (
      <ArticleDetailPage>
        <Container>
                     <LoadingSpinner>{t.common.loading}</LoadingSpinner>
        </Container>
      </ArticleDetailPage>
    );
  }

  if (error) {
    return (
      <ArticleDetailPage>
        <Container>
          <ErrorMessage>{error}</ErrorMessage>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <BackButton to="/articles">
              <FontAwesomeIcon icon={faArrowLeft} />
              {t.articles.backToArticles}
            </BackButton>
          </div>
        </Container>
      </ArticleDetailPage>
    );
  }

  if (!article) return null;

  return (
    <ArticleDetailPage>
      <Container>
        <BackButton to="/articles">
          <FontAwesomeIcon icon={faArrowLeft} />
          {t.articles.backToArticles}
        </BackButton>

        <ArticleHeader>
          <ArticleCategory>{article.category}</ArticleCategory>
          <ArticleTitle>{article.title}</ArticleTitle>
          
          <ArticleMeta>
            <MetaItem>
              <FontAwesomeIcon icon={faUser} />
                             {t.articles.author} {article.author}
            </MetaItem>
            <MetaItem>
              <FontAwesomeIcon icon={faCalendar} />
                             {t.articles.publishedOn} {new Date(article.publishDate).toLocaleDateString(language === 'ZH' ? 'zh-TW' : 'en-US')}
            </MetaItem>
            <MetaItem>
              <FontAwesomeIcon icon={faClock} />
                             {article.readTime} {t.articles.readTime}
            </MetaItem>
          </ArticleMeta>
        </ArticleHeader>

        <ShareSection>
          <ShareButton platform="facebook" onClick={() => handleShare('facebook')}>
            <FontAwesomeIcon icon={faFacebookBrand} />
            Facebook
          </ShareButton>
          <ShareButton platform="twitter" onClick={() => handleShare('twitter')}>
            <FontAwesomeIcon icon={faTwitterBrand} />
            Twitter
          </ShareButton>
          <ShareButton platform="linkedin" onClick={() => handleShare('linkedin')}>
            <FontAwesomeIcon icon={faLinkedinBrand} />
            LinkedIn
          </ShareButton>
        </ShareSection>

        <ArticleContent>
          {article.imageUrl && <RelatedImage imageUrl={article.imageUrl} />}
          <ContentText>
            {formatContent(article.content)}
          </ContentText>
          
          <TagsSection>
            <TagsLabel>
              <FontAwesomeIcon icon={faTag} style={{ marginRight: '8px' }} />
                             {t.articles.popularTags}
            </TagsLabel>
            <TagsList>
              {article.tags.map(tag => (
                <Tag key={tag}>
                  <FontAwesomeIcon icon={faTag} />
                  {tag}
                </Tag>
              ))}
            </TagsList>
          </TagsSection>
        </ArticleContent>

        {relatedArticles.length > 0 && (
          <RelatedSection>
                         <RelatedTitle>{t.articles.relatedArticles}</RelatedTitle>
            <RelatedGrid>
              {relatedArticles.map(relatedArticle => (
                <RelatedCard
                  key={relatedArticle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {relatedArticle.imageUrl && <RelatedImage imageUrl={relatedArticle.imageUrl} />}
                  <RelatedContent>
                    <RelatedCardTitle>{relatedArticle.title}</RelatedCardTitle>
                    <RelatedExcerpt>{relatedArticle.excerpt}</RelatedExcerpt>
                    <ReadMoreLink to={`/articles/${relatedArticle.slug}`}>
                      {t.articles.readMore} →
                    </ReadMoreLink>
                  </RelatedContent>
                </RelatedCard>
              ))}
            </RelatedGrid>
          </RelatedSection>
        )}
      </Container>
    </ArticleDetailPage>
  );
};

export default ArticleDetail; 
