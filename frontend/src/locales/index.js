import { LANGUAGES } from '../contexts/LanguageContext';

// Translation files
const translations = {
  EN: {
    // Header/Navigation
    nav: {
      home: 'Home',
      takeTest: 'Take Test',
      types: 'Personality Types',
      articles: 'Articles',
      contact: 'Contact',
      about: 'About',
      instagram: 'Follow us on Instagram'
    },

    // Home page
    home: {
      heroTitle: 'Discover Your True Personality Type',
      heroSubtitle: 'Take our comprehensive Myers-Briggs Type Indicator assessment to unlock deep insights about yourself and your unique way of experiencing the world.',
      startTest: 'Start Test Now',
      learnMore: 'Learn More',
      whyTakeTest: 'Why Take Our MBTI Test?',
      scientificTitle: 'Scientific Approach',
      scientificDesc: 'Based on Carl Jung\'s psychological theory and decades of research in personality psychology.',
      typesTitle: '16 Personality Types',
      typesDesc: 'Discover which of the 16 distinct personality types best describes your preferences and behavior.',
      resultsTitle: 'Detailed Results',
      resultsDesc: 'Get comprehensive insights into your strengths, challenges, and potential career paths.',
      trustedBy: 'Trusted by Thousands',
      testsCompleted: 'Tests Completed',
      personalityTypes: 'Personality Types',
      accuracyRate: 'Accuracy Rate',
      available: 'Available',
      ctaTitle: 'Ready to Discover Your Personality Type?',
      ctaDesc: 'Join thousands of people who have gained valuable insights about themselves. Your journey of self-discovery starts here.',
      whatYoullGain: 'What You\'ll Gain',
      benefits: {
        selfUnderstanding: {
          title: 'Self-Understanding',
          description: 'Gain deeper insights into your natural preferences and behavioral patterns.'
        },
        careerGuidance: {
          title: 'Career Guidance',
          description: 'Discover career paths that align with your personality type and strengths.'
        },
        improvedRelationships: {
          title: 'Improved Relationships',
          description: 'Better understand how you interact with others and communicate more effectively.'
        },
        personalGrowth: {
          title: 'Personal Growth',
          description: 'Identify areas for development and strategies for personal improvement.'
        }
      }
    },

    // Test pages
    test: {
      title: 'Ready to Discover Your Personality Type?',
      description: 'Take our comprehensive MBTI assessment to gain valuable insights into your personality preferences, strengths, and potential career paths.',
      duration: 'Takes approximately 10-15 minutes to complete',
      questions: '16 carefully designed questions',
      personalized: 'Personalized results and insights',
      startFreeTest: 'Start Free Test',
      loading: 'Preparing your personalized assessment...'
    },

    // Statement page
    statement: {
      title: 'Test Instructions',
      description: 'Your answers help reveal how you view different situations and make decisions. There are no right or wrong answers to any question.',
      benefit: 'By understanding your preferences and recognizing others\' tendencies, you can better understand your strengths and improve in both work and relationships.',
      privacy: 'Test results will only be shared with the corresponding test taker and will not be shared without permission.',
      instructions: 'Please note these 4 points when answering:',
      point1: '1. Answer in a relaxed vacation mindset - not at home, work, or with clients - when you don\'t need to consider anyone else.',
      point2: '2. Don\'t think about specific situations, just choose which statement better describes you.',
      point3: '3. Try not to think for more than 15 seconds per question. Answer quickly with what feels right - overthinking reduces accuracy.',
      point4: '4. There are no neutral options. Choose either left or right as much as possible.',
      startTest: 'Start Free Test',
      retrieveResults: 'Retrieve Previous Results',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email address',
      emailRequired: 'Please enter your email address',
      findResults: 'Find My Results',
      retrieving: 'Retrieving...',
      noRecordFound: 'No test results found for this email address',
      retrieveError: 'Failed to retrieve results. Please try again.'
    },

    // Questions
    questions: {
      section: 'Section',
      of: 'of',
      total: 'total',
      parts: 'sections',
      question: 'Question',
      previous: 'Previous',
      continue: 'Continue',
      submit: 'Submit',
      completeSection: 'Please complete all questions in this section to continue.',
      loading: 'Loading questions...',
      answerSelected: 'Answer selected',
      incompleteTitle: 'Incomplete Questions',
      incompleteMessage: 'Please answer the following questions before continuing:',
      questionNumber: 'Question',
      closeModal: 'Close',
      understood: 'Understood'
    },

    // Demographics form
    demographics: {
      title: 'Almost Done!',
      subtitle: 'Please provide some information to personalize your results',
      name: 'Name',
      nameRequired: 'Name is required',
      gender: 'Gender',
      genderRequired: 'Please select your gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      preferNotToSay: 'Prefer not to say',
      ageRange: 'Age Range',
      ageRequired: 'Please select your age range',
      under18: 'Under 18',
      age18to25: '18-25',
      age26to35: '26-35',
      age36to45: '36-45',
      age46to55: '46-55',
      over55: 'Over 55',
      industry: 'Working Industry',
      industryRequired: 'Please select your industry',
      industries: {
        technology: 'Technology/IT',
        healthcare: 'Healthcare',
        education: 'Education',
        finance: 'Finance/Banking',
        marketing: 'Marketing/Advertising',
        sales: 'Sales',
        engineering: 'Engineering',
        creative: 'Creative/Arts',
        legal: 'Legal',
        government: 'Government',
        nonprofit: 'Non-profit',
        retail: 'Retail',
        manufacturing: 'Manufacturing',
        consulting: 'Consulting',
        realEstate: 'Real Estate',
        student: 'Student',
        unemployed: 'Unemployed',
        other: 'Other'
      },
      email: 'Email (Optional)',
      contact: 'Contact (Optional)',
      getResults: 'Get My Results',
      submitting: 'Processing...',
      emailHelp: 'Enter your email to retrieve your results later if you leave the page'
    },

    // Results
    results: {
      title: 'Your Personality Type',
      type: 'Type',
      description: 'Description',
      strengths: 'Strengths',
      challenges: 'Challenges',
      careers: 'Suggested Careers',
      relationships: 'In Relationships',
      share: 'Share Results',
      retake: 'Retake Test',
      downloadReport: 'Download Report'
    },

    // Articles
    articles: {
      title: "MBTI Articles & Insights",
      subtitle: "Explore in-depth articles about personality types, applications, and personal development",
      searchPlaceholder: "Search articles...",
      categories: "Categories",
      popularTags: "Popular Tags",
      featuredArticles: "Featured Articles",
      latestArticles: "Latest Articles",
      readMore: "Read More",
      readTime: "min read",
      author: "By",
      publishedOn: "Published on",
      relatedArticles: "Related Articles",
      backToArticles: "Back to Articles",
      shareArticle: "Share Article",
      noResults: "No articles found",
      loadMore: "Load More Articles",
      filters: {
        all: "All",
        clear: "Clear Filters"
      }
    },

    // Contact
    contact: {
      title: "Contact Us",
      subtitle: "Get in touch with us for any questions about MBTI testing",
      email: "Email",
      emailPlaceholder: "info@hkmbti.com",
      salutation: "Salutation",
      mr: "Mr.",
      ms: "Ms.",
      nameCompany: "Name / Company Name",
      nameCompanyPlaceholder: "Enter your name or company name",
      nameRequired: "Name is required",
      phone: "Contact Phone",
      phonePlaceholder: "Enter your phone number",
      emailAddress: "Email Address", 
      emailAddressPlaceholder: "Enter your email address",
      emailAddressRequired: "Email address is required",
      emailInvalid: "Please enter a valid email address",
      inquiry: "Inquiry Content",
      inquiryPlaceholder: "Please describe your inquiry in detail...",
      inquiryRequired: "Inquiry content is required",
      submit: "Submit",
      submitting: "Submitting...",
      submitSuccess: "Your message has been sent successfully! We will get back to you soon.",
      submitError: "Failed to send message. Please try again later."
    },

    // Footer
    footer: {
      title: 'HK MBTI',
      description: 'Discover your personality type through our comprehensive Myers-Briggs Type Indicator assessment. Understand yourself better and unlock your potential.',
      quickLinks: 'Quick Links',
      home: 'Home',
      about: 'About MBTI',
      takeTest: 'Take Test',
      articles: 'Articles',
      contact: 'Contact Us',
      resources: 'Resources',
      aboutSection: 'About',
      aboutText: 'This MBTI test is designed to help you understand your personality preferences and how you interact with the world around you.',
      disclaimer: 'Disclaimer:',
      disclaimerText: 'This test is for educational and entertainment purposes only. For professional psychological assessment, please consult a qualified practitioner.',
      copyright: 'MBTI Test. Made with',
      copyrightEnd: 'for personality discovery.',
      socialLabel: 'Follow us on Instagram'
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      tryAgain: 'Try Again',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      close: 'Close'
    }
  },

  ZH: {
    // Header/Navigation
    nav: {
      home: '首頁',
      takeTest: '開始測試',
      types: '人格類型',
      articles: '文章',
      contact: '聯絡我們',
      about: '關於我們',
      instagram: '追蹤我們的 Instagram'
    },

    // Home page
    home: {
      heroTitle: '發現你的真實性格類型',
      heroSubtitle: '參加我們全面的MBTI測試，深入了解自己和你獨特的世界體驗方式。',
      startTest: '立即開始測試',
      learnMore: '了解更多',
      whyTakeTest: '為什麼要做我們的MBTI測試？',
      scientificTitle: '科學方法',
      scientificDesc: '基於卡爾·榮格的心理學理論和數十年的人格心理學研究。',
      typesTitle: '16種人格類型',
      typesDesc: '發現16種不同人格類型中哪一種最能描述你的偏好和行為。',
      resultsTitle: '詳細結果',
      resultsDesc: '獲得對你的優勢、挑戰和潛在職業道路的全面洞察。',
      trustedBy: '受數萬人信賴',
      testsCompleted: '完成測試',
      personalityTypes: '人格類型',
      accuracyRate: '準確率',
      available: '全天候可用',
      ctaTitle: '準備好發現你的人格類型了嗎？',
      ctaDesc: '加入萬千名對自己有了寶貴洞察的人群。你的自我發現之旅從這裡開始。',
      whatYoullGain: '你將獲得什麼',
      benefits: {
        selfUnderstanding: {
          title: '自我認知',
          description: '深入了解你的自然偏好和行為模式。'
        },
        careerGuidance: {
          title: '職業指導',
          description: '發現與你的性格類型和優勢相符的職業道路。'
        },
        improvedRelationships: {
          title: '改善關係',
          description: '更好地理解你如何與他人互動並更有效地溝通。'
        },
        personalGrowth: {
          title: '個人成長',
          description: '識別發展領域並制定個人提升策略。'
        }
      }
    },

    // Test pages
    test: {
      title: '準備好發現你的人格類型了嗎？',
      description: '參加我們全面的MBTI評估，獲得對你的人格偏好、優勢和潛在職業道路的寶貴洞察。',
      duration: '大約需要10-15分鐘完成',
      questions: '16個精心設計的問題',
      personalized: '個性化結果和洞察',
      startFreeTest: '開始免費測試',
      loading: '正在準備您的個性化評估...'
    },

    // Statement page
    statement: {
      title: '測試說明',
      description: '你的答案有助顯示你對不同事情的看法及如何做決定。因此每一條問題沒有所謂的對與錯。',
      benefit: '透過瞭解自己的喜好及認識他人的偏向，可以讓你更加清楚自己的長處，在職場上、感情上也會有很大的幫助。',
      privacy: '測試結果只會通知相對應的測試者，沒有得到允許是不會分享測試結果。',
      instructions: '請大家回答時有4點要留意：',
      point1: '1.用一個不是在家，不是在公司，不是在見客，而是去渡假好輕鬆時，不用理任何人時的心情去作答',
      point2: '2.不要去諗是甚麼情境，只須覺得哪句更適合形容你',
      point3: '3.每題儘量不要諗超過15秒，要快答一個你覺得是較適合的選擇，一諗得耐就唔準的',
      point4: '4. 沒有中間的選項，盡可能選擇偏左或偏右',
      startTest: '開始免費測試',
      retrieveResults: '找回之前的結果',
      emailLabel: '電郵地址',
      emailPlaceholder: '請輸入您的電郵地址',
      emailRequired: '請輸入您的電郵地址',
      findResults: '查找我的結果',
      retrieving: '查找中...',
      noRecordFound: '未找到此電郵地址的測試結果',
      retrieveError: '查找結果失敗，請重試。'
    },

    // Questions
    questions: {
      section: '第',
      of: '部分',
      total: '共',
      parts: '部分',
      question: '問題',
      previous: '上一頁',
      continue: '繼續',
      submit: '提交',
      completeSection: '請完成本部分的所有問題才能繼續。',
      loading: '正在載入問題...',
      answerSelected: '已選擇答案',
      incompleteTitle: '未完成的問題',
      incompleteMessage: '請先回答以下問題再繼續：',
      questionNumber: '問題',
      closeModal: '關閉',
      understood: '我知道了'
    },

    // Demographics form
    demographics: {
      title: '即將完成！',
      subtitle: '請提供一些資訊以個性化您的結果',
      name: '姓名',
      nameRequired: '姓名為必填項',
      gender: '性別',
      genderRequired: '請選擇您的性別',
      male: '男性',
      female: '女性',
      other: '其他',
      preferNotToSay: '不願透露',
      ageRange: '年齡範圍',
      ageRequired: '請選擇您的年齡範圍',
      under18: '18歲以下',
      age18to25: '18-25歲',
      age26to35: '26-35歲',
      age36to45: '36-45歲',
      age46to55: '46-55歲',
      over55: '55歲以上',
      industry: '工作行業',
      industryRequired: '請選擇您的行業',
      industries: {
        technology: '科技/資訊科技',
        healthcare: '醫療保健',
        education: '教育',
        finance: '金融/銀行',
        marketing: '市場營銷/廣告',
        sales: '銷售',
        engineering: '工程',
        creative: '創意/藝術',
        legal: '法律',
        government: '政府',
        nonprofit: '非營利組織',
        retail: '零售',
        manufacturing: '製造業',
        consulting: '顧問諮詢',
        realEstate: '房地產',
        student: '學生',
        unemployed: '待業中',
        other: '其他'
      },
      email: '電子郵件（可選）',
      contact: '聯絡方式（可選）',
      getResults: '獲取我的結果',
      submitting: '處理中...',
      emailHelp: '輸入您的電郵地址，以便稍後離開頁面時可以找回您的結果'
    },

    // Results
    results: {
      title: '您的人格類型',
      type: '類型',
      description: '描述',
      strengths: '優勢',
      challenges: '挑戰',
      careers: '建議職業',
      relationships: '在關係中',
      share: '分享結果',
      retake: '重新測試',
      downloadReport: '下載報告'
    },

    // Articles
    articles: {
      title: "MBTI 文章與洞察",
      subtitle: "探索關於人格類型、應用和個人發展的深度文章",
      searchPlaceholder: "搜尋文章...",
      categories: "分類",
      popularTags: "熱門標籤",
      featuredArticles: "精選文章",
      latestArticles: "最新文章",
      readMore: "閱讀更多",
      readTime: "分鐘閱讀",
      author: "作者",
      publishedOn: "發佈於",
      relatedArticles: "相關文章",
      backToArticles: "返回文章列表",
      shareArticle: "分享文章",
      noResults: "未找到文章",
      loadMore: "載入更多文章",
      filters: {
        all: "全部",
        clear: "清除篩選"
      }
    },

    // Contact
    contact: {
      title: "聯絡我們",
      subtitle: "如有任何關於MBTI測試的問題，請與我們聯繫",
      email: "電郵",
      emailPlaceholder: "info@hkmbti.com",
      salutation: "請填寫以下表格",
      mr: "先生",
      ms: "小姐",
      nameCompany: "貴名/公司名稱",
      nameCompanyPlaceholder: "請輸入您的姓名或公司名稱",
      nameRequired: "姓名為必填項",
      phone: "聯絡電話",
      phonePlaceholder: "請輸入您的聯絡電話",
      emailAddress: "電郵地址",
      emailAddressPlaceholder: "請輸入您的電郵地址",
      emailAddressRequired: "電郵地址為必填項",
      emailInvalid: "請輸入有效的電郵地址",
      inquiry: "查詢內容",
      inquiryPlaceholder: "請詳細描述您的查詢內容...",
      inquiryRequired: "查詢內容為必填項",
      submit: "提交",
      submitting: "提交中...",
      submitSuccess: "您的訊息已成功發送！我們將盡快回覆您。",
      submitError: "發送訊息失敗，請稍後再試。"
    },

    // Footer
    footer: {
      title: 'HK MBTI',
      description: '透過我們全面的MBTI測試，發現您的性格類型。更好地了解自己，釋放您的潛能。',
      quickLinks: '快速連結',
      home: '首頁',
      about: '關於MBTI',
      takeTest: '開始測試',
      articles: '文章',
      contact: '聯絡我們',
      resources: '資源',
      aboutSection: '關於',
      aboutText: '這個MBTI測試旨在幫助您了解自己的性格偏好以及您與周圍世界的互動方式。',
      disclaimer: '免責聲明：',
      disclaimerText: '此測試僅供教育和娛樂目的。如需專業心理評估，請諮詢合格的從業人員。',
      copyright: 'MBTI測試。用',
      copyrightEnd: '製作，為性格發現而生。',
      socialLabel: '追蹤我們的Instagram'
    },

    // Common
    common: {
      loading: '載入中...',
      error: '發生錯誤',
      tryAgain: '重試',
      back: '返回',
      next: '下一步',
      submit: '提交',
      close: '關閉'
    }
  }
};

// Helper function to get nested translation
const getTranslation = (translations, path, fallback = '') => {
  return path.split('.').reduce((obj, key) => obj?.[key], translations) || fallback;
};

// Custom hook for translations with both old and new style support
const useTranslations = (language = 'EN') => {
  // Convert language code to uppercase to match our translation keys
  const langKey = language.toUpperCase();
  
  // Fallback to EN if the language key doesn't exist
  const translationData = translations[langKey] || translations['EN'];
  
  const t = (path, fallback = '') => getTranslation(translationData, path, fallback);
  
  // Return both the new function style and old object style for backwards compatibility
  return { 
    t, 
    ...translationData // This provides the old t.home.heroTitle style access
  };
};

export { translations, useTranslations, getTranslation }; 
