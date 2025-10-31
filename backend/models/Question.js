const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('EI', 'SN', 'TF', 'JP'),
    allowNull: false
  },
  direction: {
    type: DataTypes.ENUM('positive', 'negative'),
    allowNull: false
  },
  options: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'questions',
  timestamps: true,
  indexes: [
    { fields: ['questionId'], unique: true },
    { fields: ['order'] },
    { fields: ['category', 'order'] },
    { fields: ['isActive'] }
  ]
});

// Class methods
Question.findActive = function() {
  return this.findAll({ where: { isActive: true }, order: [['order', 'ASC']] });
};

Question.findByCategory = function(category) {
  return this.findAll({ 
    where: { category, isActive: true }, 
    order: [['order', 'ASC']] 
  });
};

Question.findByQuestionId = function(questionId) {
  return this.findOne({ where: { questionId } });
};

module.exports = Question;
