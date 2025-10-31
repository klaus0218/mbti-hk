const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WebsiteStat = sequelize.define('WebsiteStat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action: {
    type: DataTypes.ENUM('visit', 'start_test', 'complete_test'),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'website_stats',
  timestamps: true,
  indexes: [
    { fields: ['action', 'timestamp'] },
    { fields: ['ipAddress', 'action', 'timestamp'] }
  ]
});

// Class methods
WebsiteStat.trackAction = async function(ipAddress, action, metadata = {}) {
  return this.create({
    ipAddress,
    action,
    metadata,
    timestamp: new Date()
  });
};

WebsiteStat.getStatsByAction = async function(action, startDate, endDate) {
  const where = { action };
  
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp[Op.gte] = startDate;
    if (endDate) where.timestamp[Op.lte] = endDate;
  }
  
  return this.count({ where });
};

module.exports = WebsiteStat;
