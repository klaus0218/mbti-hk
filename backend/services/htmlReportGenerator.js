const fs = require('fs-extra');
const path = require('path');

class HTMLReportGenerator {
  constructor() {
    this.outputDir = path.join(__dirname, '../temp-reports');
  }

  async ensureOutputDir() {
    await fs.ensureDir(this.outputDir);
  }

  async generateHTMLFromAnalysis(mbtiResult, analysis, language = 'en') {    
    try {
      const htmlContent = this.generateHTMLContent(mbtiResult, analysis, language);
      
      if (!htmlContent || htmlContent.length < 100) {
        throw new Error('Generated HTML content is too short or empty');
      }
      
      return htmlContent
      
    } catch (error) {
      console.error('Report generation error:', error);
    }
  }

  generateHTMLContent(mbtiResult, analysis, language = 'en') {
    const { type, scores, confidence, dimensions } = mbtiResult;
    
    // Language-specific content
    const content = this.getLanguageContent(language);
    
    return `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <title>${content.title} - ${type}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
            line-height: 1.8;
            color: #2c3e50;
            max-width: 800px;
            margin: 0 auto;
            padding: 30px;
            background-color: #fafbfc;
        }
        .header {
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            border-radius: 15px;
            margin-bottom: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .title {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 15px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .subtitle {
            font-size: 22px;
            margin-bottom: 15px;
            opacity: 0.95;
        }
        .date {
            font-size: 16px;
            opacity: 0.8;
        }
        .section {
            background: white;
            margin-bottom: 35px;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
            page-break-inside: avoid;
            break-inside: avoid;
            min-height: 200px;
            max-width: 100%;
        }
        .section-title {
            font-size: 24px;
            color: #2c3e50;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e9ecef;
            font-weight: 600;
        }
        .subsection-title {
            font-size: 20px;
            color: #34495e;
            margin: 25px 0 15px 0;
            padding-left: 15px;
            border-left: 3px solid #3498db;
            font-weight: 600;
            page-break-after: avoid;
            break-after: avoid;
        }
        .content {
            text-align: justify;
            margin-bottom: 20px;
            line-height: 1.8;
            font-size: 16px;
            max-width: 100%;
        }
        .content p {
            margin-bottom: 15px;
            page-break-inside: avoid;
            break-inside: avoid;
            max-width: 100%;
        }
        .scores-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin: 25px 0;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .score-item {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #dee2e6;
            transition: transform 0.2s ease;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .score-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        .score-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 15px;
            font-size: 16px;
        }
        .score-bar {
            background: #e9ecef;
            height: 25px;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 15px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        .score-fill {
            background: linear-gradient(90deg, #667eea, #764ba2);
            height: 100%;
            border-radius: 12px;
            transition: width 0.8s ease;
        }
        .score-value {
            font-size: 15px;
            color: #6c757d;
            font-weight: 500;
        }
        .highlight-box {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            border: 1px solid #90caf9;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            page-break-inside: avoid;
            break-inside: avoid;
            max-width: 100%;
        }
        .highlight-title {
            font-weight: 600;
            color: #1976d2;
            margin-bottom: 10px;
            font-size: 18px;
        }
        .page-break {
            page-break-before: always;
            break-before: page;
        }
        .force-page-break {
            page-break-before: always;
            break-before: page;
            page-break-inside: avoid;
            break-inside: avoid;
            margin-top: 20px;
        }
        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin: 20px 0;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .bullet-list {
            list-style: none;
            padding-left: 0;
        }
        .bullet-list li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .bullet-list li:before {
            content: "•";
            color: #667eea;
            font-weight: bold;
            font-size: 20px;
            position: absolute;
            left: 0;
            top: 6px;
        }
        
        /* Enhanced page break controls */
        .force-page-break {
            page-break-before: always !important;
            break-before: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-top: 20px;
        }
        
        .section {
            background: white;
            margin-bottom: 35px;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
            border-left: 5px solid #667eea;
            /* Remove automatic page break prevention - allow natural flow */
            min-height: 200px;
            max-width: 100%;
            overflow-wrap: break-word;
            word-wrap: break-word;
        }
        
        /* Allow content to flow naturally across pages */
        .content {
            text-align: justify;
            margin-bottom: 20px;
            line-height: 1.8;
            font-size: 16px;
            max-width: 100%;
            overflow-wrap: break-word;
            word-wrap: break-word;
            /* Remove automatic page break prevention */
        }
        
        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin: 20px 0;
            /* Remove automatic page break prevention - allow natural flow */
        }
        
        .bullet-list li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
            /* Remove automatic page break prevention - allow natural flow */
        }
        
        /* Better print controls */
        @media print {
            .force-page-break { 
                page-break-before: always !important; 
                break-before: page !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            .section { 
                box-shadow: none; 
                border: 1px solid #ddd; 
                margin-bottom: 20px;
                padding: 20px;
                min-height: auto;
                max-width: none;
                /* Remove automatic page break prevention in print */
            }
            .content {
                font-size: 11pt;
                line-height: 1.3;
                max-width: none;
                /* Remove automatic page break prevention in print */
            }
        }
        
        /* Force page breaks for specific sections - only when explicitly needed */
        .executive-summary {
            page-break-after: always !important;
            break-after: page !important;
        }
        
        /* Ensure proper content flow */
        .content-wrapper {
            max-width: 100%;
            overflow-wrap: break-word;
            word-wrap: break-word;
            /* Remove automatic page break prevention */
        }
        
        /* Allow content to flow naturally - remove automatic prevention */
        p, li, div, h1, h2, h3, h4, h5, h6 {
            orphans: 3;
            widows: 3;
            /* Remove automatic page break prevention */
        }
        
        /* PDF and print specific styles */
        @media print {
            body { 
                margin: 0; 
                background: white; 
                font-size: 12pt;
                line-height: 1.4;
                max-width: none;
            }
            .page-break { 
                page-break-before: always; 
                break-before: page;
            }
            .force-page-break { 
                page-break-before: always; 
                break-before: page;
                page-break-inside: avoid;
                break-inside: avoid;
            }
            .keep-together { 
                page-break-inside: avoid; 
                break-inside: avoid;
            }
            .section { 
                box-shadow: none; 
                border: 1px solid #ddd; 
                margin-bottom: 20px;
                padding: 20px;
                min-height: auto;
                max-width: none;
                /* Remove automatic page break prevention in print */
            }
            .header {
                margin-bottom: 20px;
                padding: 20px;
                /* Remove automatic page break prevention in print */
            }
            .title {
                font-size: 24pt;
            }
            .subtitle {
                font-size: 16pt;
            }
            .section-title {
                font-size: 18pt;
                margin-bottom: 15px;
            }
            .subsection-title {
                font-size: 16pt;
                margin: 15px 0 10px 0;
            }
            .content {
                font-size: 11pt;
                line-height: 1.3;
                max-width: none;
                /* Remove automatic page break prevention in print */
            }
            .two-column {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            .scores-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
        }
        
        /* PDF-specific styles */
        @page {
            size: A4;
            margin: 15mm;
            orphans: 2;
            widows: 2;
        }
        
        /* Allow headings to break naturally - only prevent breaking after */
        h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            break-after: avoid;
            /* Remove page-break-inside: avoid to allow natural flow */
        }
        
        /* Allow content to flow naturally */
        p, li, div {
            orphans: 2;
            widows: 2;
            /* Remove automatic page break prevention */
        }
        
        /* Allow content to flow naturally - remove automatic prevention */
        .highlight-box, .two-column {
            /* Remove automatic page break prevention */
        }
        
        /* Allow lists to flow naturally */
        ul, ol {
            /* Remove automatic page break prevention */
        }
        
        /* Better spacing for print */
        .section + .section {
            margin-top: 30px;
        }
        
        /* Ensure content flows properly */
        .content-wrapper {
            max-width: 100%;
            overflow-wrap: break-word;
            word-wrap: break-word;
        }
        
        /* Allow section headers and content to flow naturally */
        .section-header {
            page-break-after: avoid !important;
            break-after: avoid !important;
            /* Remove page-break-inside: avoid to allow natural flow */
        }
        
        .section-content {
            page-break-before: avoid !important;
            break-before: avoid !important;
            /* Remove page-break-inside: avoid to allow natural flow */
        }
        
        /* Ensure section titles and content stay together */
        .section-title {
            font-size: 24px;
            color: #2c3e50;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e9ecef;
            font-weight: 600;
            page-break-after: avoid !important;
            break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }
        
        /* Keep subsection titles with their content */
        .subsection-title {
            font-size: 20px;
            color: #34495e;
            margin: 25px 0 15px 0;
            padding-left: 15px;
            border-left: 3px solid #3498db;
            font-weight: 600;
            page-break-after: avoid !important;
            break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }
    </style>
</head>
<body>
    <div class="header keep-together">
        <div class="title">${content.title}</div>
        <div class="subtitle">${content.typeLabel}: ${type}</div>
        <div class="date">${content.generatedOn}: ${new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}</div>

        <div class="scores-section">
            <div class="section-title">📊 ${content.assessmentResults}</div>
            <div class="scores-grid">
                ${this.generateScoresHTML(mbtiResult, language)}
            </div>
        </div>
    </div>

    <div class="section force-page-break">
        <div class="section-title">📋 ${content.executiveSummary}</div>
        <div class="content">
            ${this.generateExecutiveSummary(mbtiResult, language)}
        </div>
    </div>

    ${analysis && analysis.fullReport ? this.generateComprehensiveReportSections(analysis.fullReport[language] || analysis.fullReport['zh-CN'] || analysis.fullReport.zh || analysis.fullReport.en || analysis.fullReport, language) : ''}

    <div class="section force-page-break">
        <div class="section-title">💡 ${content.recommendations}</div>
        <div class="content">
            ${this.generateRecommendations(mbtiResult, language)}
        </div>
    </div>
</body>
</html>`;
  }

  generateTextReport(mbtiResult, analysis, language = 'en') {
    const { type, scores, confidence, dimensions } = mbtiResult;
    
    const content = this.getLanguageContent(language);
    
    let report = `${content.title}\n`;
    report += `${content.typeLabel}: ${type}\n`;
    report += `${content.generatedOn}: ${new Date().toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US')}\n`;
    report += `\n${'='.repeat(50)}\n\n`;
    
    report += `${content.executiveSummary}\n`;
    report += `${this.generateExecutiveSummaryText(mbtiResult, language)}\n\n`;
    
    report += `${content.assessmentResults}\n`;
    report += `${this.generateScoresText(mbtiResult, language)}\n\n`;
    
    if (analysis && analysis.preview) {
      report += `${content.analysisPreview}\n`;
      report += `${this.extractContentText(analysis.preview, language)}\n\n`;
    }
    
    if (analysis && analysis.fullReport) {
      report += `${content.comprehensiveReport}\n`;
      report += `${this.extractContentText(analysis.fullReport, language)}\n\n`;
    }
    
    report += `${content.recommendations}\n`;
    report += `${this.generateRecommendationsText(mbtiResult, language)}\n\n`;
    
    return report;
  }

  generateScoresText(mbtiResult, language = 'en') {
    const { dimensions, scores, confidence } = mbtiResult;
    
    // Create dimension data with proper scoring
    const dimensionsData = [
      { 
        name: language === 'zh-CN' ? '外向 (E) vs 内向 (I)' : (language === 'zh' ? '外向 (E) vs 內向 (I)' : 'Extroversion (E) vs Introversion (I)'), 
        left: 'E', 
        right: 'I', 
        leftScore: scores?.EI?.E || 0, 
        rightScore: scores?.EI?.I || 0, 
        pref: dimensions?.EI || 'E',
        confidence: confidence?.EI || 0
      },
      { 
        name: language === 'zh-CN' ? '感觉 (S) vs 直觉 (N)' : (language === 'zh' ? '感覺 (S) vs 直覺 (N)' : 'Sensing (S) vs Intuition (N)'), 
        left: 'S', 
        right: 'N', 
        leftScore: scores?.SN?.S || 0, 
        rightScore: scores?.SN?.N || 0, 
        pref: dimensions?.SN || 'S',
        confidence: confidence?.SN || 0
      },
      { 
        name: language === 'zh-CN' ? '思考 (T) vs 情感 (F)' : (language === 'zh' ? '思考 (T) vs 情感 (F)' : 'Thinking (T) vs Feeling (F)'), 
        left: 'T', 
        right: 'F', 
        leftScore: scores?.TF?.T || 0, 
        rightScore: scores?.TF?.F || 0, 
        pref: dimensions?.TF || 'T',
        confidence: confidence?.TF || 0
      },
      { 
        name: language === 'zh-CN' ? '判断 (J) vs 感知 (P)' : (language === 'zh' ? '判斷 (J) vs 感知 (P)' : 'Judging (J) vs Perceiving (P)'), 
        left: 'J', 
        right: 'P', 
        leftScore: scores?.JP?.J || 0, 
        rightScore: scores?.JP?.P || 0, 
        pref: dimensions?.JP || 'J',
        confidence: confidence?.JP || 0
      }
    ];
    
    return dimensionsData.map(dim => {
      const preferredScore = dim.pref === dim.left ? dim.leftScore : dim.rightScore;
      const oppositeScore = dim.pref === dim.left ? dim.rightScore : dim.leftScore;
      const confidenceText = language === 'zh' ? 
        (dim.confidence > 60 ? (language === 'zh-CN' ? '强烈偏好' : '強烈偏好') : dim.confidence > 30 ? '中等偏好' : (language === 'zh-CN' ? '轻微偏好' : '輕微偏好')) :
        (dim.confidence > 60 ? 'Strong' : dim.confidence > 30 ? 'Moderate' : 'Slight');
      
      return `${dim.name}\n` +
        `${dim.pref}: ${preferredScore}% | ${dim.pref === dim.left ? dim.right : dim.left}: ${oppositeScore}%\n` +
        `${language.startsWith('zh') ? '偏好' : 'Preference'}: ${dim.pref} (${confidenceText} - ${dim.confidence}%)\n`;
    }).join('\n');
  }

  generateScoresHTML(mbtiResult, language = 'en') {
    const { dimensions, scores, confidence } = mbtiResult;
    
    // Create dimension data with proper scoring
    const dimensionsData = [
      { 
        name: language === 'zh-CN' ? '外向 (E) vs 内向 (I)' : (language === 'zh' ? '外向 (E) vs 內向 (I)' : 'Extroversion (E) vs Introversion (I)'), 
        left: 'E', 
        right: 'I', 
        leftScore: scores?.E || 0, 
        rightScore: scores?.I || 0, 
        pref: dimensions?.EI,
        confidence: confidence?.EI || 0
      },
      { 
        name: language === 'zh-CN' ? '感觉 (S) vs 直觉 (N)' : (language === 'zh' ? '感覺 (S) vs 直覺 (N)' : 'Sensing (S) vs Intuition (N)'), 
        left: 'S', 
        right: 'N', 
        leftScore: scores?.S || 0, 
        rightScore: scores?.N || 0, 
        pref: dimensions?.SN,
        confidence: confidence?.SN || 0
      },
      { 
        name: language === 'zh-CN' ? '思考 (T) vs 情感 (F)' : (language === 'zh' ? '思考 (T) vs 情感 (F)' : 'Thinking (T) vs Feeling (F)'), 
        left: 'T', 
        right: 'F', 
        leftScore: scores?.T || 0, 
        rightScore: scores?.F || 0, 
        pref: dimensions?.TF,
        confidence: confidence?.TF || 0
      },
      { 
        name: language === 'zh-CN' ? '判断 (J) vs 感知 (P)' : (language === 'zh' ? '判斷 (J) vs 感知 (P)' : 'Judging (J) vs Perceiving (P)'), 
        left: 'J', 
        right: 'P', 
        leftScore: scores?.J || 0, 
        rightScore: scores?.P || 0, 
        pref: dimensions?.JP,
        confidence: confidence?.JP || 0
      }
    ];
    
    return dimensionsData.map(dim => {
      // Calculate preference strength (how strong the preference is)
      const preferenceStrength = dim.leftScore - dim.rightScore;
      
      // Determine which side is preferred based on preference strength
      const isLeftPreferred = preferenceStrength > 0;
      const preferredScore = isLeftPreferred ? dim.leftScore : dim.rightScore;
      const oppositeScore = isLeftPreferred ? dim.rightScore : dim.leftScore;
      const preferredTrait = isLeftPreferred ? dim.left : dim.right;
      const oppositeTrait = isLeftPreferred ? dim.right : dim.left;
      
      // Calculate the percentage for the visual bar (how much of the bar should be filled)
      // The bar should show the relative strength of the preferred trait
      const totalScore = dim.leftScore + dim.rightScore;
      const barPercentage = totalScore > 0 ? (preferredScore / totalScore) * 100 : 50;
      
      // Create confidence indicator
      const confidenceLevel = dim.confidence > 60 ? '🔴' : dim.confidence > 30 ? '🟡' : '🟢';
      const confidenceText = language === 'zh' ? 
        (dim.confidence > 60 ? (language === 'zh-CN' ? '强烈偏好' : '強烈偏好') : dim.confidence > 30 ? '中等偏好' : (language === 'zh-CN' ? '轻微偏好' : '輕微偏好')) :
        (dim.confidence > 60 ? 'Strong' : dim.confidence > 30 ? 'Moderate' : 'Slight');
      
      return `
        <div class="score-item">
          <div class="score-label">
            ${dim.name} ${confidenceLevel}
            <span style="font-size: 14px; color: #6c757d;">(${confidenceText})</span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${barPercentage}%"></div>
          </div>
          <div class="score-value">
            <strong>${preferredTrait}</strong> (${preferredScore}%) vs ${oppositeTrait} (${oppositeScore}%)
          </div>
          <div style="margin-top: 10px; font-size: 14px; color: #495057;">
            ${language === 'zh-CN' ? '偏好强度' : (language === 'zh' ? '偏好強度' : 'Preference Strength')}: ${dim.confidence}%
          </div>
        </div>
      `;
    }).join('');
  }

  generateExecutiveSummary(mbtiResult, language = 'en') {
    const { type, scores, confidence } = mbtiResult;
    
    const content = this.getLanguageContent(language);
    
    let summary = `<div class="highlight-box">
      <div class="highlight-title">${language === 'zh-CN' ? '欢迎开始您的个人MBTI之旅！' : (language === 'zh' ? '歡迎開始您的個人MBTI之旅！' : 'Welcome to Your Personal MBTI Journey!')}</div>
      <p>${language === 'zh-CN' ? '恭喜！您刚刚解锁了一个强大的工具来更好地了解自己。这份综合报告是您个人和职业成功的路线图。' : (language === 'zh' ? '恭喜！您剛剛解鎖了一個強大的工具來更好地了解自己。這份綜合報告是您個人和職業成功的路線圖。' : 'Congratulations! You\'ve just unlocked a powerful tool for understanding yourself better. This comprehensive report is your roadmap to personal and professional success.')}</p>
    </div>`;
    
    summary += `<p><strong>${language === 'zh-CN' ? '您的MBTI类型：' : (language === 'zh' ? '您的MBTI類型：' : 'Your MBTI Type:')}</strong> <span style="color: #667eea; font-weight: 600; font-size: 18px;">${type}</span></p>`;
    
    if (confidence) {
      const avgConfidence = Object.values(confidence).reduce((a, b) => a + b, 0) / 4;
      if (avgConfidence > 60) {
        summary += `<p>${language === 'zh-CN' ? '检测到强烈偏好：' : (language === 'zh' ? '檢測到強烈偏好：' : 'Strong Preferences Detected:')} <strong>${language === 'zh-CN' ? '您的性格显示出清晰、明确的特征。这意味着您对自己是谁以及生活中想要什么有强烈的感觉。' : (language === 'zh' ? '您的性格顯示出清晰、明確的特徵。這意味著您對自己是誰以及生活中想要什麼有強烈的感覺。' : 'Your personality shows clear, well-defined characteristics. This means you have a strong sense of who you are and what you want in life.')}</strong></p>`;
      } else if (avgConfidence > 30) {
        summary += `<p>⚖️ <strong>${language.startsWith('zh') ? '平衡偏好：' : 'Balanced Preferences:'}</strong> ${language === 'zh-CN' ? '您在性格方面显示出适度的清晰度，这表明您在不同情况下具有灵活性和适应性。' : (language === 'zh' ? '您在性格方面顯示出適度的清晰度，這表明您在不同情況下具有靈活性和適應性。' : 'You show moderate clarity in your personality, suggesting flexibility and adaptability across different situations.')}</p>`;
      } else {
        summary += `<p>${language === 'zh-CN' ? '适应性强的天性：' : (language === 'zh' ? '適應性強的天性：' : 'Adaptable Nature:')} <strong>${language === 'zh-CN' ? '您的偏好显示出平衡的特征，表明您可以轻松适应不同的环境和挑战。' : (language === 'zh' ? '您的偏好顯示出平衡的特徵，表明您可以輕鬆適應不同的環境和挑戰。' : 'Your preferences show balanced characteristics, indicating you can easily adjust to different environments and challenges.')}</strong></p>`;
      }
    }
    
    summary += `<div class="two-column">
      <div>
        <div class="subsection-title">${language === 'zh-CN' ? '您将发现什么' : (language === 'zh' ? '您將發現什麼' : 'What You\'ll Discover')}</div>
        <ul class="bullet-list">
          <li>${language === 'zh-CN' ? '适合您性格的完美职业道路' : (language === 'zh' ? '適合您性格的完美職業道路' : 'Perfect career paths for your personality')}</li>
          <li>${language === 'zh-CN' ? '理想的朋友和伴侣类型' : (language === 'zh' ? '理想的朋友和伴侶類型' : 'Ideal friend and partner types')}</li>
          <li>${language === 'zh-CN' ? '心理健康洞察和应对策略' : (language === 'zh' ? '心理健康洞察和應對策略' : 'Mental health insights and coping strategies')}</li>
          <li>${language.startsWith('zh') ? '日常生活改善技巧' : 'Daily life improvement tips'}</li>
        </ul>
      </div>
      
      <div>
        <div class="subsection-title">${language === 'zh-CN' ? '如何使用这份报告' : (language === 'zh' ? '如何使用這份報告' : 'How to Use This Report')}</div>
        <ul class="bullet-list">
          <li>${language === 'zh-CN' ? '仔细阅读每个部分' : (language === 'zh' ? '仔細閱讀每個部分' : 'Read through each section carefully')}</li>
          <li>${language === 'zh-CN' ? '记录关键见解' : (language === 'zh' ? '記錄關鍵見解' : 'Take notes on key insights')}</li>
          <li>${language === 'zh-CN' ? '制定改进计划' : (language === 'zh' ? '制定改進行動計劃' : 'Create action plans for improvement')}</li>
          <li>${language === 'zh-CN' ? '与值得信赖的朋友分享相关部分' : (language === 'zh' ? '與值得信賴的朋友分享相關部分' : 'Share relevant parts with trusted friends')}</li>
        </ul>
      </div>
    </div>`;
    
    summary += `<p><strong>${language === 'zh-CN' ? '准备好改变您的生活了吗？' : (language === 'zh' ? '準備好改變您的生活了嗎？' : 'Ready to transform your life?')}</strong> ${language === 'zh-CN' ? '让我们深入了解细节，发现您独特的性格如何成为您最大的资产！' : (language === 'zh' ? '讓我們深入了解細節，發現您獨特的性格如何成為您最大的資產！' : 'Let\'s dive into the details and discover how your unique personality can be your greatest asset!')}</p>`;
    
    return summary;
  }

  generateRecommendations(mbtiResult, language = 'en') {
    const { type } = mbtiResult;
    
    const content = this.getLanguageContent(language);
    
    return `<div class="highlight-box force-">
      <div class="highlight-title">${language === 'zh-CN' ? `${type} 的快速行动计划` : (language === 'zh' ? `${type} 的快速行動計劃` : `Quick Action Plan for ${type}`)}</div>
      <p>${language === 'zh-CN' ? '以下是您立即采取的下一步行动，以最大化您的性格优势：' : (language === 'zh' ? '以下是您立即採取的下一步行動，以最大化您的性格優勢：' : 'Here are your immediate next steps to maximize your personality strengths:')}</p>
    </div>

    <div class="two-column">
      <div>
        <div class="subsection-title">${language === 'zh-CN' ? '职业与工作' : (language === 'zh' ? '職業與工作' : 'Career & Work')}</div>
        <ul class="bullet-list">
          <li>${language === 'zh-CN' ? '研究符合您' : (language === 'zh' ? '研究符合您' : 'Research job roles that match your ')}${type} ${language.startsWith('zh') ? '偏好的工作角色' : 'preferences'}</li>
          <li>${language === 'zh-CN' ? '识别与您的价值观一致的公司文化' : (language === 'zh' ? '識別與您的價值觀一致的公司文化' : 'Identify companies with cultures that align with your values')}</li>
          <li>${language === 'zh-CN' ? '发展补充您自然优势的技能' : (language === 'zh' ? '發展補充您自然優勢的技能' : 'Develop skills that complement your natural strengths')}</li>
          <li>${language === 'zh-CN' ? '与具有相似性格特征的专业人士建立人际网络' : (language === 'zh' ? '與具有相似性格特徵的專業人士建立網絡' : 'Network with professionals who share similar personality traits')}</li>
        </ul>
      </div>
      
      <div>
        <div class="subsection-title">❤️ ${language === 'zh-CN' ? '关系与社交' : (language === 'zh' ? '關係與社交' : 'Relationships & Social')}</div>
        <ul class="bullet-list">
          <li>${language === 'zh-CN' ? '寻求与您性格互补的友谊' : (language === 'zh' ? '尋求與您性格互補的友誼' : 'Seek friendships with people who complement your personality')}</li>
          <li>${language === 'zh-CN' ? '练习适用于不同类型人的沟通风格' : (language === 'zh' ? '練習適用於不同類型人的溝通風格' : 'Practice communication styles that work for different types')}</li>
          <li>${language === 'zh-CN' ? '加入与您的兴趣一致的团体或活动' : (language === 'zh' ? '加入與您的興趣一致的團體或活動' : 'Join groups or activities that align with your interests')}</li>
          <li>${language === 'zh-CN' ? '发展情商和同理心技能' : (language === 'zh' ? '發展情商和同理心技能' : 'Develop emotional intelligence and empathy skills')}</li>
        </ul>
      </div>
    </div>

    <div class="two-column">
      <div>
        <div class="subsection-title">${language === 'zh-CN' ? '心理健康与成长' : (language === 'zh' ? '心理健康與成長' : 'Mental Health & Growth')}</div>
        <ul class="bullet-list">
          <li>${language === 'zh-CN' ? '每天练习压力管理技巧' : (language === 'zh' ? '每天練習壓力管理技巧' : 'Practice stress management techniques daily')}</li>
          <li>${language === 'zh-CN' ? '设定与您的性格一致的现实目标' : (language === 'zh' ? '設定與您的性格一致的現實目標' : 'Set realistic goals that align with your personality')}</li>
          <li>${language === 'zh-CN' ? '为挑战发展健康的应对机制' : (language === 'zh' ? '為挑戰發展健康的應對機制' : 'Develop healthy coping mechanisms for challenges')}</li>
          <li>${language === 'zh-CN' ? '如果需要，考虑专业发展或咨询' : (language === 'zh' ? '如果需要，考慮專業發展或諮詢' : 'Consider professional development or counseling if needed')}</li>
        </ul>
      </div>
      
      <div>
        <div class="subsection-title">${language === 'zh-CN' ? '学习与发展' : (language === 'zh' ? '學習與發展' : 'Learning & Development')}</div>
        <ul class="bullet-list">
          <li>${language === 'zh-CN' ? '使用符合您学习风格的学习方法' : (language === 'zh' ? '使用符合您學習風格的學習方法' : 'Use study methods that match your learning style')}</li>
          <li>${language === 'zh-CN' ? '专注于发展您较少主导的功能' : (language === 'zh' ? '專注於發展您較少主導的功能' : 'Focus on developing your less dominant functions')}</li>
          <li>${language === 'zh-CN' ? '从值得信赖的导师或朋友那里寻求反馈' : (language === 'zh' ? '從值得信賴的導師或朋友那裡尋求反饋' : 'Seek feedback from trusted mentors or friends')}</li>
          <li>${language === 'zh-CN' ? '跟踪您的进度并庆祝小胜利' : (language === 'zh' ? '跟蹤您的進度並慶祝小勝利' : 'Track your progress and celebrate small wins')}</li>
        </ul>
      </div>
    </div>

    <div class="highlight-box">
      <div class="highlight-title">${language === 'zh-CN' ? '记住' : (language === 'zh' ? '記住' : 'Remember')}</div>
      <p>${language === 'zh-CN' ? '您的MBTI类型是一个起点，而不是限制。使用这些见解来更好地了解自己，并对您的未来做出明智的决定。最成功的人是那些了解自己的优势并致力于成长领域的人。' : (language === 'zh' ? '您的MBTI類型是一個起點，而不是限制。使用這些見解來更好地了解自己，並對您的未來做出明智的決定。最成功的人是那些了解自己的優勢並致力於成長領域的人。' : 'Your MBTI type is a starting point, not a limitation. Use these insights to understand yourself better and make informed decisions about your future. The most successful people are those who understand their strengths and work on their areas for growth.')}</p>
    </div>`;
  }

  processTextWithLineBreaks(text) {
    if (!text) return '';
    
    // Add line breaks for better readability
    let processedText = text;
    
    // Add line breaks after periods for better readability
    processedText = processedText.replace(/\. /g, '.<br><br>');
    
    // Add line breaks after question marks
    processedText = processedText.replace(/\? /g, '?<br><br>');
    
    // Add line breaks after exclamation marks
    processedText = processedText.replace(/! /g, '!<br><br>');
    
    // Add line breaks after colons
    processedText = processedText.replace(/: /g, ':<br>');
    
    // Add line breaks after semicolons
    processedText = processedText.replace(/; /g, ';<br>');
    
    // Add line breaks for long sentences (more than 100 characters)
    processedText = processedText.replace(/([.!?])\s+(?=[A-Z])/g, '$1<br><br>');
    
    return processedText;
  }

  formatKeyName(key, language = 'en') {
    // Convert camelCase or snake_case to readable titles
    const keyMap = {
      'executiveSummary': 'Executive Summary',
      'detailedPersonalityAnalysis': 'Detailed Personality Analysis',
      'strengthsAndDevelopment': 'Strengths & Development Areas',
      'careerInsights': 'Career Insights',
      'relationshipDynamics': 'Relationship Dynamics',
      'personalGrowthRecommendations': 'Personal Growth Recommendations',
      'latestResearchInsights': 'Latest Research Insights',
      'practicalApplications': 'Practical Applications',
      'careerPath': 'Career Path & Job Recommendations',
      'friendshipCompatibility': 'Friendship Compatibility',
      'romanticCompatibility': 'Romantic Relationship Compatibility',
      'mentalHealthInsights': 'Mental Health & Well-being',
      'selfImprovement': 'Self-Improvement Strategies',
      'dailyLifeApplications': 'Daily Life Applications',
      'recentResearch': 'Recent Research Findings',
      'careerTrends': 'Career Trends & Market Insights',
      'workplaceDynamics': 'Workplace Dynamics',
      'relationshipPsychology': 'Relationship Psychology',
      'personalDevelopment': 'Personal Development',
      'culturalDifferences': 'Cultural Differences',
      'technologyImpact': 'Technology Impact',
      'futureTrends': 'Future Trends & Predictions',
      'coverPage': 'Cover Page',
      'tableOfContents': 'Table of Contents',
      'detailedAnalysis': 'Detailed Analysis',
      'visualElements': 'Visual Elements',
      'actionPlan': 'Action Plan',
      'resources': 'Additional Resources'
    };

    // Traditional Chinese translations
    const keyMapZh = {
      'executiveSummary': '執行摘要',
      'detailedPersonalityAnalysis': '詳細性格分析',
      'strengthsAndDevelopment': '優勢與發展領域',
      'careerInsights': '職業洞察',
      'relationshipDynamics': '人際關係動態',
      'personalGrowthRecommendations': '個人成長建議',
      'latestResearchInsights': '最新研究洞察',
      'practicalApplications': '實際應用',
      'careerPath': '職業路徑與工作建議',
      'friendshipCompatibility': '友誼相容性',
      'romanticCompatibility': '浪漫關係相容性',
      'mentalHealthInsights': '心理健康與福祉',
      'selfImprovement': '自我提升策略',
      'dailyLifeApplications': '日常生活應用',
      'recentResearch': '最新研究發現',
      'careerTrends': '職業趨勢與市場洞察',
      'workplaceDynamics': '職場動態',
      'relationshipPsychology': '關係心理學',
      'personalDevelopment': '個人發展',
      'culturalDifferences': '文化差異',
      'technologyImpact': '科技影響',
      'futureTrends': '未來趨勢與預測',
      'coverPage': '封面頁',
      'detailedAnalysis': '詳細分析',
      'actionPlan': '行動計劃',
    };
    
    const keyMapZhCn = {
      'executiveSummary': '执行摘要',
      'detailedPersonalityAnalysis': '详细性格分析',
      'strengthsAndDevelopment': '优势与发展领域',
      'careerInsights': '职业洞察',
      'relationshipDynamics': '人际关系动态',
      'personalGrowthRecommendations': '个人成长建议',
      'latestResearchInsights': '最新研究洞察',
      'practicalApplications': '实际应用',
      'careerPath': '职业路径与工作建议',
      'friendshipCompatibility': '友谊兼容性',
      'romanticCompatibility': '恋爱关系兼容性',
      'mentalHealthInsights': '心理健康与福祉',
      'selfImprovement': '自我提升策略',
      'dailyLifeApplications': '日常生活应用',
      'recentResearch': '最新研究发现',
      'careerTrends': '职业趋势与市场洞察',
      'workplaceDynamics': '职场动态',
      'relationshipPsychology': '关系心理学',
      'personalDevelopment': '个人发展',
      'culturalDifferences': '文化差异',
      'technologyImpact': '科技影响',
      'futureTrends': '未来趋势与预测',
      'coverPage': '封面页',
      'detailedAnalysis': '详细分析',
      'actionPlan': '行动计划',
    };

    if (language === 'zh-CN' || language === 'zh_cn') {
      return keyMapZhCn[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
    if (language === 'zh') {
      return keyMapZh[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
    
    return keyMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  getLanguageContent(language) {
    const content = {
      en: {
        title: 'MBTI Personality Report',
        typeLabel: 'Type',
        generatedOn: 'Generated on',
        executiveSummary: 'Executive Summary',
        assessmentResults: 'MBTI Assessment Results',
        comprehensiveReport: 'Comprehensive Full Report',
        recommendations: 'Actionable Recommendations'
      },
      zh: {
        title: 'MBTI 性格分析報告',
        typeLabel: '類型',
        generatedOn: '生成時間',
        executiveSummary: '執行摘要',
        assessmentResults: 'MBTI 評估結果',
        comprehensiveReport: '綜合分析報告',
        recommendations: '可操作建議'
      },
      'zh-CN': {
        title: 'MBTI 性格分析报告',
        typeLabel: '类型',
        generatedOn: '生成时间',
        executiveSummary: '执行摘要',
        assessmentResults: 'MBTI 评估结果',
        comprehensiveReport: '综合分析报告',
        recommendations: '行动建议'
      }
    };
    
    return content[language] || content[language === 'zh-CN' ? 'zh-CN' : 'zh'] || content.en;
  }

  // Text generation methods for generateTextReport
  generateExecutiveSummaryText(mbtiResult, language = 'en') {
    const { type, confidence } = mbtiResult;
    
    let summary = language === 'zh' ? 
      `歡迎開始您的個人MBTI之旅！\n` +
      `恭喜！您剛剛解鎖了一個強大的工具來更好地了解自己。這份綜合報告是您個人和職業成功的路線圖。\n\n` :
      `Welcome to Your Personal MBTI Journey!\n` +
      `Congratulations! You've just unlocked a powerful tool for understanding yourself better. This comprehensive report is your roadmap to personal and professional success.\n\n`;
    
    summary += language === 'zh' ? 
      `您的MBTI類型：${type}\n\n` :
      `Your MBTI Type: ${type}\n\n`;
    
    if (confidence) {
      const avgConfidence = Object.values(confidence).reduce((a, b) => a + b, 0) / 4;
      if (avgConfidence > 60) {
        summary += language === 'zh' ?
          `檢測到強烈偏好：您的性格顯示出清晰、明確的特徵。這意味著您對自己是誰以及生活中想要什麼有強烈的感覺。\n\n` :
          `Strong Preferences Detected: Your personality shows clear, well-defined characteristics. This means you have a strong sense of who you are and what you want in life.\n\n`;
      } else if (avgConfidence > 30) {
        summary += language === 'zh' ?
          `平衡偏好：您在性格方面顯示出適度的清晰度，這表明您在不同情況下具有靈活性和適應性。\n\n` :
          `Balanced Preferences: You show moderate clarity in your personality, suggesting flexibility and adaptability across different situations.\n\n`;
      } else {
        summary += language === 'zh' ?
          `適應性強的天性：您的偏好顯示出平衡的特徵，表明您可以輕鬆適應不同的環境和挑戰。\n\n` :
          `Adaptable Nature: Your preferences show balanced characteristics, indicating you can easily adjust to different environments and challenges.\n\n`;
      }
    }
    
    summary += language === 'zh' ?
      `您將發現什麼：\n` +
      `• 適合您性格的完美職業道路\n` +
      `• 理想的朋友和伴侶類型\n` +
      `• 心理健康洞察和應對策略\n` +
      `• 日常生活改善技巧\n\n` +
      `如何使用這份報告：\n` +
      `• 仔細閱讀每個部分\n` +
      `• 記錄關鍵見解\n` +
      `• 制定改進行動計劃\n` +
      `• 與值得信賴的朋友分享相關部分\n\n` :
      `What You'll Discover:\n` +
      `• Perfect career paths for your personality\n` +
      `• Ideal friend and partner types\n` +
      `• Mental health insights and coping strategies\n` +
      `• Daily life improvement tips\n\n` +
      `How to Use This Report:\n` +
      `• Read through each section carefully\n` +
      `• Take notes on key insights\n` +
      `• Create action plans for improvement\n` +
      `• Share relevant parts with trusted friends\n\n`;
    
    summary += language === 'zh' ?
      `準備好改變您的生活了嗎？讓我們深入了解細節，發現您獨特的性格如何成為您最大的資產！\n` :
      `Ready to transform your life? Let's dive into the details and discover how your unique personality can be your greatest asset!\n`;
    
    return summary;
  }

  generateRecommendationsText(mbtiResult, language = 'en') {
    const { type } = mbtiResult;
    
    let recommendations = language === 'zh' ?
      `${type} 的快速行動計劃\n` +
      `以下是您立即採取的下一步行動，以最大化您的性格優勢：\n\n` :
      `Quick Action Plan for ${type}\n` +
      `Here are your immediate next steps to maximize your personality strengths:\n\n`;
    
    recommendations += language === 'zh' ?
      `職業與工作：\n` +
      `• 研究符合您${type}偏好的工作角色\n` +
      `• 識別與您的價值觀一致的公司文化\n` +
      `• 發展補充您自然優勢的技能\n` +
      `• 與具有相似性格特徵的專業人士建立網絡\n\n` +
      `關係與社交：\n` +
      `• 尋求與您性格互補的友誼\n` +
      `• 練習適用於不同類型人的溝通風格\n` +
      `• 加入與您的興趣一致的團體或活動\n` +
      `• 發展情商和同理心技能\n\n` +
      `心理健康與成長：\n` +
      `• 每天練習壓力管理技巧\n` +
      `• 設定與您的性格一致的現實目標\n` +
      `• 為挑戰發展健康的應對機制\n` +
      `• 如果需要，考慮專業發展或諮詢\n\n` +
      `學習與發展：\n` +
      `• 使用符合您學習風格的學習方法\n` +
      `• 專注於發展您較少主導的功能\n` +
      `• 從值得信賴的導師或朋友那裡尋求反饋\n` +
      `• 跟蹤您的進度並慶祝小勝利\n\n` +
      `記住：您的MBTI類型是一個起點，而不是限制。使用這些見解來更好地了解自己，並對您的未來做出明智的決定。最成功的人是那些了解自己的優勢並致力於成長領域的人。\n` :
      `Career & Work:\n` +
      `• Research job roles that match your ${type} preferences\n` +
      `• Identify companies with cultures that align with your values\n` +
      `• Develop skills that complement your natural strengths\n` +
      `• Network with professionals who share similar personality traits\n\n` +
      `Relationships & Social:\n` +
      `• Seek friendships with people who complement your personality\n` +
      `• Practice communication styles that work for different types\n` +
      `• Join groups or activities that align with your interests\n` +
      `• Develop emotional intelligence and empathy skills\n\n` +
      `Mental Health & Growth:\n` +
      `• Practice stress management techniques daily\n` +
      `• Set realistic goals that align with your personality\n` +
      `• Develop healthy coping mechanisms for challenges\n` +
      `• Consider professional development or counseling if needed\n\n` +
      `Learning & Development:\n` +
      `• Use study methods that match your learning style\n` +
      `• Focus on developing your less dominant functions\n` +
      `• Seek feedback from trusted mentors or friends\n` +
      `• Track your progress and celebrate small wins\n\n` +
      `Remember: Your MBTI type is a starting point, not a limitation. Use these insights to understand yourself better and make informed decisions about your future. The most successful people are those who understand their strengths and work on their areas for growth.\n`;
    
    return recommendations;
  }

  extractContentText(content, language = 'en') {
    if (!content) return '';
    
    // If content is an object, try to extract text
    if (typeof content === 'object') {
      // If it's an object with text fields, iterate through all keys and join content
      if (Object.keys(content).length > 0) {
        const textParts = [];
        for (const key in content) {
          if (content[key] && typeof content[key] === 'string') {
            const keyName = this.formatKeyName(key, language);
            textParts.push(`${keyName}:\n${content[key]}\n`);
          }
        }
        if (textParts.length > 0) {
          return textParts.join('\n');
        }
      }
      
      // Fallback for other object types
      if (content.text) return content.text;
      if (content.content) return content.content;
      return JSON.stringify(content);
    }
    
    // If content is a string, return as is
    if (typeof content === 'string') {
      return content;
    }
    
    return String(content);
  }

  // Helper method to extract scores from MBTI result
  // This method is no longer needed as scores are directly available in mbtiResult
  // extractScoresFromMBTIResult(mbtiResult) { ... }

  // Keep the old method for backward compatibility
  async generateReport(mbtiResult, analysis, detailedReport) {
    return this.generateHTMLFromAnalysis(mbtiResult, analysis);
  }

  generateComprehensiveReportSections(fullReport, language) {
    if (!fullReport || typeof fullReport !== 'object') {
      return '';
    }

    let sections = '';
    
    // Generate individual section for each key in the full report
    for (const key in fullReport) {
      const currentDate = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
      fullReport[key] = fullReport[key].replace(/\[當前日期\]/g, currentDate); // Alternative Chinese format
      fullReport[key] = fullReport[key].replace(/\[Current Date\]/g, currentDate); // Alternative Chinese format
      if (fullReport[key] && typeof fullReport[key] === 'string') {
        sections += `
    <div class="section force-page-break">
        <div class="section-title">${this.formatKeyName(key, language)}</div>
        <div class="content">
            ${this.processTextWithLineBreaks(fullReport[key])}
        </div>
    </div>`;
      }
    }
    
    return sections;
  }
}

module.exports = HTMLReportGenerator; 
