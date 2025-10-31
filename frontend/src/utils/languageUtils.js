// Utility functions for language detection and content extraction

/**
 * Extracts content in the user's preferred language from bilingual AI results
 * @param {string} content - The bilingual content from AI (contains both English and Traditional Chinese)
 * @param {string} userLanguage - The user's preferred language ('en' or 'zh')
 * @returns {string} - Content in the user's preferred language
 */
export const extractLanguageContent = (content, userLanguage) => {
  if (!content) return '';
  
  // If user prefers English, extract English content
  if (userLanguage === 'en') {
    const englishMatch = content.match(/=== ENGLISH VERSION ===([\s\S]*?)(?=== TRADITIONAL CHINESE VERSION|$)/);
    if (englishMatch) {
      return englishMatch[1].trim();
    }
    // Fallback: if no clear separation, return the content as-is
    return content;
  }
  
  // If user prefers Chinese, extract Traditional Chinese content
  if (userLanguage === 'zh') {
    const chineseMatch = content.match(/=== TRADITIONAL CHINESE VERSION \(繁體中文\) ===([\s\S]*?)(?=== ENGLISH VERSION|$)/);
    if (chineseMatch) {
      return chineseMatch[1].trim();
    }
    // Fallback: if no clear separation, return the content as-is
    return content;
  }
  
  // Default fallback
  return content;
};

/**
 * Gets the appropriate language label for the current user
 * @param {string} userLanguage - The user's preferred language ('en' or 'zh')
 * @returns {string} - Language label in the user's preferred language
 */
export const getLanguageLabel = (userLanguage) => {
  return userLanguage === 'zh' ? '繁體中文' : 'English';
};

/**
 * Formats the analysis display based on user language
 * @param {Object} analysis - The AI analysis object
 * @param {string} userLanguage - The user's preferred language ('en' or 'zh')
 * @returns {Object} - Formatted analysis object with language-specific content
 */
export const formatAnalysisForLanguage = (analysis, userLanguage) => {
  if (!analysis) return null;
  
  return {
    ...analysis,
    preview: analysis.preview ? extractLanguageContent(analysis.preview, userLanguage) : null,
    fullReport: analysis.fullReport ? extractLanguageContent(analysis.fullReport, userLanguage) : null
  };
};
