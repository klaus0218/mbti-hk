const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Result = require('../models/Result');
const WebsiteStat = require('../models/WebsiteStat');
const adminAuth = require('../middleware/adminAuth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ where: { username } });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Add expiration time of 4 hours
    const token = jwt.sign(
      { id: admin.id },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    // Update lastActive
    await admin.update({ lastActive: new Date() });

    res.json({ 
      token,
      expiresIn: 4 * 60 * 60 * 1000 // 4 hours in milliseconds
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Verify admin token
router.get('/verify', adminAuth, async (req, res) => {
  try {
    // If we get here, the token is valid (adminAuth middleware passed)
    const admin = await Admin.findByPk(req.admin.id);
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }
    res.json({ valid: true, admin: { username: admin.username } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Get website statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const { timeRange } = req.query;
    const now = new Date();
    let startDate = new Date(0);

    switch (timeRange) {
      case 'day':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now - 365 * 24 * 60 * 60 * 1000);
        break;
      // 'all' will use startDate of 0
    }

    const { Op } = require('sequelize');
    const { sequelize } = require('../config/database');
    
    const stats = await WebsiteStat.findAll({
      where: {
        timestamp: { [Op.gte]: startDate }
      },
      attributes: [
        'action',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['action'],
      raw: true
    });

    res.json(stats.map(stat => ({
      _id: stat.action,
      count: parseInt(stat.count)
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// Get test results with pagination and search
router.get('/records', adminAuth, async (req, res) => {
  try {
    const { page = 1, search, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const { Op } = require('sequelize');
    const { sequelize } = require('../config/database');
    
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { mbtiType: { [Op.iLike]: `%${search}%` } },
          { sessionId: { [Op.iLike]: `%${search}%` } },
          sequelize.where(
            sequelize.cast(sequelize.col('demographics'), 'text'),
            Op.iLike,
            `%${search}%`
          )
        ]
      };
    }

    const { count, rows: results } = await Result.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: skip,
      attributes: ['sessionId', 'mbtiType', 'statistics', 'demographics', 'createdAt']
    });

    res.json({
      results: results.map(r => ({
        sessionId: r.sessionId,
        mbtiType: r.mbtiType,
        statistics: r.statistics,
        demographics: r.demographics,
        createdAt: r.createdAt
      })),
      total: count,
      pages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ message: 'Failed to fetch test results' });
  }
});

// Get test result detail by session ID
router.get('/records/:sessionId', adminAuth, async (req, res) => {
  try {
    const result = await Result.findOne({ where: { sessionId: req.params.sessionId } });
    if (!result) {
      return res.status(404).json({ message: 'Test result not found' });
    }
    // Format result manually
    res.json({
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
    });
  } catch (error) {
    console.error('Error fetching test result:', error);
    res.status(500).json({ message: 'Failed to fetch test result' });
  }
});

// Delete test result by session ID
router.delete('/records/:sessionId', adminAuth, async (req, res) => {
  try {
    const result = await Result.findOne({ where: { sessionId: req.params.sessionId } });
    
    if (!result) {
      return res.status(404).json({ 
        success: false,
        message: 'Test result not found' 
      });
    }

    const deletedData = {
      sessionId: result.sessionId,
      mbtiType: result.mbtiType,
      createdAt: result.createdAt,
      demographics: {
        name: result.demographics?.name,
        industry: result.demographics?.industry
      }
    };

    await result.destroy();

    res.json({ 
      success: true,
      message: 'Test result deleted successfully',
      deletedResult: deletedData
    });
  } catch (error) {
    console.error('Error deleting test result:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete test result',
      error: error.message 
    });
  }
});

// Get MBTI distribution with filters
router.get('/mbti-distribution', adminAuth, async (req, res) => {
  try {
    const { gender, industries, ageRanges } = req.query;
    const { Op } = require('sequelize');
    const { sequelize } = require('../config/database');
    
    let whereClause = {};
    
    // Note: Complex JSONB queries for demographics would require more sophisticated queries
    // For now, we'll get all results and filter in JavaScript
    const allResults = await Result.findAll({
      attributes: ['mbtiType', 'demographics']
    });
    
    // Filter results in JavaScript (simplified approach)
    let filtered = allResults;
    if (gender && gender !== '') {
      filtered = filtered.filter(r => r.demographics?.gender === gender);
    }
    if (industries && industries !== '') {
      const industryList = industries.split(',').map(i => i.trim().toLowerCase());
      filtered = filtered.filter(r => 
        r.demographics?.industry && 
        industryList.includes(r.demographics.industry.toLowerCase())
      );
    }
    
    // Group by mbtiType
    const distributionMap = {};
    filtered.forEach(r => {
      if (!distributionMap[r.mbtiType]) {
        distributionMap[r.mbtiType] = 0;
      }
      distributionMap[r.mbtiType]++;
    });
    
    const total = filtered.length;
    const distribution = Object.entries(distributionMap).map(([type, count]) => ({
      type,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    res.json(distribution);
  } catch (error) {
    console.error('Error fetching MBTI distribution:', error);
    res.status(500).json({ message: 'Failed to fetch MBTI distribution' });
  }
});

module.exports = router; 
