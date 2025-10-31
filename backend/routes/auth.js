const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { validateSession } = require('../middleware/validation');
const { trackTestStart } = require('../middleware/statsTracking');

// Create new session
router.post('/session', trackTestStart, async (req, res) => {
  try {
    const sessionId = uuidv4();
    const { email, name } = req.body;
    
    const user = await User.create({
      sessionId,
      email,
      name,
      metadata: {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        language: req.get('Accept-Language'),
        timezone: req.body.timezone
      }
    });
    
    res.status(201).json({
      sessionId,
      message: 'Session created successfully'
    });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ message: 'Failed to create session' });
  }
});

// Get session info
router.get('/session/:sessionId', validateSession, async (req, res) => {
  try {
    const user = await User.findOne({ where: { sessionId: req.params.sessionId } });
    
    if (!user) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      sessionId: user.sessionId,
      status: user.status,
      currentQuestionIndex: user.currentQuestionIndex,
      startedAt: user.startedAt,
      completedAt: user.completedAt
    });
  } catch (error) {
    console.error('Session fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch session' });
  }
});

// Update session status
router.patch('/session/:sessionId', validateSession, async (req, res) => {
  try {
    const { status, currentQuestionIndex } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (currentQuestionIndex !== undefined) updateData.currentQuestionIndex = currentQuestionIndex;
    if (status === 'completed') updateData.completedAt = new Date();

    const [updatedCount] = await User.update(
      updateData,
      { where: { sessionId: req.params.sessionId }, returning: true }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const user = await User.findOne({ where: { sessionId: req.params.sessionId } });
    res.json({ message: 'Session updated successfully', user });
  } catch (error) {
    console.error('Session update error:', error);
    res.status(500).json({ message: 'Failed to update session' });
  }
});

module.exports = router; 
