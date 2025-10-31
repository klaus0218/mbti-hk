const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const AIAnalysis = sequelize.define('AIAnalysis', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
    index: true
  },
  mbtiType: {
    type: DataTypes.ENUM(
      'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ),
    allowNull: false,
    index: true
  },
  fullReport: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    defaultValue: 'gemini-2.5-flash'
  },
  tokens: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPremiumUnlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  unlockedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  relevantContent: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  packageId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  userLanguage: {
    type: DataTypes.ENUM('en', 'zh'),
    defaultValue: 'en'
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    },
    set(value) {
      this.setDataValue('userEmail', value ? value.toLowerCase().trim() : null);
    }
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastViewed: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'ai_analyses',
  timestamps: true,
  indexes: [
    { fields: ['sessionId', 'mbtiType'], unique: true },
    { fields: ['userId', 'mbtiType'] },
    { fields: ['mbtiType', 'createdAt'] },
    { fields: ['isPremiumUnlocked', 'createdAt'] },
    { fields: ['expiresAt'] }
  ],
  hooks: {
    beforeCreate: (analysis) => {
      // Generate package ID if not exists
      if (!analysis.packageId) {
        analysis.packageId = `analysis_${analysis.mbtiType}_${Date.now()}`;
      }
      
      // Set expiration if not set
      if (!analysis.expiresAt) {
        analysis.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
    }
  }
});

// Instance methods
AIAnalysis.prototype.getFullReportLength = function() {
  return this.fullReport ? JSON.stringify(this.fullReport).length : 0;
};

AIAnalysis.prototype.isExpired = function() {
  return this.expiresAt && new Date() > this.expiresAt;
};

AIAnalysis.prototype.extendExpiration = async function(days = 30) {
  this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return this.save();
};

AIAnalysis.prototype.unlockPremium = async function() {
  this.isPremiumUnlocked = true;
  this.unlockedAt = new Date();
  return this.save();
};

AIAnalysis.prototype.incrementView = async function() {
  this.viewCount += 1;
  this.lastViewed = new Date();
  return this.save();
};

// Static methods
AIAnalysis.findByUserAndType = function(sessionId, mbtiType) {
  return this.findOne({ where: { sessionId, mbtiType } });
};

AIAnalysis.findByUserIdAndType = function(userId, mbtiType) {
  return this.findOne({ where: { userId, mbtiType } });
};

AIAnalysis.getAnalysisStats = async function() {
  try {
    const stats = await this.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalAnalyses'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN \"isPremiumUnlocked\" = true THEN 1 ELSE 0 END")), 'totalPremium'],
        [sequelize.fn('AVG', sequelize.col('tokens')), 'avgTokens'],
        [sequelize.fn('SUM', sequelize.col('viewCount')), 'totalViews']
      ],
      raw: true
    });
    
    return stats[0] || {
      totalAnalyses: 0,
      totalPremium: 0,
      avgTokens: 0,
      totalViews: 0
    };
  } catch (error) {
    throw new Error(`Error getting analysis stats: ${error.message}`);
  }
};

AIAnalysis.getTypeDistribution = async function() {
  try {
    const distribution = await this.findAll({
      attributes: [
        'mbtiType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN \"isPremiumUnlocked\" = true THEN 1 ELSE 0 END")), 'premiumCount']
      ],
      group: ['mbtiType'],
      order: [[sequelize.literal('count'), 'DESC']],
      raw: true
    });
    
    return distribution;
  } catch (error) {
    throw new Error(`Error getting type distribution: ${error.message}`);
  }
};

module.exports = AIAnalysis;
