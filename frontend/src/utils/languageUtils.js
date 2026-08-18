// Utility functions for language detection and content extraction

/**
 * Extracts content in the user's preferred language from bilingual AI results
 * @param {string} content - The bilingual content from AI (contains English, Traditional Chinese, or Simplified Chinese)
 * @param {string} userLanguage - The user's preferred language ('en', 'zh', or 'zh-CN')
 * @returns {string} - Content in the user's preferred language
 */
export const extractLanguageContent = (content, userLanguage) => {
  if (!content) return '';
  
  // If user prefers English, extract English content
  if (userLanguage === 'en') {
    const englishMatch = content.match(/=== ENGLISH VERSION ===([\s\S]*?)(?=(?:\n=== |$))/i);
    if (englishMatch) {
      return englishMatch[1].trim();
    }
    // Fallback: if no clear separation, return the content as-is
    return content;
  }
  
  // If user prefers Simplified Chinese
  if (userLanguage === 'zh-CN' || userLanguage === 'zh-cn') {
    const simplifiedMatch = content.match(/=== SIMPLIFIED CHINESE VERSION (?:(?:\(简体中文\))|(?:\(簡體中文\)))? ===([\s\S]*?)(?=(?:\n=== |$))/i);
    if (simplifiedMatch) {
      return simplifiedMatch[1].trim();
    }
    // Fallback to traditional chinese if simplified marker is not found
    const chineseMatch = content.match(/=== TRADITIONAL CHINESE VERSION \(繁體中文\) ===([\s\S]*?)(?=(?:\n=== |$))/i);
    if (chineseMatch) {
      return chineseMatch[1].trim();
    }
    return content;
  }

  // If user prefers Traditional Chinese, extract Traditional Chinese content
  if (userLanguage === 'zh') {
    const chineseMatch = content.match(/=== TRADITIONAL CHINESE VERSION \(繁體中文\) ===([\s\S]*?)(?=(?:\n=== |$))/i);
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
 * @param {string} userLanguage - The user's preferred language ('en', 'zh', or 'zh-CN')
 * @returns {string} - Language label in the user's preferred language
 */
export const getLanguageLabel = (userLanguage) => {
  if (userLanguage === 'zh-CN' || userLanguage === 'zh-cn') {
    return '简体中文';
  }
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
