require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { sequelize, testConnection } = require('./config/database');
const { trackVisit, trackTestStart, trackTestComplete } = require('./middleware/statsTracking');
const htmlReportGenerator = require('./services/htmlReportGenerator');

// Import models to initialize them
require('./models/User');
require('./models/Question');
require('./models/Response');
require('./models/Result');
require('./models/Admin');
require('./models/AIAnalysis');
require('./models/WebsiteStat');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(limiter);

// Enhanced CORS configuration for mobile access
const allowedOrigins = [
  'http://localhost:9090',
  'http://localhost:3000',
  'http://127.0.0.1:9090',
  'http://127.0.0.1:3000',
  'http://192.168.0.9:9090',
  'http://17.92.230.215:9090',
  'http://17.92.230.215:9091',
  
  // Allow any local network IP for development with common ports
  /^http:\/\/192\.168\.\d+\.\d+:(3000|9090|9091)$/,
  /^http:\/\/10\.\d+\.\d+\.\d+:(3000|9090|9091)$/,
  /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:(3000|9090|9091)$/,
  
  // Allow any IP for development (less secure but works for development)
  /^http:\/\/\d+\.\d+\.\d+\.\d+:(3000|9090|9091)$/,
];

// Add Render frontend URL if specified in environment
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Allow all Render.com subdomains (for flexibility)
if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push(/^https:\/\/.*\.onrender\.com$/);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Access-Control-Allow-Origin']
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection and sync
(async () => {
  try {
    const connected = await testConnection();
    if (!connected) {
      process.exit(1);
    }
    
    // Sync database (creates tables if they don't exist)
    // Use { alter: true } in development, { force: false } in production
    const syncOptions = process.env.NODE_ENV === 'production' 
      ? { alter: false }  // Don't alter schema in production
      : { alter: true };   // Safe to alter in development
    
    await sequelize.sync(syncOptions);
    console.log('✅ Database synchronized');
    
    // Create GIN index for demographics JSONB field (if it doesn't exist)
    try {
      const Result = require('./models/Result');
      const [results] = await sequelize.query(`
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'results' 
        AND indexname = 'results_demographics_idx'
      `);
      
      if (results.length === 0) {
        await sequelize.query(`
          CREATE INDEX results_demographics_idx ON results 
          USING GIN (demographics jsonb_path_ops)
        `);
        console.log('✅ Created GIN index on results.demographics');
      }
    } catch (error) {
      console.warn('⚠️ Could not create GIN index on demographics (may already exist):', error.message);
    }
  } catch (error) {
    console.error('❌ Database synchronization error:', error);
    process.exit(1);
  }
})();

// Track website visits
app.use(trackVisit);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/responses', require('./routes/responses'));
app.use('/api/results', require('./routes/results'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/admin', require('./routes/admin'));

// AI Analysis routes with debugging
console.log('🔧 Loading AI Analysis routes...');
const aiAnalysisRoutes = require('./routes/aiAnalysis');
console.log('✅ AI Analysis routes loaded successfully');
app.use('/api/ai-analysis', aiAnalysisRoutes);

// Add stats tracking to specific routes
app.use('/api/questions', trackTestStart);
app.use('/api/results', trackTestComplete);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'MBTI API is running',
    timestamp: new Date().toISOString()
  });
});

// Test AI Analysis route
app.get('/api/ai-analysis/test', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'AI Analysis route is working',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 
