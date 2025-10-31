/**
 * Predefined Reports Index
 * This file provides access to all predefined report content
 * organized by language, MBTI type, and field
 */

const fs = require('fs');
const path = require('path');

// Base directory for predefined reports
const BASE_DIR = __dirname;

/**
 * Get content for a specific field of a specific MBTI type in a specific language
 * @param {string} language - Language code ('en' or 'zh')
 * @param {string} mbtiType - MBTI type (e.g., 'ENFJ', 'INTJ')
 * @param {string} field - Field name (e.g., 'coverPage', 'executiveSummary')
 * @returns {string} The content for the specified field
 */
function getFieldContent(language, mbtiType, field) {
  try {
    const filePath = path.join(BASE_DIR, language.toUpperCase(), mbtiType, `${field}.js`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return null;
    }
    
    // Import the module and return the content
    const fieldModule = require(filePath);
    return fieldModule.content;
  } catch (error) {
    console.error(`Error loading field content: ${error.message}`);
    return null;
  }
}

/**
 * Get all content for a specific MBTI type in a specific language
 * @param {string} language - Language code ('en' or 'zh')
 * @param {string} mbtiType - MBTI type (e.g., 'ENFJ', 'INTJ')
 * @returns {object} Object containing all fields for the MBTI type
 */
function getMBTIContent(language, mbtiType) {
  const fields = [
    'coverPage',
    'executiveSummary', 
    'detailedAnalysis',
    'careerPath',
    'friendshipCompatibility',
    'romanticCompatibility',
    'mentalHealthInsights',
    'selfImprovement',
    'dailyLifeApplications',
    'actionPlan'
  ];
  
  const content = {};
  
  fields.forEach(field => {
    const fieldContent = getFieldContent(language, mbtiType, field);
    if (fieldContent) {
      content[field] = fieldContent;
    }
  });
  
  return content;
}

/**
 * Get all content for a specific language
 * @param {string} language - Language code ('en' or 'zh')
 * @returns {object} Object containing all MBTI types and their fields
 */
function getAllLanguageContent(language) {
  const mbtiTypes = [
    'ENFJ', 'ENFP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'INTJ', 'INTP',
    'ESFJ', 'ESFP', 'ESTJ', 'ESTP',
    'ISFJ', 'ISFP', 'ISTJ', 'ISTP'
  ];
  
  const content = {};
  
  mbtiTypes.forEach(mbtiType => {
    const mbtiContent = getMBTIContent(language, mbtiType);
    if (Object.keys(mbtiContent).length > 0) {
      content[mbtiType] = mbtiContent;
    }
  });
  
  return content;
}

/**
 * Check if a specific field exists
 * @param {string} language - Language code ('en' or 'zh')
 * @param {string} mbtiType - MBTI type (e.g., 'ENFJ', 'INTJ')
 * @param {string} field - Field name (e.g., 'coverPage', 'executiveSummary')
 * @returns {boolean} True if the field exists, false otherwise
 */
function fieldExists(language, mbtiType, field) {
  const filePath = path.join(BASE_DIR, language.toUpperCase(), mbtiType, `${field}.js`);
  return fs.existsSync(filePath);
}

/**
 * Get available languages
 * @returns {Array} Array of available language codes
 */
function getAvailableLanguages() {
  try {
    const languages = fs.readdirSync(BASE_DIR)
      .filter(item => {
        const itemPath = path.join(BASE_DIR, item);
        return fs.statSync(itemPath).isDirectory() && 
               ['EN', 'ZH'].includes(item.toUpperCase());
      })
      .map(lang => lang.toLowerCase());
    
    return languages;
  } catch (error) {
    console.error(`Error getting available languages: ${error.message}`);
    return [];
  }
}

/**
 * Get available MBTI types for a specific language
 * @param {string} language - Language code ('en' or 'zh')
 * @returns {Array} Array of available MBTI types
 */
function getAvailableMBTITypes(language) {
  try {
    const languageDir = path.join(BASE_DIR, language.toUpperCase());
    if (!fs.existsSync(languageDir)) {
      return [];
    }
    
    const mbtiTypes = fs.readdirSync(languageDir)
      .filter(item => {
        const itemPath = path.join(BASE_DIR, language.toUpperCase(), item);
        return fs.statSync(itemPath).isDirectory();
      });
    
    return mbtiTypes;
  } catch (error) {
    console.error(`Error getting available MBTI types: ${error.message}`);
    return [];
  }
}

/**
 * Get available fields for a specific MBTI type and language
 * @param {string} language - Language code ('en' or 'zh')
 * @param {string} mbtiType - MBTI type (e.g., 'ENFJ', 'INTJ')
 * @returns {Array} Array of available field names
 */
function getAvailableFields(language, mbtiType) {
  try {
    const mbtiDir = path.join(BASE_DIR, language.toUpperCase(), mbtiType);
    if (!fs.existsSync(mbtiDir)) {
      return [];
    }
    
    const fields = fs.readdirSync(mbtiDir)
      .filter(item => item.endsWith('.js'))
      .map(item => item.replace('.js', ''));
    
    return fields;
  } catch (error) {
    console.error(`Error getting available fields: ${error.message}`);
    return [];
  }
}

module.exports = {
  getFieldContent,
  getMBTIContent,
  getAllLanguageContent,
  fieldExists,
  getAvailableLanguages,
  getAvailableMBTITypes,
  getAvailableFields
};
