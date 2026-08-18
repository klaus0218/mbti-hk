import React, { createContext, useContext, useState, useEffect } from 'react';

// Language context
const LanguageContext = createContext();

// Supported languages
export const LANGUAGES = {
  EN: 'en',
  ZH: 'zh',
  ZH_CN: 'zh-CN'
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to English
    const savedLanguage = localStorage.getItem('mbti_language');
    return savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)
      ? savedLanguage
      : LANGUAGES.EN;
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('mbti_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => {
      if (prev === LANGUAGES.EN) return LANGUAGES.ZH;
      if (prev === LANGUAGES.ZH) return LANGUAGES.ZH_CN;
      return LANGUAGES.EN;
    });
  };

  const switchToLanguage = (lang) => {
    if (Object.values(LANGUAGES).includes(lang)) {
      setLanguage(lang);
    }
  };

  const value = {
    language,
    setLanguage: switchToLanguage,
    toggleLanguage,
    isEnglish: language === LANGUAGES.EN,
    isChinese: language === LANGUAGES.ZH || language === LANGUAGES.ZH_CN,
    isTraditionalChinese: language === LANGUAGES.ZH,
    isSimplifiedChinese: language === LANGUAGES.ZH_CN
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext; 
