const Joi = require('joi');

// Session validation middleware
const validateSession = (req, res, next) => {
  const sessionId = req.params.sessionId || req.body.sessionId;
  
  if (!sessionId) {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(sessionId)) {
    return res.status(400).json({ message: 'Invalid session ID format' });
  }

  next();
};

// Response validation middleware
const validateResponse = (req, res, next) => {
  // If sessionId is in URL params, don't require it in body
  const hasSessionIdInParams = req.params.sessionId;
  
  const schema = Joi.object({
    sessionId: hasSessionIdInParams ? Joi.string().uuid().optional() : Joi.string().uuid().required(),
    questionId: Joi.number().integer().min(1).required(),
    answer: Joi.number().integer().min(1).max(4).required(), // Updated to 4-point scale
    category: Joi.string().optional(),
    selectedType: Joi.string().optional(),
    strength: Joi.number().min(0).max(1).optional(),
    sectionId: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
    language: Joi.string().optional(),
    responseTime: Joi.number().min(0).optional(),
    timeSpent: Joi.number().min(0).optional(), // Keep for backward compatibility
    metadata: Joi.object().optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
  }

  next();
};

// Session creation validation
const validateSessionCreation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().optional(),
    name: Joi.string().trim().min(1).max(100).optional(),
    timezone: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
  }

  next();
};

// Question validation (for admin endpoints)
const validateQuestion = (req, res, next) => {
  const schema = Joi.object({
    questionId: Joi.number().integer().min(1).required(),
    text: Joi.string().trim().min(10).max(500).required(),
    category: Joi.string().valid('EI', 'SN', 'TF', 'JP').required(),
    direction: Joi.string().valid('positive', 'negative').required(),
    options: Joi.array().items(
      Joi.object({
        text: Joi.string().required(),
        value: Joi.number().min(1).max(7).required()
      })
    ).min(2).max(7).required(),
    order: Joi.number().integer().min(1).required(),
    isActive: Joi.boolean().optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
  }

  next();
};

// Pagination validation
const validatePagination = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({ 
      message: 'Invalid pagination parameters' 
    });
  }

  req.query.page = parseInt(page);
  req.query.limit = parseInt(limit);
  
  next();
};

// MBTI Results validation for AI analysis
const validateMBTIResults = (req, res, next) => {
  
  // Clean up undefined values before validation
  if (req.body.sessionId === undefined) {
    req.body.sessionId = null;
  }
  if (req.body.userId === undefined) {
    req.body.userId = null;
  }
  
  // Ensure mbtiResult exists and has required structure
  if (!req.body.mbtiResult) {
    console.error('❌ Missing mbtiResult in request body');
    return res.status(400).json({ 
      message: 'Validation error', 
      details: 'mbtiResult is required' 
    });
  }
  
  // Log demographics details if present
  if (req.body.mbtiResult.demographics) {
    console.log('📧 Demographics details:', {
      name: req.body.mbtiResult.demographics.name,
      ageRange: req.body.mbtiResult.demographics.ageRange,
      gender: req.body.mbtiResult.demographics.gender,
      industry: req.body.mbtiResult.demographics.industry,
      email: req.body.mbtiResult.demographics.email
      // Only log the essential fields
    });
  }

  const schema = Joi.object({
    mbtiResult: Joi.object({
      type: Joi.string().length(4).pattern(/^[EISTNFJP]{4}$/).required(),
      typeName: Joi.string().optional(),
      description: Joi.string().optional(),
      scores: Joi.object({
        EI: Joi.object({
          E: Joi.number().min(0).max(100).required(),
          I: Joi.number().min(0).max(100).required(),
          color: Joi.string().optional()
        }).required(),
        SN: Joi.object({
          S: Joi.number().min(0).max(100).required(),
          N: Joi.number().min(0).max(100).required(),
          color: Joi.string().optional()
        }).required(),
        TF: Joi.object({
          T: Joi.number().min(0).max(100).required(),
          F: Joi.number().min(0).max(100).required(),
          color: Joi.string().optional()
        }).required(),
        JP: Joi.object({
          J: Joi.number().min(0).max(100).required(),
          P: Joi.number().min(0).max(100).required(),
          color: Joi.string().optional()
        }).required()
      }).required(),
      dimensions: Joi.object({
        EI: Joi.string().valid('E', 'I').required(),
        SN: Joi.string().valid('S', 'N').required(),
        TF: Joi.string().valid('T', 'F').required(),
        JP: Joi.string().valid('J', 'P').required()
      }).required(),
      confidence: Joi.object({
        EI: Joi.number().min(0).max(100).required(),
        SN: Joi.number().min(0).max(100).required(),
        TF: Joi.number().min(0).max(100).required(),
        JP: Joi.number().min(0).max(100).required()
      }).required(),
      celebrities: Joi.array().optional(),
      recommendations: Joi.object({
        careers: Joi.array().items(Joi.string()).optional(),
        strengths: Joi.array().items(Joi.string()).optional()
      }).optional(),
      stats: Joi.object({
        totalPopulation: Joi.number().optional(),
        maleRatio: Joi.number().optional(),
        femaleRatio: Joi.number().optional()
      }).optional(),
      statistics: Joi.object({
        categoryBreakdown: Joi.object().optional(),
        totalQuestions: Joi.number().optional(),
        totalResponses: Joi.number().optional(),
        completionPercentage: Joi.number().optional(),
        averageResponseTime: Joi.number().optional()
      }).optional(),
      compatibility: Joi.array().items(Joi.string()).optional(),
      rawScores: Joi.object().optional(),
      normalizedScores: Joi.object().optional(),
      typeStrength: Joi.number().optional(),
      timestamp: Joi.number().optional(),
      totalResponses: Joi.number().integer().min(1).optional(),
      demographics: Joi.object({
        name: Joi.string().optional(),
        ageRange: Joi.string().optional(),
        gender: Joi.string().optional(),
        industry: Joi.string().optional(),
        email: Joi.string().optional()
        // Remove unnecessary fields like phone, education, occupation, location
      }).unknown().optional() // Allow unknown fields in demographics
    }).unknown().required(), // Allow unknown fields in mbtiResult
    sessionId: Joi.any().optional(), // Allow any value including undefined
    userId: Joi.any().optional(),    // Allow any value including undefined
    includeAnalysis: Joi.boolean().optional()
  });
  
  console.log('✅ Schema built successfully');

  try {
    const validationResult = schema.validate(req.body, {
      allowUnknown: true,  // Allow unknown fields in the root object
      stripUnknown: false, // Don't strip unknown fields
      abortEarly: false    // Collect all validation errors
    });
    
    if (validationResult.error) {
      console.log('❌ Validation failed:', validationResult.error.details[0].message);
      console.log('❌ Validation error details:', JSON.stringify(validationResult.error.details, null, 2));
      return res.status(400).json({ 
        message: 'Validation error', 
        details: validationResult.error.details[0].message 
      });
    }

  } catch (validationError) {
    console.error('💥 Validation schema error:', validationError);
    console.error('💥 Validation error stack:', validationError.stack);
    return res.status(500).json({ 
      message: 'Validation schema error', 
      details: validationError.message 
    });
  }

  console.log('✅ Validation passed');
  next();
};

module.exports = {
  validateSession,
  validateResponse,
  validateSessionCreation,
  validateQuestion,
  validatePagination,
  validateMBTIResults
}; 
