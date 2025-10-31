const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const Result = sequelize.define('Result', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    index: true
  },
  mbtiType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  typeInfo: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  scores: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  celebrities: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  recommendations: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  statistics: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  compatibility: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  dimensions: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  confidence: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  demographics: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  premiumUnlockedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isPremiumUnlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'results',
  timestamps: true,
  indexes: [
    { fields: ['sessionId'], unique: true },
    { fields: ['mbtiType'] },
    { fields: ['premium'] },
    { fields: ['createdAt'] }
    // Note: GIN index for demographics JSONB field is created manually after sync
  ]
});

// Virtual methods (computed in instance methods for Sequelize)
Result.prototype.getTypeStrength = function() {
  if (!this.confidence) return 0;
  
  const avgConfidence = (
    (this.confidence.EI || 0) + 
    (this.confidence.SN || 0) + 
    (this.confidence.TF || 0) + 
    (this.confidence.JP || 0)
  ) / 4;
  
  return Math.round(avgConfidence);
};

// Instance method to get type compatibility
Result.prototype.getCompatibility = function() {
  const compatibility = {
    INTJ: ['ENFP', 'ENTP', 'INFJ', 'INFP'],
    INTP: ['ENFJ', 'ENTJ', 'INFJ', 'INTJ'],
    ENTJ: ['INFP', 'INTP', 'ENFP', 'ENTP'],
    ENTP: ['INFJ', 'INTJ', 'ENFJ', 'ENTJ'],
    INFJ: ['ENFP', 'ENTP', 'INTJ', 'INFP'],
    INFP: ['ENFJ', 'ENTJ', 'INFJ', 'INTJ'],
    ENFJ: ['INFP', 'INTP', 'ENFP', 'ENTP'],
    ENFP: ['INFJ', 'INTJ', 'ENFJ', 'ENTJ'],
    ISTJ: ['ESFP', 'ESTP', 'ISFJ', 'ISFP'],
    ISFJ: ['ESFP', 'ESTP', 'ISTJ', 'ISFP'],
    ESTJ: ['ISFP', 'ISTP', 'ESFJ', 'ESTP'],
    ESFJ: ['ISFP', 'ISTP', 'ESTJ', 'ESFP'],
    ISTP: ['ESFJ', 'ESTJ', 'ISFJ', 'ISFP'],
    ISFP: ['ESFJ', 'ESTJ', 'ISFJ', 'ISTP'],
    ESTP: ['ISFJ', 'ISTJ', 'ESFJ', 'ESFP'],
    ESFP: ['ISFJ', 'ISTJ', 'ESFJ', 'ESTP']
  };
  
  return compatibility[this.mbtiType] || [];
};

// Static method to get type distribution statistics
Result.getTypeDistribution = async function() {
  try {
    const results = await this.findAll({
      where: {
        premium: { [Op.or]: [true, false] }
      },
      attributes: ['mbtiType', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['mbtiType'],
      order: [[sequelize.literal('count'), 'DESC']],
      raw: true
    });
    
    const total = results.reduce((sum, item) => sum + parseInt(item.count), 0);
    
    return results.map(item => ({
      type: item.mbtiType,
      count: parseInt(item.count),
      percentage: total > 0 ? Math.round((parseInt(item.count) / total) * 100) : 0
    }));
  } catch (error) {
    throw new Error(`Error getting type distribution: ${error.message}`);
  }
};

Result.findBySessionId = function(sessionId) {
  return this.findOne({ where: { sessionId } });
};

module.exports = Result;
