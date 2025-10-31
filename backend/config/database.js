require('dotenv').config();
const { Sequelize } = require('sequelize');

// Parse database URL or use individual environment variables
const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    // For platforms like Render, Railway, etc. that provide DATABASE_URL
    return process.env.DATABASE_URL;
  }

  // Build connection string from individual variables
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'mbti_db',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    dialect: 'postgres',
    // Reduced logging - only log errors in development, no SQL queries
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

  return dbConfig;
};

const dbConfig = getDatabaseConfig();
const isString = typeof dbConfig === 'string';

const sequelize = new Sequelize(dbConfig, {
  // Reduced logging - only log if DB_LOGGING env var is set to 'true'
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: isString ? {
    // For DATABASE_URL, SSL is typically required
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  } : {
    // For individual config, use DB_SSL env var
    ssl: process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL database');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL database:', error);
    return false;
  }
};

module.exports = { sequelize, testConnection };

