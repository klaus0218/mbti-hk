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
      downloadReport: 'Download Report',
      contactConsultantTitle: 'Want personalised guidance?',
      contactConsultantDescription:
        'Our MBTI consultants can help you interpret your results in depth and plan practical next steps.',
      contactConsultantButton: 'Contact us'
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
      subtitle: "Speak with our MBTI consultants and get clear guidance for your personal or professional growth.",
      serviceTitle: "Professional MBTI Consultation Services",
      serviceDescription: "Our consultant team has extensive professional experience and delivers practical MBTI guidance for real-life growth. We regularly host consultation events and have supported over 300 clients through one-on-one sessions, while also providing structured group-class learning for teams and communities.",
      servicePoint1: "In-depth interpretation of your MBTI type, strengths, blind spots, and communication style.",
      servicePoint2: "One-on-one consultation experience with more than 300 clients across career planning, team collaboration, leadership, and relationship development.",
      servicePoint3: "Regular consultation events and workshops designed to help participants apply MBTI insights with confidence.",
      servicePoint4: "Group class facilitation experience, with clear frameworks for communication, conflict handling, and stronger team understanding.",
      reachUsTitle: "WhatsApp",
      reachUsDescription:
        "We are available on WhatsApp and email. Please feel free to contact us anytime. We are happy to support your next step with professional and practical advice.",
      reachUsPoint1:
        "You can enroll in one-on-one MBTI consultation directly on WhatsApp, and we will guide you to the most suitable format based on your needs.",
      reachUsPoint2:
        "You can also ask about MBTI classes and workshop schedules, including options for individuals, teams, and small groups.",
      reachUsPoint3:
        "If you feel stuck in work, communication, or relationships, share your current situation in chat and our consultant will suggest a clear first step.",
      whatsappNumber: "85262387745",
      whatsappLabel: "WhatsApp",
      whatsappDisplay: "+852 6238 7745",
      whatsappTapHint: "Tap to chat",
      consultantEmail: "cpspatrick@mbtihk.com",
      emailLabel: "Email",
      emailCopyHint: "Tap to copy",
      emailCopiedHint: "Copied"
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
      downloadReport: '下載報告',
      contactConsultantTitle: '想獲得個人化指導？',
      contactConsultantDescription:
        '我們的 MBTI 顧問可協助你更深入解讀結果，並規劃實際可行的下一步。',
      contactConsultantButton: '聯絡我們'
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
      subtitle: "由專業 MBTI 顧問為你提供深入分析與清晰方向，助你在個人與職涯上持續成長。",
      serviceTitle: "專業 MBTI 諮詢服務",
      serviceDescription: "我們的顧問團隊具備豐富專業經驗，能把 MBTI 分析轉化為實際可行的成長方向。我們定期舉辦顧問活動，並已為超過 300 位客戶提供一對一諮詢，同時亦具備小組課程帶領經驗，協助不同背景人士深入理解人格特質與溝通模式。",
      servicePoint1: "深入分析你的 MBTI 類型、優勢、盲點與溝通風格。",
      servicePoint2: "一對一諮詢經驗超過 300 位客戶，涵蓋職涯規劃、團隊協作、領導發展與關係提升。",
      servicePoint3: "定期舉辦顧問活動與工作坊，幫助你更有系統地應用 MBTI 洞察。",
      servicePoint4: "具備小組課程帶領經驗，協助團隊提升溝通效率、理解差異並建立更佳合作。",
      reachUsTitle: "WhatsApp",
      reachUsDescription:
        "歡迎透過 WhatsApp 或電郵與我們聯絡。你可放心提出需求，我們會以專業、務實的方式盡快回覆並提供建議。",
      reachUsPoint1:
        "你可直接透過 WhatsApp 報名一對一 MBTI 顧問服務，我們會按你的需要建議最合適的諮詢形式。",
      reachUsPoint2:
        "你亦可查詢 MBTI 課程與工作坊時間，包括個人、團隊與小組學習安排。",
      reachUsPoint3:
        "若你在職涯、溝通或關係上感到卡住，歡迎先在對話中描述情況，我們的專業顧問會先給你清晰可行的第一步建議。",
      whatsappNumber: "85262387745",
      whatsappLabel: "WhatsApp",
      whatsappDisplay: "+852 6238 7745",
      whatsappTapHint: "點按開啟對話",
      consultantEmail: "cpspatrick@mbtihk.com",
      emailLabel: "電郵",
      emailCopyHint: "點按複製",
      emailCopiedHint: "已複製"
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
  },

  ZH_CN: {
    // Header/Navigation
    nav: {
      home: '首页',
      takeTest: '开始测试',
      types: '人格类型',
      articles: '文章',
      contact: '联系我们',
      about: '关于我们',
      instagram: '关注我们的 Instagram'
    },

    // Home page
    home: {
      heroTitle: '发现你的真实性格类型',
      heroSubtitle: '参加我们全面的MBTI测试，深入了解自己和你独特的世界体验方式。',
      startTest: '立即开始测试',
      learnMore: '了解更多',
      whyTakeTest: '为什么要做我们的MBTI测试？',
      scientificTitle: '科学方法',
      scientificDesc: '基于卡尔·荣格的心理学理论和数十年的人格心理学研究。',
      typesTitle: '16种人格类型',
      typesDesc: '发现16种不同人格类型中哪一种最能描述你的偏好和行为。',
      resultsTitle: '详细结果',
      resultsDesc: '获得对你的优势、挑战和潜在职业道路的全面洞察。',
      trustedBy: '受数万人信赖',
      testsCompleted: '完成测试',
      personalityTypes: '人格类型',
      accuracyRate: '准确率',
      available: '全天候可用',
      ctaTitle: '准备好发现你的人格类型了吗？',
      ctaDesc: '加入万千名对自己有了宝贵洞察的人群。你的自我发现之旅从这里开始。',
      whatYoullGain: '你将获得什么',
      benefits: {
        selfUnderstanding: {
          title: '自我认知',
          description: '深入了解你的自然偏好和行为模式。'
        },
        careerGuidance: {
          title: '职业指导',
          description: '发现与你的性格类型和优势相符的职业道路。'
        },
        improvedRelationships: {
          title: '改善关系',
          description: '更好地理解你如何与他人互动并更有效地沟通。'
        },
        personalGrowth: {
          title: '个人成长',
          description: '识别发展领域并制定个人提升策略。'
        }
      }
    },

    // Test pages
    test: {
      title: '准备好发现你的人格类型了吗？',
      description: '参加我们全面的MBTI评估，获得对你的人格偏好、优势和潜在职业道路的宝贵洞察。',
      duration: '大约需要10-15分钟完成',
      questions: '16个精心设计的问题',
      personalized: '个性化结果和洞察',
      startFreeTest: '开始免费测试',
      loading: '正在准备您的个性化评估...'
    },

    // Statement page
    statement: {
      title: '测试说明',
      description: '你的答案有助于展现你对不同事情的看法及如何做决定。因此每一道题目没有所谓的对与错。',
      benefit: '通过了解自己的喜好及认识他人的偏向，可以让你更加清楚自己的长处，在职场上、感情上也会有很大的帮助。',
      privacy: '测试结果只会通知相对应的测试者，未经允许不会分享测试结果。',
      instructions: '请大家回答时留意以下4点：',
      point1: '1. 请用一种不是在家里、不是在公司、不是在见客户，而是去度假非常轻松、不需要顾及任何人的心情来作答',
      point2: '2. 不要去设想具体情境，只需选择哪一句话更能描述你',
      point3: '3. 每道题尽量不要思考超过15秒，快速选出你认为更合适的选项，思考过久反而不准确',
      point4: '4. 没有中间的中立选项，请尽可能选择偏左或偏右',
      startTest: '开始免费测试',
      retrieveResults: '找回之前的测试结果',
      emailLabel: '邮箱地址',
      emailPlaceholder: '请输入您的邮箱地址',
      emailRequired: '请输入您的邮箱地址',
      findResults: '查找我的测试结果',
      retrieving: '查询中...',
      noRecordFound: '未找到此邮箱地址的测试结果',
      retrieveError: '查询测试结果失败，请重试。'
    },

    // Questions
    questions: {
      section: '第',
      of: '部分',
      total: '共',
      parts: '部分',
      question: '问题',
      previous: '上一页',
      continue: '继续',
      submit: '提交',
      completeSection: '请完成本部分的所有问题才能继续。',
      loading: '正在加载问题...',
      answerSelected: '已选择答案',
      incompleteTitle: '未完成的问题',
      incompleteMessage: '请先回答以下问题再继续：',
      questionNumber: '问题',
      closeModal: '关闭',
      understood: '我知道了'
    },

    // Demographics form
    demographics: {
      title: '即将完成！',
      subtitle: '请提供一些信息以个性化您的结果',
      name: '姓名',
      nameRequired: '姓名为必填项',
      gender: '性别',
      genderRequired: '请选择您的性别',
      male: '男性',
      female: '女性',
      other: '其他',
      preferNotToSay: '不愿透露',
      ageRange: '年龄范围',
      ageRequired: '请选择您的年龄范围',
      under18: '18岁以下',
      age18to25: '18-25岁',
      age26to35: '26-35岁',
      age36to45: '36-45岁',
      age46to55: '46-55岁',
      over55: '55岁以上',
      industry: '工作行业',
      industryRequired: '请选择您的行业',
      industries: {
        technology: '科技/信息技术',
        healthcare: '医疗保健',
        education: '教育',
        finance: '金融/银行',
        marketing: '市场营销/广告',
        sales: '销售',
        engineering: '工程',
        creative: '创意/艺术',
        legal: '法律',
        government: '政府',
        nonprofit: '非营利组织',
        retail: '零售',
        manufacturing: '制造业',
        consulting: '顾问咨询',
        realEstate: '房地产',
        student: '学生',
        unemployed: '待业中',
        other: '其他'
      },
      email: '电子邮件（可选）',
      contact: '联系方式（可选）',
      getResults: '获取我的结果',
      submitting: '处理中...',
      emailHelp: '输入您的邮箱地址，以便稍后离开页面时可以找回您的结果'
    },

    // Results
    results: {
      title: '您的人格类型',
      type: '类型',
      description: '描述',
      strengths: '优势',
      challenges: '挑战',
      careers: '建议职业',
      relationships: '在关系中',
      share: '分享结果',
      retake: '重新测试',
      downloadReport: '下载报告',
      contactConsultantTitle: '想获得个性化指导？',
      contactConsultantDescription:
        '我们的 MBTI 顾问可协助你更深入解读结果，并规划实际可行的下一步。',
      contactConsultantButton: '联系我们'
    },

    // Articles
    articles: {
      title: "MBTI 文章与洞察",
      subtitle: "探索关于人格类型、应用和个人发展的深度文章",
      searchPlaceholder: "搜索文章...",
      categories: "分类",
      popularTags: "热门标签",
      featuredArticles: "精选文章",
      latestArticles: "最新文章",
      readMore: "阅读更多",
      readTime: "分钟阅读",
      author: "作者",
      publishedOn: "发布于",
      relatedArticles: "相关文章",
      backToArticles: "返回文章列表",
      shareArticle: "分享文章",
      noResults: "未找到文章",
      loadMore: "加载更多文章",
      filters: {
        all: "全部",
        clear: "清除筛选"
      }
    },

    // Contact
    contact: {
      title: "联系我们",
      subtitle: "由专业 MBTI 顾问为你提供深入分析与清晰方向，助你在个人与职涯上持续成长。",
      serviceTitle: "专业 MBTI 咨询服务",
      serviceDescription: "我们的顾问团队具备丰富专业经验，能把 MBTI 分析转化为实际可行的成长方向。我们定期举办顾问活动，并已为超过 300 位客户提供一对一咨询，同时亦具备小组课程带领经验，协助不同背景人士深入理解人格特质与沟通模式。",
      servicePoint1: "深入分析你的 MBTI 类型、优势、盲点与沟通风格。",
      servicePoint2: "一对一咨询经验超过 300 位客户，涵盖职涯规划、团队协作、领导发展与关系提升。",
      servicePoint3: "定期举办顾问活动与工作坊，帮助你更有系统地应用 MBTI 洞察。",
      servicePoint4: "具备小组课程带领经验，协助团队提升沟通效率、理解差异并建立更佳合作。",
      reachUsTitle: "WhatsApp",
      reachUsDescription:
        "欢迎通过 WhatsApp 或邮件与我们联系。你可放心提出需求，我们会以专业、务实的方式尽快回复并提供建议。",
      reachUsPoint1:
        "你可直接通过 WhatsApp 报名一对一 MBTI 顾问服务，我们会按你的需要建议最合适的形式。",
      reachUsPoint2:
        "你亦可查询 MBTI 课程与工作坊时间，包括个人、团队与小组学习安排。",
      reachUsPoint3:
        "若你在职涯、沟通或关系上感到卡住，欢迎先在对话中描述情况，我们的专业顾问会先给你清晰可行的第一步建议。",
      whatsappNumber: "85262387745",
      whatsappLabel: "WhatsApp",
      whatsappDisplay: "+852 6238 7745",
      whatsappTapHint: "点击开启对话",
      consultantEmail: "cpspatrick@mbtihk.com",
      emailLabel: "邮箱",
      emailCopyHint: "点击复制",
      emailCopiedHint: "已复制"
    },

    // Footer
    footer: {
      title: 'HK MBTI',
      description: '通过我们全面的MBTI测试，发现您的性格类型。更好地了解自己，释放您的潜能。',
      quickLinks: '快速链接',
      home: '首页',
      about: '关于MBTI',
      takeTest: '开始测试',
      articles: '文章',
      contact: '联系我们',
      resources: '资源',
      aboutSection: '关于',
      aboutText: '这个MBTI测试旨在帮助您了解自己的性格偏好以及您与周围世界的互动方式。',
      disclaimer: '免责声明：',
      disclaimerText: '此测试仅供教育和娱乐目的。如需专业心理评估，请咨询合格的从业人员。',
      copyright: 'MBTI测试。用',
      copyrightEnd: '制作，为性格发现而生。',
      socialLabel: '关注我们的Instagram'
    },

    // Common
    common: {
      loading: '加载中...',
      error: '发生错误',
      tryAgain: '重试',
      back: '返回',
      next: '下一步',
      submit: '提交',
      close: '关闭'
    }
  }
};

// Aliases
translations['ZH-CN'] = translations.ZH_CN;

// Helper function to get nested translation
const getTranslation = (translations, path, fallback = '') => {
  return path.split('.').reduce((obj, key) => obj?.[key], translations) || fallback;
};

// Custom hook for translations with both old and new style support
const useTranslations = (language = 'EN') => {
  const langUpper = (language || 'EN').toUpperCase();
  const normalizedKey = langUpper.replace('-', '_');
  
  // Match ZH_CN, ZH-CN, ZH, EN, etc.
  const translationData = translations[normalizedKey] || translations[langUpper] || translations['EN'];
  
  const t = (path, fallback = '') => getTranslation(translationData, path, fallback);
  
  // Return both the new function style and old object style for backwards compatibility
  return { 
    t, 
    ...translationData // This provides the old t.home.heroTitle style access
  };
};

export { translations, useTranslations, getTranslation }; 
