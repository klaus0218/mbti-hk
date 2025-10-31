import React, { createContext, useContext, useState, useEffect } from 'react';

// Language context
const LanguageContext = createContext();

// Supported languages
export const LANGUAGES = {
  EN: 'en',
  ZH: 'zh'
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to English
    const savedLanguage = localStorage.getItem('mbti_language');
    return savedLanguage || LANGUAGES.EN;
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('mbti_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === LANGUAGES.EN ? LANGUAGES.ZH : LANGUAGES.EN);
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
    isChinese: language === LANGUAGES.ZH
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
