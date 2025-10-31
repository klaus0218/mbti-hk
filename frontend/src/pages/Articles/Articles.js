import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTag, faCalendar, faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import { Container, Section } from '../../styles/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslations } from '../../locales';
import api from '../../services/api';

const ArticlesPage = styled(Section)`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.gray50} 0%, ${({ theme }) => theme.colors.white} 100%);
  
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

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography['3xl']};
  font-weight: ${({ theme }) => theme.typography.bold};
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.xl};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.lg};
  color: ${({ theme }) => theme.colors.gray600};
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.base};
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const FiltersSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md} 3rem;
  border: 2px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.base};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm} 2.5rem;
    font-size: ${({ theme }) => theme.typography.sm};
  }
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray400};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    left: 0.75rem;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.md};
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 200px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-width: auto;
  }
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.sm};
  font-weight: ${({ theme }) => theme.typography.medium};
  color: ${({ theme }) => theme.colors.gray700};
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.sm};
  background: white;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TagsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TagButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.gray100};
  color: ${({ active, theme }) => active ? theme.colors.white : theme.colors.gray700};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.xs};
  font-weight: ${({ theme }) => theme.typography.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.primaryDark : theme.colors.gray200};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography['2xs'] || '0.6875rem'};
  }
`;

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const ArticleCard = styled(motion.article)`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const ArticleImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}20, ${({ theme }) => theme.colors.secondary}20);
  background-image: ${({ imageUrl }) => imageUrl ? `url(${imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.1));
  }
`;

const ArticleContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const ArticleCategory = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primary}10;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.xs};
  font-weight: ${({ theme }) => theme.typography.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ArticleTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.lg};
  font-weight: ${({ theme }) => theme.typography.bold};
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.4;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.base};
  }
`;

const ArticleExcerpt = styled.p`
  font-size: ${({ theme }) => theme.typography.sm};
  color: ${({ theme }) => theme.colors.gray600};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.xs};
  color: ${({ theme }) => theme.colors.gray500};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ArticleTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ArticleTag = styled.span`
  padding: 2px ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray600};
  border-radius: ${({ theme }) => theme.borderRadius.xs};
  font-size: ${({ theme }) => theme.typography['2xs'] || '0.6875rem'};
`;

const ReadMoreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.sm};
  font-weight: ${({ theme }) => theme.typography.medium};
  text-decoration: none;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: ${({ theme }) => theme.typography.lg};
  color: ${({ theme }) => theme.colors.gray500};
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.typography.lg};
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.base};
  font-weight: ${({ theme }) => theme.typography.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray300};
    cursor: not-allowed;
  }
`;

const Articles = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch articles
  const fetchArticles = async (page = 1, append = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '6'
      });
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedTag) params.append('tag', selectedTag);
      
      const response = await api.get(`/api/articles?${params}`);
      const data = response.data.data;
      
      if (append) {
        setArticles(prev => [...prev, ...data.articles]);
      } else {
        setArticles(data.articles);
      }
      
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setHasMore(data.page < data.totalPages);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch metadata
  const fetchMetadata = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        api.get('/api/articles/meta/categories'),
        api.get('/api/articles/meta/tags')
      ]);
      
      setCategories(categoriesRes.data.data);
      setPopularTags(tagsRes.data.data);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchArticles(1, false);
  }, [searchQuery, selectedCategory, selectedTag]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchArticles(currentPage + 1, true);
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
  };

  if (loading && articles.length === 0) {
    return (
      <ArticlesPage>
        <Container>
          <LoadingSpinner>{t.common.loading}</LoadingSpinner>
        </Container>
      </ArticlesPage>
    );
  }

  return (
    <ArticlesPage>
      <Container>
        <Header>
          <Title>{t.articles.title}</Title>
          <Subtitle>{t.articles.subtitle}</Subtitle>
        </Header>

        <FiltersSection>
          <SearchBar>
            <SearchIcon icon={faSearch} />
            <SearchInput
              type="text"
              placeholder={t.articles.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>

          <FiltersRow>
            <FilterGroup>
              <FilterLabel>{t.articles.categories}</FilterLabel>
              <FilterSelect
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">{t.articles.filters.all}</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>

            {(searchQuery || selectedCategory || selectedTag) && (
              <button onClick={clearFilters} style={{ marginTop: '20px', padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                {t.articles.filters.clear}
              </button>
            )}
          </FiltersRow>

          <div>
            <FilterLabel>{t.articles.popularTags}</FilterLabel>
            <TagsSection>
              {popularTags.map(tag => (
                <TagButton
                  key={tag}
                  active={selectedTag === tag}
                  onClick={() => handleTagClick(tag)}
                >
                  <FontAwesomeIcon icon={faTag} style={{ marginRight: '4px' }} />
                  {tag}
                </TagButton>
              ))}
            </TagsSection>
          </div>
        </FiltersSection>

        {articles.length === 0 && !loading ? (
          <NoResults>{t.articles.noResults}</NoResults>
        ) : (
          <>
            <ArticlesGrid>
              <AnimatePresence>
                {articles.map(article => (
                  <ArticleCard
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {article.imageUrl && <ArticleImage imageUrl={article.imageUrl} />}
                    <ArticleContent>
                      <ArticleCategory>{article.category}</ArticleCategory>
                      <ArticleTitle>{article.title}</ArticleTitle>
                      <ArticleExcerpt>{article.excerpt}</ArticleExcerpt>
                      
                      <ArticleMeta>
                        <MetaItem>
                          <FontAwesomeIcon icon={faUser} />
                          {t.articles.author} {article.author}
                        </MetaItem>
                        <MetaItem>
                          <FontAwesomeIcon icon={faCalendar} />
                          {new Date(article.publishDate).toLocaleDateString(language === 'ZH' ? 'zh-TW' : 'en-US')}
                        </MetaItem>
                        <MetaItem>
                          <FontAwesomeIcon icon={faClock} />
                          {article.readTime} {t.articles.readTime}
                        </MetaItem>
                      </ArticleMeta>
                      
                      <ArticleTags>
                        {article.tags.slice(0, 3).map(tag => (
                          <ArticleTag key={tag}>{tag}</ArticleTag>
                        ))}
                      </ArticleTags>
                      
                      <ReadMoreButton to={`/articles/${article.slug}`}>
                        {t.articles.readMore} →
                      </ReadMoreButton>
                    </ArticleContent>
                  </ArticleCard>
                ))}
              </AnimatePresence>
            </ArticlesGrid>

            {hasMore && (
              <LoadMoreButton
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? t.common.loading : t.articles.loadMore}
              </LoadMoreButton>
            )}
          </>
        )}
      </Container>
    </ArticlesPage>
  );
};

export default Articles; 
