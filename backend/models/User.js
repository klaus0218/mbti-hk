const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
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
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    },
    set(value) {
      this.setDataValue('email', value ? value.toLowerCase().trim() : null);
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    trim: true
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('started', 'in_progress', 'completed'),
    defaultValue: 'started'
  },
  currentQuestionIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  mbtiType: {
    type: DataTypes.ENUM(
      'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
      'ISTP', 'ISFP', 'INFP', 'INTP',
      'ESTP', 'ESFP', 'ENFP', 'ENTP',
      'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
    ),
    allowNull: true
  },
  scores: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  answers: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 120
    }
  },
  industry: {
    type: DataTypes.ENUM(
      'Technology',
      'Healthcare',
      'Finance',
      'Education',
      'Manufacturing',
      'Retail',
      'Other'
    ),
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    { fields: ['sessionId'], unique: true },
    { fields: ['mbtiType', 'gender'] },
    { fields: ['mbtiType', 'industry'] },
    { fields: ['mbtiType', 'age'] },
    { fields: ['status', 'completedAt'] },
    { fields: ['createdAt'] }
  ],
  hooks: {
    beforeCreate: (user) => {
      // Set metadata defaults if not provided
      if (!user.metadata) {
        user.metadata = {};
      }
    }
  }
});

// Class methods
User.findBySessionId = function(sessionId) {
  return this.findOne({ where: { sessionId } });
};

User.updateBySessionId = function(sessionId, updates) {
  return this.update(updates, { where: { sessionId }, returning: true });
};

// Instance methods
User.prototype.updateStatus = function(status) {
  this.status = status;
  if (status === 'completed') {
    this.completedAt = new Date();
  }
  return this.save();
};

module.exports = User;
