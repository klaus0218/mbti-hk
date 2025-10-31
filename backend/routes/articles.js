const express = require('express');
const router = express.Router();
const { articles, categories, popularTags } = require('../data/articlesData');

// Get all articles with optional filtering
router.get('/', (req, res) => {
  try {
    const { category, tag, search, limit = 10, page = 1 } = req.query;
    
    let filteredArticles = [...articles];
    
    // Filter by category
    if (category && category !== '全部') {
      filteredArticles = filteredArticles.filter(article => 
        article.category === category
      );
    }
    
    // Filter by tag
    if (tag) {
      filteredArticles = filteredArticles.filter(article => 
        article.tags.includes(tag)
      );
    }
    
    // Search in title and excerpt
    if (search) {
      const searchLower = search.toLowerCase();
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by publish date (newest first)
    filteredArticles.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        articles: paginatedArticles,
        total: filteredArticles.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filteredArticles.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch articles'
    });
  }
});

// Get single article by ID or slug
router.get('/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Find by ID or slug
    const article = articles.find(article => 
      article.id.toString() === identifier || article.slug === identifier
    );
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    // Get related articles (same category, excluding current article)
    const relatedArticles = articles
      .filter(a => a.id !== article.id && a.category === article.category)
      .slice(0, 3);
    
    res.json({
      success: true,
      data: {
        article,
        relatedArticles
      }
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch article'
    });
  }
});

// Get categories
router.get('/meta/categories', (req, res) => {
  try {
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// Get popular tags
router.get('/meta/tags', (req, res) => {
  try {
    res.json({
      success: true,
      data: popularTags
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags'
    });
  }
});

// Get featured articles (top 3 most recent)
router.get('/featured/latest', (req, res) => {
  try {
    const featuredArticles = articles
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      .slice(0, 3);
    
    res.json({
      success: true,
      data: featuredArticles
    });
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured articles'
    });
  }
});

module.exports = router; 
