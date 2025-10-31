const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const INACTIVE_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    // Check for inactivity timeout
    const lastActive = admin.lastActive || admin.updatedAt;
    const now = new Date();
    if (now - lastActive > INACTIVE_TIMEOUT) {
      return res.status(401).json({ message: 'Session expired' });
    }

    // Update last active timestamp
    await admin.update({ lastActive: now });

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = adminAuth; 
