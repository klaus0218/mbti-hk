const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Response = sequelize.define('Response', {
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
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    index: true
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  answer: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 4,
      isIn: [[1, 2, 3, 4]]
    }
  },
  category: {
    type: DataTypes.ENUM('EI', 'SN', 'TF', 'FT', 'JP', 'PJ'),
    allowNull: false
  },
  selectedType: {
    type: DataTypes.ENUM('E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'),
    allowNull: true
  },
  strength: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 1.5  // Allow up to 1.5 to handle temporary values before hook recalculation
    }
  },
  responseTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  language: {
    type: DataTypes.ENUM('zh', 'en'),
    defaultValue: 'zh'
  },
  isRevised: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  previousAnswer: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 4
    }
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'responses',
  timestamps: true,
  indexes: [
    { fields: ['sessionId', 'questionId'], unique: true },
    { fields: ['sessionId', 'category'] },
    { fields: ['userId', 'createdAt'] },
    { fields: ['category', 'answer'] }
  ],
  hooks: {
    beforeSave: (response) => {
      // Calculate strength based on answer
      if (response.answer <= 2) {
        // Left side selected (1 = strong, 2 = slight)
        response.strength = response.answer === 1 ? 1.0 : 0.5;
      } else {
        // Right side selected (3 = slight, 4 = strong)
        response.strength = response.answer === 4 ? 1.0 : 0.5;
      }
      
      // Set metadata timestamp if new
      if (response.isNewRecord && !response.metadata?.timestamp) {
        response.metadata = response.metadata || {};
        response.metadata.timestamp = new Date();
      }
    }
  }
});

// Class methods
Response.findBySessionId = function(sessionId) {
  return this.findAll({ 
    where: { sessionId }, 
    order: [['questionId', 'ASC']] 
  });
};

Response.calculateSessionScores = async function(sessionId) {
  try {
    const responses = await this.findAll({ 
      where: { sessionId },
      order: [['questionId', 'ASC']]
    });
    
    const scores = {
      E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
    };
    
    const categoryStats = {
      EI: { count: 0, totalStrength: 0 },
      SN: { count: 0, totalStrength: 0 },
      TF: { count: 0, totalStrength: 0 },
      JP: { count: 0, totalStrength: 0 }
    };
    
    responses.forEach(response => {
      const category = response.category.replace(/[^A-Z]/g, '');
      
      if (categoryStats[category]) {
        categoryStats[category].count++;
        categoryStats[category].totalStrength += parseFloat(response.strength || 0);
      }
      
      // Add to appropriate type score based on answer
      if (response.answer <= 2) {
        // Left side answer
        const leftType = category[0];
        scores[leftType] += parseFloat(response.strength || 0);
      } else {
        // Right side answer  
        const rightType = category[1];
        scores[rightType] += parseFloat(response.strength || 0);
      }
    });
    
    return {
      scores,
      categoryStats,
      totalResponses: responses.length,
      responseDetails: responses
    };
  } catch (error) {
    throw new Error(`Error calculating session scores: ${error.message}`);
  }
};

// Instance methods
Response.prototype.getAnswerDescription = function(language = 'zh') {
  const descriptions = {
    1: { zh: '強烈偏向左邊', en: 'Strongly Left' },
    2: { zh: '輕微偏向左邊', en: 'Slightly Left' },
    3: { zh: '輕微偏向右邊', en: 'Slightly Right' },
    4: { zh: '強烈偏向右邊', en: 'Strongly Right' }
  };
  
  return descriptions[this.answer]?.[language] || descriptions[this.answer]?.zh || 'Unknown';
};

Response.prototype.getFormattedResponseTime = function() {
  if (!this.responseTime) return null;
  
  if (this.responseTime < 1000) {
    return `${this.responseTime}ms`;
  } else if (this.responseTime < 60000) {
    return `${(this.responseTime / 1000).toFixed(1)}s`;
  } else {
    return `${(this.responseTime / 60000).toFixed(1)}m`;
  }
};

module.exports = Response;
