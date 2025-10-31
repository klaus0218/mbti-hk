const fs = require('fs-extra');
const path = require('path');
const AIAnalysis = require('../models/AIAnalysis');
const { getMBTIContent } = require('../data/predefined-reports');

/**
 * Enhanced AI Analysis Service - OPTIMIZED VERSION with GROK API
 * 
 * This service has been optimized to send only ONE AI request instead of THREE separate requests:
 * - Previously: generateComprehensiveAnalysis() + generateOnlineResearchInsights() + generatePreviewReport() + generateFullReport()
 * - Now: generateConsolidatedContent() - generates all content in a single AI request
 * 
 * Benefits:
 * - 3x faster response time
 * - Reduced API costs
 * - Better content consistency across sections
 * - Single database save operation
 * 
 * All content is generated in both Traditional Chinese (繁體中文) and English simultaneously.
 */
class EnhancedAIAnalysisService {
  constructor() {
    this.grokModel = 'grok-3-mini';
    this.grokApiKey = process.env.GROK_API_KEY;
    this.grokApiUrl = 'https://api.x.ai/v1/chat/completions';
    
    if (!this.grokApiKey) {
      console.warn('⚠️ GROK_API_KEY not found in environment variables');
    }
    
    this.categorizedContent = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    return;
    try {
      const knowledgeBaseDir = path.join(__dirname, '../data/mbti-knowledge-base');
      const categorizedPath = path.join(knowledgeBaseDir, 'mbti-categorized-content.json');
      
      if (await fs.pathExists(categorizedPath)) {
        this.categorizedContent = await fs.readJson(categorizedPath);
        this.initialized = true;
        console.log('✅ Enhanced AI Analysis Service initialized with categorized content');
        
        const typesWithContent = Object.values(this.categorizedContent).filter(t => t.chunks.length > 0).length;
        console.log(`   MBTI types with content: ${typesWithContent}/16`);
        
      } else {
        throw new Error('Categorized content not found. Please run the categorization script first.');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Enhanced AI Analysis Service:', error.message);
      throw error;
    }
  }

  async callGrokAPI(prompt) {
    if (!this.grokApiKey) {
      throw new Error('GROK_API_KEY not configured');
    }

    try {
      const response = await fetch(this.grokApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.grokApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.grokModel,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 50000,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Grok API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Grok API');
      }

      return {
        content: data.choices[0].message.content,
        model: data.model,
        usage: data.usage
      };
    } catch (error) {
      console.error('❌ Error calling Grok API:', error);
      throw error;
    }
  }

  async createCompleteAnalysisPackage(mbtiResult, sessionId, userId = null) {
    try {      
      // First, update the MBTI result in MongoDB to ensure user email is saved
      const mbtiUpdateResult = await this.updateMBTIResultInDatabase(mbtiResult, sessionId);
      if (mbtiUpdateResult) {
        console.log(`✅ MBTI result updated successfully before analysis generation`);
      } else {
        console.log(`⚠️ MBTI result update failed, but continuing with analysis generation`);
      }
      
      // Generate full report content in a single AI request
      const consolidatedContent = await this.generateConsolidatedContent(mbtiResult);
      console.log("✅ MBTI analysis result generated successfully");

      // Create analysis package (no preview, only full report)
      const analysisPackage = {
        mbtiResult,
        fullReport: consolidatedContent.fullReport,
        timestamp: new Date().toISOString(),
        packageId: `analysis_${mbtiResult.type}_${Date.now()}`,
        model: consolidatedContent.model,
        tokens: consolidatedContent.tokens,
        usage: consolidatedContent.usage
      };
      
      // Save to database
      await this.saveAnalysisToDatabase(analysisPackage, sessionId, userId, mbtiResult.type);
      console.log("✅ Analysis package saved to database");
      return analysisPackage;
      
    } catch (error) {
      console.error('❌ Error creating analysis package:', error);
      throw error;
    }
  }

  async generateConsolidatedContent(mbtiResult) {
    try {
      const { type, scores, confidence, dimensions, description } = mbtiResult;
      
      // Updated prompt: Generate English first, then translate to Traditional Chinese
      const prompt = `You are an expert MBTI personality analyst and psychologist. Generate a comprehensive personality analysis for an ${type} individual based on the provided MBTI Results, Book Content, and the latest research.

IMPORTANT: First, search the internet for the most recent MBTI research, studies, and information about ${type} individuals from the past 5 years (2020-2025). Look for:
- Recent psychological studies on ${type} personality traits
- Updated behavioral patterns and characteristics
- Modern workplace and relationship dynamics for ${type} types
- Current understanding of ${type} cognitive functions
- Recent insights about ${type} strengths and growth areas
- Explain the ${type} personality traits in detail according to the MBTI result, including the strengths and weaknesses of the personality traits.

User MBTI Results:
- Type: ${type}
- Scores: ${JSON.stringify(scores)}
- Dimensions: ${JSON.stringify(dimensions)}
- Confidence Levels: ${JSON.stringify(confidence)}
- Current Description: ${description}

IMPORTANT INSTRUCTIONS:
1. FIRST: Generate ALL content in English only
2. SECOND: Translate the English content to Traditional Chinese (繁體中文)
3. Return the result as a JSON object with both languages

Please provide the content in the following structure:

{
  "fullReport": {
    "en": {
      "executiveSummary": "English executive summary according to the mbti result, scores, confidence levels, dimensions, and description...",
      "detailedAnalysis": "English detailed analysis according to the mbti result, scores, confidence levels, dimensions, and description...",
      "careerPath": "Comprehensive career analysis including perfect job matches, industry recommendations, salary expectations, growth trajectory, and workplace strategies...",
    },
    "zh": {
      "executiveSummary": "繁體中文執行摘要...",
      "detailedAnalysis": "繁體中文詳細分析...",
      "careerPath": "全面的職業分析，包括完美工作匹配、行業建議、薪資期望、成長軌跡和工作場所策略...",
    }
  }
}

IMPORTANT: **CRITICAL**: All fields/generated content must contain AT LEAST 300 words each.
IMPORTANT: **FULL REPORT**: Professional and business-ready, comprehensive and detailed, well-structured and easy to navigate, visually appealing, actionable and practical. 
IMPORTANT: **NO WORD COUNTS**: Do NOT include any word count indicators, character counts, or length measurements in your response. Do NOT mention word counts anywhere in the content. Focus on generating substantial, meaningful content without any counting references.
IMPORTANT: **New Line**: Use <br><br> for the new line. properly add new line in the generated content.
IMPORTANT: **TRANSLATION QUALITY**: When translating to Traditional Chinese, ensure the content is natural, culturally appropriate, and maintains the professional tone of the English version. Use proper Traditional Chinese characters and terminology.
IMPORTANT: Ensure the response is valid JSON. Do not include any text before or after the JSON object. Do not use markdown formatting. Return ONLY the JSON object.`;

      const grokResponse = await this.callGrokAPI(prompt);
      console.log("✅ Received response from Grok API");
      
      let cleanedResponseText = this.cleanAIResponse(grokResponse.content);
      
      // Try multiple parsing strategies
      let consolidatedContent = this.parseAIResponse(cleanedResponseText, type);
      
      if (!consolidatedContent) {
        throw new Error('Failed to parse AI response after multiple attempts');
      }

      // Merge with predefined content to ensure sufficient word count
      consolidatedContent = await this.mergeWithPredefinedContent(consolidatedContent, type);

      console.log("✅ Complete generate consolidated MBTI content with predefined content merged");

      return {
        type,
        fullReport: consolidatedContent.fullReport,
        timestamp: new Date().toISOString(),
        model: grokResponse.model || 'grok-4',
        tokens: this.parseTokenCount(grokResponse.usage?.total_tokens),
        usage: grokResponse.usage
      };

    } catch (error) {
      console.error('❌ Error generating consolidated content:', error);
      throw new Error('Failed to generate consolidated content. Please try again later.');
    }
  }

  /**
   * Clean AI response text to extract valid JSON
   */
  cleanAIResponse(responseText) {
    if (!responseText) return '';
    
    let cleaned = responseText.trim();
    
    // Remove markdown code blocks
    if (cleaned.includes('```json')) {
      cleaned = cleaned.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleaned.includes('```')) {
      cleaned = cleaned.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    // Remove any text before the first {
    const firstBraceIndex = cleaned.indexOf('{');
    if (firstBraceIndex > 0) {
      cleaned = cleaned.substring(firstBraceIndex);
    }
    
    // Remove any text after the last }
    const lastBraceIndex = cleaned.lastIndexOf('}');
    if (lastBraceIndex > 0 && lastBraceIndex < cleaned.length - 1) {
      cleaned = cleaned.substring(0, lastBraceIndex + 1);
    }
    
    // Remove common AI response prefixes
    cleaned = cleaned.replace(/^(Here's|Here is|I'll provide|I will provide|Here's the|Here is the).*?:\s*/i, '');
    
    // Remove word count indicators
    cleaned = cleaned.replace(/\（字數:\d+）/g, ''); // Chinese: (字數：318)
    cleaned = cleaned.replace(/\(Total:\s*\d+\)/g, ''); // English: (Total: 456)
    cleaned = cleaned.replace(/\(Word count:\s*\d+\)/g, ''); // English: (Word count: 352)
    cleaned = cleaned.replace(/\(字數：\d+\)/g, ''); // Alternative Chinese format
    cleaned = cleaned.replace(/\(總計:\d+\)/g, ''); // Alternative Chinese format
    cleaned = cleaned.replace(/\(總計：\d+\)/g, ''); // Alternative Chinese format
    cleaned = cleaned.replace(/\(\d+ 字\)/g, ''); // Alternative Chinese format
    cleaned = cleaned.replace(/\Over \d+ words/g, ''); // Alternative Chinese format
    cleaned = cleaned.replace(/\超過 \d+ 字/g, ''); // Alternative Chinese format

    const currentDate = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
    cleaned = cleaned.replace(/\[當前日期\]/g, currentDate); // Alternative Chinese format
    cleaned = cleaned.replace(/\[Current Date\]/g, currentDate); // Alternative Chinese format
    
    return cleaned.trim();
  }

  /**
   * Parse AI response with multiple fallback strategies
   */
  parseAIResponse(cleanedText, mbtiType) {
    if (!cleanedText) {
      return null;
    }

    // Strategy 1: Direct JSON parse
    try {
      const parsed = JSON.parse(cleanedText);
      if (this.validateParsedContent(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.log('⚠️ Strategy 1 failed:', error.message);
    }

    // Strategy 2: Fix common JSON issues and retry
    try {
      const fixedText = this.fixCommonJSONIssues(cleanedText);
      const parsed = JSON.parse(fixedText);
      if (this.validateParsedContent(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.log('⚠️ Strategy 2 failed:', error.message);
    }

    // Strategy 3: Extract JSON from text using regex
    try {
      const extractedText = this.extractJSONFromText(cleanedText);
      if (extractedText) {
        const parsed = JSON.parse(extractedText);
        if (this.validateParsedContent(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.log('⚠️ Strategy 3 failed:', error.message);
    }
  }

  /**
   * Fix common JSON syntax issues
   */
  fixCommonJSONIssues(text) {
    let fixed = text;
    
    // Fix missing quotes around property names
    fixed = fixed.replace(/(\w+):/g, '"$1":');
    
    // Fix missing quotes around string values
    fixed = fixed.replace(/:\s*([^",\{\}\[\]\d][^,\{\}\[\]]*[^",\{\}\[\]\s])\s*([,\}\]])/g, ': "$1"$2');
    
    // Fix trailing commas
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix unescaped quotes in strings
    fixed = fixed.replace(/"([^"]*)"([^"]*)"([^"]*)"/g, '"$1\\"$2\\"$3"');
    
    // Fix newlines in strings
    fixed = fixed.replace(/\n/g, '\\n');
    fixed = fixed.replace(/\r/g, '\\r');
    
    return fixed;
  }

  /**
   * Extract JSON using regex patterns
   */
  extractJSONFromText(text) {
    // Look for JSON-like structures
    const jsonPattern = /\{[\s\S]*\}/;
    const match = text.match(jsonPattern);
    
    if (match) {
      return match[0];
    }
    
    return null;
  }

  /**
   * Validate parsed content structure
   */
  validateParsedContent(parsed) {
    if (!parsed || typeof parsed !== 'object') {
      return false;
    }
    
    // Check if required fields exist
    if (!parsed.fullReport) {
      return false;
    }
    
    // Check if fullReport has required language fields
    if (!parsed.fullReport.en || !parsed.fullReport.zh) {
      return false;
    }
    
    return true;
  }

  /**
   * Merge predefined content with AI-generated content to ensure sufficient word count
   */
  async mergeWithPredefinedContent(aiContent, mbtiType) {
    try {
      // Get predefined content for both languages
      const predefinedEN = getMBTIContent('en', mbtiType);
      const predefinedZH = getMBTIContent('zh', mbtiType);
      
      if (!predefinedEN || !predefinedZH || Object.keys(predefinedEN).length === 0) {
        console.warn(`⚠️ No predefined content found for ${mbtiType}, using AI content only`);
        return aiContent;
      }

      const mergedContent = {
        fullReport: {
          en: {},
          zh: {}
        }
      };

      // Merge English content
      Object.keys(predefinedEN).forEach(field => {
        const aiText = aiContent.fullReport.en[field] || '';
        const predefinedText = predefinedEN[field] || '';
        mergedContent.fullReport.en[field] = `${aiText}\n\n${predefinedText}`;
      });

      // Merge Chinese content
      Object.keys(predefinedZH).forEach(field => {
        const aiText = aiContent.fullReport.zh[field] || '';
        const predefinedText = predefinedZH[field] || '';
        mergedContent.fullReport.zh[field] = `${aiText}\n\n${predefinedText}`;
      });

      console.log(`✅ Successfully merged predefined content with AI content for ${mbtiType}`);
      return mergedContent;

    } catch (error) {
      console.error(`❌ Error merging predefined content for ${mbtiType}:`, error);
      return aiContent; // Fallback to AI content only
    }
  }

  parseTokenCount(tokenCount) {
    // Ensure we return a valid number for MongoDB
    if (typeof tokenCount === 'number' && !isNaN(tokenCount)) {
      return tokenCount;
    } else if (tokenCount && typeof tokenCount === 'object' && 'total_tokens' in tokenCount) {
      const count = tokenCount.total_tokens;
      return typeof count === 'number' && !isNaN(count) ? count : 0;
    } else {
      return 0; // Default to 0 instead of 'unknown' string
    }
  }

  async saveAnalysisToDatabase(analysisPackage, sessionId, userId, mbtiType) {
    try {
      if (!sessionId) {
        return;
      }
      
      // Extract user email from the analysis package
      const userEmail = analysisPackage.mbtiResult?.demographics?.email || null;
      
      // Ensure tokens is a valid number
      const tokens = typeof analysisPackage.tokens === 'number' && !isNaN(analysisPackage.tokens) 
        ? analysisPackage.tokens 
        : 0;
            
      // Check if analysis already exists for this user and MBTI type
      const existingAnalysis = await AIAnalysis.findByUserAndType(sessionId, mbtiType);
      
      if (existingAnalysis) {
        // Update existing analysis
        await existingAnalysis.update({
          fullReport: analysisPackage.fullReport,
          model: analysisPackage.model || 'grok-beta',
          tokens: tokens,
          usage: analysisPackage.usage,
          userLanguage: analysisPackage.userLanguage || 'en',
          userEmail: userEmail,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });
      } else {
        // Create new analysis - save all content but keep full report locked
        await AIAnalysis.create({
          sessionId,
          userId,
          mbtiType,
          fullReport: analysisPackage.fullReport,
          model: analysisPackage.model || 'grok-beta',
          tokens: tokens,
          usage: analysisPackage.usage,
          userLanguage: analysisPackage.userLanguage || 'en',
          userEmail: userEmail,
          packageId: analysisPackage.packageId,
          isPremiumUnlocked: false
        });
      }
      
    } catch (error) {
      console.error('❌ Error saving analysis to database:', error);
      throw error;
    }
  }

  async getAnalysisFromDatabase(sessionId, mbtiType) {
    try {
      
      // Validate sessionId is present
      if (!sessionId) {
        return null;
      }
      
      const analysis = await AIAnalysis.findByUserAndType(sessionId, mbtiType);
      
      if (analysis) {
        // Check if analysis is expired
        if (analysis.isExpired()) {
          return null;
        }
        
        // Increment view count
        await analysis.incrementView();
        
        const data =  {
          mbtiResult: { type: mbtiType }, // Basic MBTI result
          fullReport: analysis.fullReport,
          timestamp: analysis.createdAt.toISOString(),
          model: analysis.model,
          tokens: analysis.tokens,
          packageId: analysis.packageId,
          isPremiumUnlocked: analysis.isPremiumUnlocked,
        };

        if (analysis.isPremiumUnlocked) {
          data.fullReport = analysis.fullReport;
        }

        return data;
      }
      
      console.log(`❌ No analysis found for ${mbtiType} in database`);
      return null;
      
    } catch (error) {
      console.error('❌ Error retrieving analysis from database:', error);
      return null;
    }
  }

  async unlockPremiumContent(sessionId, mbtiType) {
    try {
      console.log(`🔓 Unlocking premium content for ${mbtiType}...`);
      
      // Validate sessionId is present
      if (!sessionId) {
        console.log('⚠️ No sessionId provided, cannot unlock premium content');
        return false;
      }
      
      const analysis = await AIAnalysis.findByUserAndType(sessionId, mbtiType);
      
      if (analysis) {
        analysis.isPremiumUnlocked = true;
        analysis.unlockedAt = new Date();
        await analysis.save();
        console.log(`✅ Premium content unlocked for ${mbtiType} with full report`);
        return true;
      }
      
      console.log(`❌ No analysis found to unlock premium content for ${mbtiType}`);
      return false;
      
    } catch (error) {
      console.error('❌ Error unlocking premium content:', error);
      return false;
    }
  }

  async getFullReport(sessionId, mbtiType) {
    try {
      console.log(`📄 Getting full report for ${mbtiType}...`);
      
      // Validate sessionId is present
      if (!sessionId) {
        console.log('⚠️ No sessionId provided, cannot get full report');
        return null;
      }
      
      const analysis = await AIAnalysis.findByUserAndType(sessionId, mbtiType);
      
      if (analysis && analysis.isPremiumUnlocked && analysis.fullReport) {
        console.log(`✅ Full report retrieved for ${mbtiType}`);
        return {
          fullReport: analysis.fullReport,
          timestamp: analysis.updatedAt.toISOString()
        };
      } else if (analysis && !analysis.isPremiumUnlocked) {
        console.log(`🔒 Premium content not unlocked for ${mbtiType}`);
        return { error: 'Premium content not unlocked' };
      } else {
        console.log(`❌ No analysis found for ${mbtiType}`);
        return null;
      }
      
    } catch (error) {
      console.error('❌ Error getting full report:', error);
      return null;
    }
  }

  async updateMBTIResultInDatabase(mbtiResult, sessionId) {
    try {
      console.log(`💾 Updating MBTI result in database for session ${sessionId}...`);
      
      // Validate sessionId is present
      if (!sessionId) {
        console.log('⚠️ No sessionId provided, cannot update MBTI result');
        return false;
      }

      // Import Result model dynamically to avoid circular dependencies
      const Result = require('../models/Result');
      
      // Find existing result by sessionId
      const existingResult = await Result.findOne({ where: { sessionId } });
      
      if (existingResult) {
        // Update demographics with email if present
        if (mbtiResult.demographics?.email) {
          const demographics = existingResult.demographics || {};
          demographics.email = mbtiResult.demographics.email.trim().toLowerCase();
          console.log(`📧 Updated email in MBTI result: ${demographics.email}`);
          
          await existingResult.update({ demographics });
        }
        
        console.log(`✅ MBTI result updated successfully for session ${sessionId}`);
        return true;
      } else {
        console.log(`⚠️ No MBTI result found for session ${sessionId}, cannot update`);
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error updating MBTI result in database:', error);
      return false;
    }
  }
}

module.exports = EnhancedAIAnalysisService;
