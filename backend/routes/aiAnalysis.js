const express = require('express');
const router = express.Router();
const EnhancedAIAnalysisService = require('../services/enhancedAIAnalysisService');
const HTMLReportGenerator = require('../services/htmlReportGenerator');
const { validateMBTIResults } = require('../middleware/validation');
const fs = require('fs-extra');
const path = require('path');
const Result = require('../models/Result');

// Create instances of the services
const enhancedAIService = new EnhancedAIAnalysisService();
const htmlReportGenerator = new HTMLReportGenerator();

// Initialize the enhanced AI service
let serviceInitialized = false;

(async () => {
  try {
    await enhancedAIService.initialize();
    serviceInitialized = true;
    console.log('✅ Enhanced AI Service initialized in routes');
  } catch (error) {
    console.warn('⚠️ Enhanced AI Service not initialized (categorized content file may be missing):', error.message);
    console.warn('   The application will continue to run, but AI analysis features will be unavailable.');
    serviceInitialized = false;
    // Don't throw - allow app to continue without AI service
  }
})();

// Middleware to check if service is initialized
const checkServiceInitialized = (req, res, next) => {
  if (!serviceInitialized) {
    return res.status(503).json({
      success: false,
      message: 'AI Analysis Service is still initializing. Please try again in a moment.'
    });
  }
  next();
};

// Route to check service status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      serviceInitialized,
      serviceType: 'EnhancedAIAnalysisService',
      timestamp: new Date().toISOString()
    }
  });
});

// Route to generate AI analysis based on MBTI results
router.post('/analyze', checkServiceInitialized, validateMBTIResults, async (req, res) => {
  try {
    const { mbtiResult } = req.body;
    
    if (!mbtiResult) {
      return res.status(400).json({
        success: false,
        message: 'MBTI results are required'
      });
    }
    
    // Generate AI analysis using enhanced service with chunked generation
    const analysisPackage = await enhancedAIService.createCompleteAnalysisPackage(mbtiResult, req.body.sessionId, req.body.userId);
    
    res.json({
      success: true,
      data: {
        analysis: analysisPackage.fullReport,
        relevantContent: analysisPackage.relevantContent,
        timestamp: analysisPackage.timestamp,
        packageId: analysisPackage.packageId,
        model: analysisPackage.model,
        tokens: analysisPackage.tokens,
        usage: analysisPackage.usage,
        validation: analysisPackage.validation
      }
    });

  } catch (error) {
    console.error('❌ Error in AI analysis:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate AI analysis'
    });
  }
});

// Route to generate comprehensive PDF report
router.post('/generate-report', async (req, res) => {
  try {
    const { sessionId, mbtiType, language = 'en' } = req.body;
    
    if (!sessionId || !mbtiType) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and MBTI type are required'
      });
    }

    console.log('📄 Generating PDF report for:', mbtiType, 'Session:', sessionId, 'Language:', language);
    
    // Get MBTI result from database
    const Result = require('../models/Result');
    const mbtiResult = await Result.findOne({ where: { sessionId } });
    
    if (!mbtiResult) {
      return res.status(404).json({
        success: false,
        message: 'MBTI result not found for the given session ID'
      });
    }
    
    // Get analysis from database
    const analysis = await enhancedAIService.getAnalysisFromDatabase(sessionId, mbtiType);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found for the given session ID and MBTI type'
      });
    }
    
    if (!analysis.isPremiumUnlocked) {
      return res.status(403).json({
        success: false,
        message: 'Premium content is not unlocked for this session'
      });
    }

    // Generate PDF report from existing analysis with language
    const htmlReport = await htmlReportGenerator.generateHTMLFromAnalysis(mbtiResult, analysis, language);
    
    console.log(`✅ HTMl report generated successfully!`);
    
    res.json({
      success: true,
      data: { htmlReport }
    });

  } catch (error) {
    console.error('❌ Error generating PDF report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate PDF report'
    });
  }
});

// Route to download generated PDF report
router.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename || !filename.endsWith('.pdf')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }
    
    const filePath = path.join(__dirname, '../temp-reports', filename);
    
    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    // Clean up file after streaming (optional)
    fileStream.on('end', async () => {
      try {
        await fs.remove(filePath);
        console.log(`🗑️ Cleaned up temporary report: ${filename}`);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    });

  } catch (error) {
    console.error('❌ Error downloading report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download report'
    });
  }
});

// Route to get analysis status and available reports
router.get('/status', async (req, res) => {
  try {
    const tempReportsDir = path.join(__dirname, '../temp-reports');
    
    if (await fs.pathExists(tempReportsDir)) {
      const files = await fs.readdir(tempReportsDir);
      const reports = files.filter(file => file.endsWith('.pdf'));
      
      res.json({
        success: true,
        data: {
          serviceStatus: 'active',
          availableReports: reports.length,
          reports: reports.map(filename => ({
            filename,
            downloadUrl: `/api/ai-analysis/download/${filename}`
          }))
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          serviceStatus: 'active',
          availableReports: 0,
          reports: []
        }
      });
    }

  } catch (error) {
    console.error('❌ Error getting status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service status'
    });
  }
});

// Test route without validation
router.post('/create-package-test', async (req, res) => {
  console.log('🔍 POST /create-package-test route hit (no validation)');
  console.log('📝 Request body:', req.body);
  
  res.json({
    success: true,
    message: 'Test route working without validation',
    body: req.body
  });
});

// Route to create complete analysis package (full report only, no preview)
router.post('/create-package', checkServiceInitialized, validateMBTIResults, async (req, res) => {
  try {
    const { mbtiResult, sessionId, userId } = req.body;
    
    if (!mbtiResult) {
      console.log('❌ No mbtiResult in request body');
      return res.status(400).json({
        success: false,
        message: 'MBTI results are required'
      });
    }
    
    // Create the complete package with full report only (no preview)
    const analysisPackage = await enhancedAIService.createCompleteAnalysisPackage(mbtiResult, sessionId, userId);
    
    res.json({
      success: true,
      data: analysisPackage
    });

  } catch (error) {
    console.error('❌ Error creating analysis package:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create analysis package'
    });
  }
});

// Route to get existing analysis from database (full report only)
router.get('/get-analysis/:sessionId/:mbtiType', async (req, res) => {
  try {
    const { sessionId, mbtiType } = req.params;
    
    const analysis = await enhancedAIService.getAnalysisFromDatabase(sessionId, mbtiType);
    
    if (analysis) {
      res.json({
        success: true,
        data: analysis,
        message: 'Analysis found in database'
      });
    } else {
      res.json({
        success: false,
        data: null,
        message: 'No analysis found for this user and MBTI type'
      });
    }

  } catch (error) {
    console.error('❌ Error getting analysis from database:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get analysis from database'
    });
  }
});

// Unlock premium content for a specific MBTI result
router.post('/unlock-premium', async (req, res) => {
  try {
    const { sessionId, mbtiType } = req.body;
    
    if (!sessionId || !mbtiType) {
      return res.status(400).json({ 
        error: 'Missing required parameters: sessionId and mbtiType' 
      });
    }

    console.log(`🔓 Unlocking premium for session: ${sessionId}, type: ${mbtiType}`);

    // Update the Result model directly with premium status
    const updatedResult = await Result.findOneAndUpdate(
      { sessionId, mbtiType },
      { 
        premium: true,
        premiumUnlockedAt: new Date(),
        // Keep legacy field for backward compatibility
        isPremiumUnlocked: true
      },
      { new: true }
    );

    if (!updatedResult) {
      console.log(`❌ No result found for session: ${sessionId}, type: ${mbtiType}`);
      return res.status(404).json({ 
        error: 'MBTI result not found' 
      });
    }

    console.log(`✅ Premium unlocked successfully for session: ${sessionId}`);
    
    res.json({ 
      success: true, 
      message: 'Premium content unlocked successfully',
      result: updatedResult
    });

  } catch (error) {
    console.error('❌ Error unlocking premium content:', error);
    res.status(500).json({ 
      error: 'Failed to unlock premium content',
      details: error.message 
    });
  }
});

// Route to get full report (only when premium is unlocked)
router.get('/get-full-report/:sessionId/:mbtiType', async (req, res) => {
  try {
    const { sessionId, mbtiType } = req.params;
    
    if (!sessionId || !mbtiType) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and MBTI type are required'
      });
    }

    console.log(`📄 Getting full report for session: ${sessionId}, type: ${mbtiType}`);
    
    // First check if premium is unlocked in the MBTI result
    const Result = require('../models/Result');
    const mbtiResult = await Result.findOne({ sessionId });
    
    if (!mbtiResult || !mbtiResult.isPremiumUnlocked) {
      return res.status(403).json({
        success: false,
        message: 'Premium content is not unlocked for this session'
      });
    }
    
    // Get the full report from the analysis
    const fullReport = await enhancedAIService.getFullReport(sessionId, mbtiType);
    
    if (fullReport && !fullReport.error) {
      res.json({
        success: true,
        data: fullReport,
        message: 'Full report retrieved successfully'
      });
    } else if (fullReport && fullReport.error) {
      res.json({
        success: false,
        data: null,
        message: fullReport.error
      });
    } else {
      res.json({
        success: false,
        data: null,
        message: 'No full report found'
      });
    }

  } catch (error) {
    console.error('❌ Error getting full report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get full report'
    });
  }
});

// Route to cleanup old reports
router.post('/cleanup', async (req, res) => {
  try {
    // The HTMLReportGenerator does not have a cleanupOldReports method
    // This route is now redundant for HTML reports
    res.json({
      success: true,
      message: 'No old reports to clean up for HTML reports'
    });

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup old reports'
    });
  }
});

// Route to generate HTML from existing analysis
router.post('/generate-html-from-analysis', async (req, res) => {
  try {
    const { sessionId, mbtiType, language = 'en' } = req.body;
    
    if (!sessionId || !mbtiType) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and MBTI type are required'
      });
    }

    // Get the existing analysis from database
    const analysis = await enhancedAIService.getAnalysisFromDatabase(sessionId, mbtiType);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'No analysis found for this session and MBTI type'
      });
    }

    // Get the actual MBTI result from the database
    const Result = require('../models/Result');
    const mbtiResult = await Result.findOne({ where: { sessionId } });
    
    if (!mbtiResult) {
      return res.status(404).json({
        success: false,
        message: 'No MBTI result found for this session'
      });
    }

    // Transform the database result to the format expected by the HTML generator
    const transformedResult = {
      type: mbtiResult.mbtiType,
      scores: mbtiResult.scores.normalized, // Use normalized scores from database
      dimensions: mbtiResult.dimensions,    // Use dimensions from database
      confidence: mbtiResult.confidence,    // Use confidence from database
      description: mbtiResult.typeInfo      // Use type info from database
    };

    // Generate HTML report using the actual MBTI result data
    const htmlReport = await htmlReportGenerator.generateHTMLFromAnalysis(transformedResult, analysis, language);
  
    res.json({
      success: true,
      data: htmlReport
    });

  } catch (error) {
    console.error('❌ Error generating HTML from analysis:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate HTML from analysis'
    });
  }
});

// Route to download generated HTML report
router.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename || !filename.endsWith('.html')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }
    
    const filePath = path.join(__dirname, '../temp-reports', filename);
    
    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    
    // Set headers for HTML download
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    // Clean up file after streaming (optional)
    fileStream.on('end', async () => {
      try {
        await fs.remove(filePath);
        console.log(`🗑️ Cleaned up temporary report: ${filename}`);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    });

  } catch (error) {
    console.error('❌ Error downloading report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download report'
    });
  }
});

module.exports = router; 
