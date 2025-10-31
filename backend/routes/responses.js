const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Response = require('../models/Response');
const User = require('../models/User');
const { validateSession, validateResponse } = require('../middleware/validation');

// Bulk submit multiple responses
router.post('/bulk/:sessionId', validateSession, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { responses, language = 'zh' } = req.body;

    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({ message: 'Responses array is required' });
    }

    // Prepare bulk data - calculate strength directly for better performance
    const bulkData = responses.map(responseData => {
      const { questionId, answer, category, leftType, rightType, sectionId, timestamp, responseTime } = responseData;
      
      // Calculate strength directly (matches the beforeSave hook logic)
      // Left side: answer 1 = 1.0 (strong), answer 2 = 0.5 (slight)
      // Right side: answer 3 = 0.5 (slight), answer 4 = 1.0 (strong)
      let strength = 0.5;
      if (answer === 1 || answer === 4) {
        strength = 1.0;
      }
      
      return {
        sessionId,
        questionId,
        answer,
        category,
        selectedType: answer <= 2 ? leftType : rightType,
        strength, // Pre-calculated to avoid hook overhead
        sectionId,
        language,
        responseTime,
        metadata: {
          submissionType: 'bulk',
          batchSize: responses.length,
          timestamp: timestamp ? new Date(timestamp) : new Date()
        }
      };
    });

    // Optimized bulk upsert using Sequelize - batch operations
    // Use bulkCreate with updateOnDuplicate for better performance
    const existingResponses = await Response.findAll({
      where: {
        sessionId,
        questionId: { [Op.in]: bulkData.map(d => d.questionId) }
      },
      attributes: ['id', 'questionId']
    });

    const existingQuestionIds = new Set(existingResponses.map(r => r.questionId));
    const existingById = new Map(existingResponses.map(r => [r.questionId, r]));

    // Separate creates and updates
    const toCreate = bulkData.filter(d => !existingQuestionIds.has(d.questionId));
    const toUpdate = bulkData.filter(d => existingQuestionIds.has(d.questionId));

    // Batch create new responses (strength is already calculated, so no need for hooks)
    if (toCreate.length > 0) {
      await Response.bulkCreate(toCreate);
    }

    // Batch update existing responses
    // Note: update() will trigger beforeSave hook which recalculates strength
    // This ensures consistency even if strength calculation logic changes
    if (toUpdate.length > 0) {
      await Promise.all(
        toUpdate.map(data => {
          const existing = existingById.get(data.questionId);
          // Update without strength to let hook recalculate it, or use pre-calculated value
          return existing.update(data);
        })
      );
    }

    // Update user's progress only once at the end
    // Count actual total responses from database (more accurate than summing)
    const totalResponses = await Response.count({ where: { sessionId } });
    await User.update(
      { 
        currentQuestionIndex: totalResponses,
        status: 'in_progress'
      },
      { where: { sessionId } }
    );

    res.status(201).json({
      message: 'Bulk responses saved successfully',
      saved: responses.length,
      total: responses.length
    });
  } catch (error) {
    console.error('Bulk response save error:', error);
    res.status(500).json({ message: 'Failed to save bulk responses', error: error.message });
  }
});

// Submit response to a question
router.post('/:sessionId', validateSession, validateResponse, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, answer, category, selectedType, strength, sectionId, language, responseTime, metadata } = req.body;

    // Check if response already exists and update or create
    const [response, created] = await Response.findOrCreate({
      where: { sessionId, questionId },
      defaults: {
        answer,
        category,
        selectedType,
        strength,
        sectionId,
        language,
        responseTime: responseTime || req.body.timeSpent,
        metadata: metadata || {}
      }
    });

    if (!created) {
      await response.update({
        answer,
        category,
        selectedType,
        strength,
        sectionId,
        language,
        responseTime: responseTime || req.body.timeSpent,
        metadata: metadata || {}
      });
    }

    // Update user's current question index (debounced - only update if significant change)
    // In production, consider using a debounce or batch update mechanism
    // For now, we'll update but this could be optimized further
    const currentResponses = await Response.count({ where: { sessionId } });
    await User.update(
      { 
        currentQuestionIndex: currentResponses,
        status: 'in_progress'
      },
      { where: { sessionId } }
    );

    res.status(201).json({
      message: 'Response saved successfully',
      responseId: response.id
    });
  } catch (error) {
    console.error('Response save error:', error);
    res.status(500).json({ message: 'Failed to save response' });
  }
});

// Get all responses for a session
router.get('/session/:sessionId', validateSession, async (req, res) => {
  try {
    const responses = await Response.findAll({
      where: { sessionId: req.params.sessionId },
      order: [['questionId', 'ASC']]
    });
    
    res.json(responses);
  } catch (error) {
    console.error('Responses fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch responses' });
  }
});

// Get response for specific question in session
router.get('/session/:sessionId/question/:questionId', validateSession, async (req, res) => {
  try {
    const { sessionId, questionId } = req.params;
    
    const response = await Response.findOne({ 
      where: { 
        sessionId, 
        questionId: parseInt(questionId) 
      }
    });
    
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }
    
    res.json(response);
  } catch (error) {
    console.error('Response fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch response' });
  }
});

// Update existing response
router.put('/:responseId', validateSession, validateResponse, async (req, res) => {
  try {
    const { answer, timeSpent } = req.body;
    
    const response = await Response.findByPk(req.params.responseId);
    
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    await response.update({
      answer,
      responseTime: timeSpent,
      metadata: {
        ...response.metadata,
        timestamp: new Date()
      }
    });

    res.json({
      message: 'Response updated successfully',
      response
    });
  } catch (error) {
    console.error('Response update error:', error);
    res.status(500).json({ message: 'Failed to update response' });
  }
});

// Delete response
router.delete('/:responseId', validateSession, async (req, res) => {
  try {
    const response = await Response.findByPk(req.params.responseId);
    
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    await response.destroy();
    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Response delete error:', error);
    res.status(500).json({ message: 'Failed to delete response' });
  }
});

// Get session progress
router.get('/progress/:sessionId', validateSession, async (req, res) => {
  try {
    const responseCount = await Response.count({ 
      where: { sessionId: req.params.sessionId } 
    });
    
    // Note: Questions are loaded from JSON file, not database
    // This is a placeholder - adjust based on your questions data
    const Question = require('../models/Question');
    const totalQuestions = await Question.count({ where: { isActive: true } });

    const progress = {
      completed: responseCount,
      total: totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((responseCount / totalQuestions) * 100) : 0,
      isComplete: responseCount >= totalQuestions
    };

    res.json(progress);
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
});

module.exports = router;
