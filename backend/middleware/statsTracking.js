const WebsiteStat = require('../models/WebsiteStat');

const trackVisit = async (req, res, next) => {
  try {
    const ipAddress = req.ip;
    const action = 'visit';

    // Check for recent visit from same IP (within 3 hours)
    const { Op } = require('sequelize');
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const recentVisit = await WebsiteStat.findOne({
      where: {
        ipAddress,
        action,
        timestamp: { [Op.gte]: threeHoursAgo }
      }
    });

    if (!recentVisit) {
      await WebsiteStat.create({
        ipAddress,
        action,
        metadata: {
          userAgent: req.get('User-Agent'),
          language: req.get('Accept-Language'),
          timezone: req.body.timezone
        }
      });
    }
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
  next();
};

const trackTestStart = async (req, res, next) => {
  try {
    await WebsiteStat.create({
      ipAddress: req.ip,
      action: 'start_test',
      metadata: {
        userAgent: req.get('User-Agent'),
        language: req.get('Accept-Language'),
        timezone: req.body.timezone
      }
    });
  } catch (error) {
    console.error('Error tracking test start:', error);
  }
  next();
};

const trackTestComplete = async (req, res, next) => {
  try {
    await WebsiteStat.create({
      ipAddress: req.ip,
      action: 'complete_test',
      metadata: {
        userAgent: req.get('User-Agent'),
        language: req.get('Accept-Language'),
        timezone: req.body.timezone
      }
    });
  } catch (error) {
    console.error('Error tracking test completion:', error);
  }
  next();
};

module.exports = {
  trackVisit,
  trackTestStart,
  trackTestComplete
}; 
