const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
const Result = require('../models/Result');
const Response = require('../models/Response');
const fs = require('fs');
const path = require('path');
const { calculateMBTI, validateResponses, getDimensionBreakdown, getTypeRecommendations } = require('../utils/mbtiCalculator');
const { validateSession } = require('../middleware/validation');
const { trackTestComplete } = require('../middleware/statsTracking');

// Load questions data for calculation
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

// Calculate and save MBTI results
router.post('/calculate/:sessionId', validateSession, trackTestComplete, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId, demographics, language = 'zh' } = req.body;
    
    // Get all responses for this session
    const responses = await Response.findAll({ 
      where: { sessionId },
      order: [['questionId', 'ASC']]
    });
    
    if (responses.length === 0) {
      return res.status(400).json({ message: 'No responses found for this session' });
    }
    
    // Load questions data
    const questionsData = loadQuestionsData();
    if (!questionsData) {
      return res.status(500).json({ message: 'Failed to load questions data' });
    }
    
    // Validate completeness
    const validation = validateResponses(responses, questionsData);
    if (!validation.isComplete) {
      return res.status(400).json({ 
        message: 'Test not complete', 
        validation 
      });
    }
    
    const startTime = Date.now();
    
    // Calculate MBTI type
    const calculationResult = calculateMBTI(responses, questionsData);
    const dimensionBreakdown = getDimensionBreakdown(responses, questionsData);
    const recommendations = getTypeRecommendations(calculationResult.type);
    
    const processingTime = Date.now() - startTime;
    
    // Calculate average response time
    const responseTimesSum = responses
      .filter(r => r.responseTime)
      .reduce((sum, r) => sum + r.responseTime, 0);
    const averageResponseTime = responseTimesSum / responses.filter(r => r.responseTime).length || 0;
    
    // Prepare result data
    const resultData = {
      sessionId,
      userId,
      mbtiType: calculationResult.type,
      scores: {
        raw: calculationResult.rawScores,
        normalized: calculationResult.scores
      },
      dimensions: calculationResult.dimensions,
      confidence: calculationResult.confidence,
      typeInfo: calculationResult.typeInfo,
      celebrities: calculationResult.celebrities,
      recommendations,
      statistics: {
        totalQuestions: validation.totalQuestions,
        totalResponses: responses.length,
        completionPercentage: validation.completionPercentage,
        averageResponseTime,
        categoryBreakdown: dimensionBreakdown
      },
      demographics: demographics || {},
      language,
      isComplete: true,
      metadata: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        testVersion: '4-point-scale-v1',
        calculationMethod: '4-point-scale',
        processingTime
      }
    };

    console.log(resultData)
    console.log(resultData.dimensions)
    
    // Save or update result
    const [result, created] = await Result.findOrCreate({
      where: { sessionId },
      defaults: resultData
    });

    if (!created) {
      await result.update(resultData);
    }
    
    // Format response manually
    const formattedResult = {
      sessionId: result.sessionId,
      mbtiType: result.mbtiType,
      typeInfo: result.typeInfo,
      scores: result.scores,
      dimensions: result.dimensions,
      confidence: result.confidence,
      typeStrength: result.getTypeStrength(),
      celebrities: result.celebrities,
      recommendations: result.recommendations,
      statistics: result.statistics,
      compatibility: result.getCompatibility(),
      createdAt: result.createdAt,
      demographics: result.demographics,
      premium: result.premium,
      isPremiumUnlocked: result.isPremiumUnlocked
    };
    
    res.json({
      success: true,
      result: formattedResult,
      message: 'MBTI result calculated successfully'
    });
    
  } catch (error) {
    console.error('Result calculation error:', error);
    res.status(500).json({ 
      message: 'Failed to calculate MBTI result',
      error: error.message
    });
  }
});

// Get result by session ID
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { language = 'zh' } = req.query;
    
    const result = await Result.findOne({ where: { sessionId } });
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    
    // Format response manually
    const formattedResult = {
      sessionId: result.sessionId,
      mbtiType: result.mbtiType,
      typeInfo: result.typeInfo,
      scores: result.scores,
      dimensions: result.dimensions,
      confidence: result.confidence,
      typeStrength: result.getTypeStrength(),
      celebrities: result.celebrities,
      recommendations: result.recommendations,
      statistics: result.statistics,
      compatibility: result.getCompatibility(),
      createdAt: result.createdAt,
      demographics: result.demographics,
      premium: result.premium,
      isPremiumUnlocked: result.isPremiumUnlocked
    };
    
    res.json({ result: formattedResult });
  } catch (error) {
    console.error('Result fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch result' });
  }
});

// Get shared result by share ID
router.get('/shared/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    const { language = 'zh' } = req.query;
    
    // Note: shareId functionality not implemented in current model
    // This route may need additional fields in the Result model
    const result = null; // await Result.findOne({ where: { shareId, sharedPublicly: true } });
    if (!result) {
      return res.status(404).json({ message: 'Shared result not found' });
    }
    
    // Format response manually since toAPIResponse method was removed
    const publicResult = {
      sessionId: result.sessionId,
      mbtiType: result.mbtiType,
      typeInfo: result.typeInfo,
      scores: result.scores,
      dimensions: result.dimensions,
      confidence: result.confidence,
      typeStrength: result.typeStrength,
      celebrities: result.celebrities,
      recommendations: result.recommendations,
      statistics: result.statistics,
      compatibility: result.getCompatibility ? result.getCompatibility() : [],
      createdAt: result.createdAt
    };
    
    // Remove sensitive information for public sharing
    delete publicResult.demographics;
    delete publicResult.statistics.averageResponseTime;
    
    res.json(publicResult);
  } catch (error) {
    console.error('Shared result fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch shared result' });
  }
});

// Share result publicly
router.post('/:sessionId/share', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { enable = true } = req.body;
    
    const result = await Result.findOne({ sessionId });
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    
    // Simplified sharing - just update the shared flag
    // Note: Full sharing functionality requires additional fields that were removed
    // For now, just return success without implementing full sharing
    
    res.json({
      success: true,
      message: enable ? 'Sharing enabled' : 'Sharing disabled',
      note: 'Full sharing functionality requires additional implementation'
    });
  } catch (error) {
    console.error('Result sharing error:', error);
    res.status(500).json({ message: 'Failed to update sharing settings' });
  }
});

// Update result with user email
router.put('/:sessionId/email', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { email } = req.body;
    
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const result = await Result.findOne({ where: { sessionId } });
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    
    // Update demographics with email
    const demographics = result.demographics || {};
    demographics.email = email.trim().toLowerCase();
    
    await result.update({ demographics });
    
    res.json({
      success: true,
      message: 'Email updated successfully',
      email: result.demographics.email
    });
  } catch (error) {
    console.error('Email update error:', error);
    res.status(500).json({ message: 'Failed to update email' });
  }
});

// Get MBTI type statistics
router.get('/stats/distribution', async (req, res) => {
  try {
    const distribution = await Result.getTypeDistribution();
    res.json(distribution);
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// Get detailed statistics
router.get('/stats/detailed', async (req, res) => {
  try {
    // Simplified stats using Sequelize
    const { Op } = require('sequelize');
    const results = await Result.findAll({
      where: {
        premium: { [Op.ne]: null }
      },
      attributes: ['mbtiType', 'demographics']
    });
    
    const typeDistribution = results.map(r => ({
      type: r.mbtiType,
      demographics: r.demographics
    }));
    
    res.json({
      totalResults: results.length,
      typeDistribution
    });
  } catch (error) {
    console.error('Detailed stats fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch detailed statistics' });
  }
});

// Get user's result history (requires authentication)
router.get('/user/:userId/history', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, language = 'zh' } = req.query;
    
    const { Op } = require('sequelize');
    const offset = (page - 1) * limit;
    
    const { count, rows: results } = await Result.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });
    
    const formattedResults = results.map(result => ({
      sessionId: result.sessionId,
      mbtiType: result.mbtiType,
      typeInfo: result.typeInfo,
      scores: result.scores,
      dimensions: result.dimensions,
      confidence: result.confidence,
      typeStrength: result.getTypeStrength(),
      celebrities: result.celebrities,
      recommendations: result.recommendations,
      statistics: result.statistics,
      compatibility: result.getCompatibility(),
      createdAt: result.createdAt,
      demographics: result.demographics,
      premium: result.premium
    }));
    
    res.json({
      results: formattedResults,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(count / limit),
        total: count,
        hasNext: offset + parseInt(limit) < count,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('User history fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch user result history' });
  }
});

// Get result by email (latest result for the email)
router.post('/email', async (req, res) => {
  try {
    const { email } = req.body;
    const { language = 'zh' } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find the latest result for this email using JSONB query
    const { Op } = require('sequelize');
    const result = await Result.findOne({
      where: sequelize.where(
        sequelize.cast(sequelize.col('demographics'), 'text'),
        Op.like,
        `%${email.toLowerCase()}%`
      ),
      order: [['createdAt', 'DESC']]
    });
    
    if (!result) {
      return res.status(404).json({ message: 'No test results found for this email address' });
    }
    
    res.json({
      result: {
        sessionId: result.sessionId,
        mbtiType: result.mbtiType,
        typeInfo: result.typeInfo,
        scores: result.scores,
        dimensions: result.dimensions,
        confidence: result.confidence,
        typeStrength: result.getTypeStrength(),
        celebrities: result.celebrities,
        recommendations: result.recommendations,
        statistics: result.statistics,
        compatibility: result.getCompatibility(),
        createdAt: result.createdAt,
        demographics: result.demographics,
        premium: result.premium
      },
      message: 'Result found successfully'
    });
  } catch (error) {
    console.error('Email result lookup error:', error);
    res.status(500).json({ message: 'Failed to retrieve result by email' });
  }
});

// Compare two results
router.get('/compare/:sessionId1/:sessionId2', async (req, res) => {
  try {
    const { sessionId1, sessionId2 } = req.params;
    const { language = 'zh' } = req.query;
    
    const [result1, result2] = await Promise.all([
      Result.findOne({ where: { sessionId: sessionId1 } }),
      Result.findOne({ where: { sessionId: sessionId2 } })
    ]);
    
    if (!result1 || !result2) {
      return res.status(404).json({ message: 'One or both results not found' });
    }
    
    // Calculate compatibility score
    const compatibility1 = result1.getCompatibility();
    const compatibility2 = result2.getCompatibility();
    
    const isCompatible = compatibility1.includes(result2.mbtiType) || 
                        compatibility2.includes(result1.mbtiType);
    
    // Calculate dimension differences
    const dimensionDifferences = {};
    ['EI', 'SN', 'TF', 'JP'].forEach(dimension => {
      dimensionDifferences[dimension] = Math.abs(
        result1.confidence[dimension] - result2.confidence[dimension]
      );
    });
    
    // Format results for comparison
    const formatResult = (r) => ({
      sessionId: r.sessionId,
      mbtiType: r.mbtiType,
      typeInfo: r.typeInfo,
      scores: r.scores,
      dimensions: r.dimensions,
      confidence: r.confidence,
      typeStrength: r.getTypeStrength(),
      celebrities: r.celebrities,
      recommendations: r.recommendations,
      statistics: r.statistics,
      compatibility: r.getCompatibility(),
      createdAt: r.createdAt
    });
    
    res.json({
      result1: formatResult(result1),
      result2: formatResult(result2),
      comparison: {
        isCompatible,
        compatibilityScore: isCompatible ? 85 : 45, // Simplified scoring
        dimensionDifferences,
        sharedTraits: [], // Could be enhanced with trait comparison
        complementaryAreas: [] // Could be enhanced with analysis
      }
    });
  } catch (error) {
    console.error('Result comparison error:', error);
    res.status(500).json({ message: 'Failed to compare results' });
  }
});

module.exports = router; 
