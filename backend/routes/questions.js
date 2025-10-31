const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { validateSession } = require('../middleware/validation');

// Load questions from JSON file
const loadQuestionsData = () => {
  try {
    const questionsPath = path.join(__dirname, '../data/questions.json');
    const data = fs.readFileSync(questionsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading questions data:', error);
    return null;
  }
};

// Get all questions organized by sections
router.get('/', async (req, res) => {
  try {
    const questionsData = loadQuestionsData();
    if (!questionsData) {
      return res.status(500).json({ message: 'Failed to load questions data' });
    }
    
    res.json(questionsData);
  } catch (error) {
    console.error('Questions fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
});

// Get questions by section
router.get('/section/:sectionId', async (req, res) => {
  try {
    const { sectionId } = req.params;
    const questionsData = loadQuestionsData();
    
    if (!questionsData) {
      return res.status(500).json({ message: 'Failed to load questions data' });
    }

    const section = questionsData.sections.find(s => s.sectionId === parseInt(sectionId));
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    res.json(section);
  } catch (error) {
    console.error('Section questions fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch section questions' });
  }
});

// Get questions by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const questionsData = loadQuestionsData();
    
    if (!questionsData) {
      return res.status(500).json({ message: 'Failed to load questions data' });
    }
    
    if (!['EI', 'SN', 'TF', 'FT', 'JP', 'PJ'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const categoryQuestions = [];
    questionsData.sections.forEach(section => {
      const questions = section.questions.filter(q => 
        q.category === category || 
        q.category === category.split('').reverse().join('')
      );
      categoryQuestions.push(...questions);
    });
    
    res.json({
      category,
      questions: categoryQuestions,
      total: categoryQuestions.length
    });
  } catch (error) {
    console.error('Category questions fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch questions by category' });
  }
});

// Get paginated questions for test with language support
router.get('/test/:sessionId', validateSession, async (req, res) => {
  try {
    const { page = 1, limit = 10, lang = 'zh' } = req.query;
    const questionsData = loadQuestionsData();
    
    if (!questionsData) {
      return res.status(500).json({ message: 'Failed to load questions data' });
    }

    // Flatten all questions from all sections
    const allQuestions = [];
    questionsData.sections.forEach(section => {
      section.questions.forEach(question => {
        allQuestions.push({
          ...question,
          sectionTitle: section.title[lang] || section.title.zh,
          sectionSubtitle: section.subtitle[lang] || section.subtitle.zh,
          text: question.text[lang] || question.text.zh,
          leftLabel: question.leftLabel[lang] || question.leftLabel.zh,
          rightLabel: question.rightLabel[lang] || question.rightLabel.zh
        });
      });
    });

    const skip = (page - 1) * limit;
    const paginatedQuestions = allQuestions.slice(skip, skip + parseInt(limit));
    
    res.json({
      questions: paginatedQuestions,
      scale: questionsData.scale,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(allQuestions.length / limit),
        total: allQuestions.length,
        hasNext: skip + parseInt(limit) < allQuestions.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Test questions fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch test questions' });
  }
});

// Get sections with basic info
router.get('/sections', async (req, res) => {
  try {
    const { lang = 'zh' } = req.query;
    const questionsData = loadQuestionsData();
    
    if (!questionsData) {
      return res.status(500).json({ message: 'Failed to load questions data' });
    }

    const sections = questionsData.sections.map(section => ({
      sectionId: section.sectionId,
      title: section.title[lang] || section.title.zh,
      subtitle: section.subtitle[lang] || section.subtitle.zh,
      questionCount: section.questions.length
    }));
    
    res.json({
      sections,
      totalQuestions: questionsData.sections.reduce((total, section) => 
        total + section.questions.length, 0
      ),
      scale: questionsData.scale
    });
  } catch (error) {
    console.error('Sections fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch sections' });
  }
});

// Get single question
router.get('/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { lang = 'zh' } = req.query;
    const questionsData = loadQuestionsData();
    
    if (!questionsData) {
      return res.status(500).json({ message: 'Failed to load questions data' });
    }

    let question = null;
    questionsData.sections.forEach(section => {
      const found = section.questions.find(q => q.questionId === parseInt(questionId));
      if (found) {
        question = {
          ...found,
          sectionTitle: section.title[lang] || section.title.zh,
          sectionSubtitle: section.subtitle[lang] || section.subtitle.zh,
          text: found.text[lang] || found.text.zh,
          leftLabel: found.leftLabel[lang] || found.leftLabel.zh,
          rightLabel: found.rightLabel[lang] || found.rightLabel.zh
        };
      }
    });
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    console.error('Question fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch question' });
  }
});

// Get question statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const questionsData = loadQuestionsData();
    
    if (!questionsData) {
      return res.status(500).json({ message: 'Failed to load questions data' });
    }

    const stats = {
      totalQuestions: 0,
      totalSections: questionsData.sections.length,
      questionsByCategory: {
        EI: 0,
        SN: 0,
        TF: 0,
        JP: 0
      },
      scale: questionsData.scale
    };

    questionsData.sections.forEach(section => {
      stats.totalQuestions += section.questions.length;
      
      section.questions.forEach(question => {
        const category = question.category.replace(/[^A-Z]/g, '');
        if (stats.questionsByCategory[category] !== undefined) {
          stats.questionsByCategory[category]++;
        }
      });
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch question statistics' });
  }
});

module.exports = router; 
