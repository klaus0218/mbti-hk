// Utility functions for formatting AI analysis content
import React from 'react';

// Format markdown-style text with proper styling
export const formatMarkdownText = (text, language = 'en') => {
  if (!text) return '';
  
  // Split by double newlines to preserve paragraph breaks
  const paragraphs = text.split(/\n\n+/);
  
  return paragraphs.map((paragraph, index) => {
    if (!paragraph.trim()) return null;
    
    // Handle headers (## or **text**)
    if (paragraph.startsWith('##') || paragraph.startsWith('**') && paragraph.endsWith('**')) {
      return (
        <h3 key={index} style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#4a5568',
          margin: '1rem 0 0.5rem 0',
          borderBottom: '2px solid #718096',
          paddingBottom: '0.5rem'
        }}>
          {paragraph.replace(/^##\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
        </h3>
      );
    }
    
    // Handle subheaders (### or **text**)
    if (paragraph.startsWith('###') || (paragraph.includes('**') && paragraph.length < 100)) {
      return (
        <h4 key={index} style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#4a5568',
          margin: '0.8rem 0 0.4rem 0',
          borderLeft: '4px solid #718096',
          paddingLeft: '1rem'
        }}>
          {paragraph.replace(/^###\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
        </h4>
      );
    }
    
    // Handle bullet points
    if (paragraph.includes('•') || paragraph.includes('-')) {
      const items = paragraph.split(/(?:•|-)\s*/).filter(item => item.trim());
      return (
        <ul key={index} style={{
          margin: '0.5rem 0',
          paddingLeft: '1.5rem'
        }}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex} style={{
              margin: '0.3rem 0',
              color: '#4a5568',
              lineHeight: '1.6'
            }}>
              {item.trim()}
            </li>
          ))}
        </ul>
      );
    }
    
    // Handle numbered lists
    if (paragraph.match(/^\d+\./)) {
      const items = paragraph.split(/\d+\.\s*/).filter(item => item.trim());
      return (
        <ol key={index} style={{
          margin: '0.5rem 0',
          paddingLeft: '1.5rem'
        }}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex} style={{
              margin: '0.3rem 0',
              color: '#4a5568',
              lineHeight: '1.6'
            }}>
              {item.trim()}
            </li>
          ))}
        </ol>
      );
    }
    
    // Handle bold text within paragraphs
    const formattedText = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return (
      <p key={index} style={{
        margin: '0.8rem 0',
        color: '#4a5568',
        lineHeight: '1.8',
        fontSize: '1rem',
        textAlign: language === 'zh' ? 'left' : 'left'
      }}
      dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    );
  });
};

// Format the preview content with simplified styling
export const formatPreviewContent = (previewData, language = 'en') => {
  console.log(language)
  if (!previewData) return null;
  
  // Handle both structured and unstructured data
  if (typeof previewData === 'string') {
    return formatMarkdownText(previewData, language);
  }
  
  const data = previewData[language] || previewData;
  
  if (!data) return null;
  
  return (
    <div style={{ padding: '1rem' }}>
      {/* Title */}
      {data.title && (
        <div style={{
          background: '#f7fafc',
          borderRadius: '8px',
          padding: '1.5rem',
          margin: '1rem 0',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            margin: '0 0 1rem 0',
            color: '#4a5568',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {data.title}
          </h2>
        </div>
      )}
      
      {/* Summary */}
      {data.summary && (
        <div style={{
          background: '#f7fafc',
          borderRadius: '8px',
          padding: '1.5rem',
          margin: '1rem 0',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{
            margin: 0,
            fontSize: '1.1rem',
            color: '#4a5568',
            lineHeight: '1.6',
            fontStyle: 'italic'
          }}>
            {data.summary}
          </p>
        </div>
      )}
      
      {/* Key Insights */}
      {data.keyInsights && formatKeyInsights(data.keyInsights, language)}
      
      {/* Research Highlights */}
      {data.researchHighlights && (
        <div style={{
          background: '#f7fafc',
          borderRadius: '8px',
          padding: '1.5rem',
          margin: '1rem 0',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            margin: '0 0 1rem 0',
            color: '#4a5568',
            fontSize: '1.2rem',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            {language === 'zh' ? '🔬 研究亮點' : '🔬 Research Highlights'}
          </h4>
          <div style={{ lineHeight: '1.6', color: '#4a5568' }}>
            {formatMarkdownText(data.researchHighlights, language)}
          </div>
        </div>
      )}
      
      {/* Core Analysis Preview */}
      {data.coreAnalysisPreview && (
        <div style={{
          background: '#f7fafc',
          borderRadius: '8px',
          padding: '1.5rem',
          margin: '1rem 0',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            margin: '0 0 1rem 0',
            color: '#4a5568',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            {language === 'zh' ? '📋 核心分析預覽' : '📋 Core Analysis Preview'}
          </h4>
          <div style={{ color: '#4a5568', lineHeight: '1.6' }}>
            {formatMarkdownText(data.coreAnalysisPreview, language)}
          </div>
        </div>
      )}
      
    </div>
  );
};

// Format the full report content with simplified styling
export const formatFullReportContent = (reportData, language = 'en') => {
  if (!reportData) return null;
  
  // Handle both structured and unstructured data
  if (typeof reportData === 'string') {
    return formatMarkdownText(reportData, language);
  }
  
  // Handle structured data
  const lang = language === 'zh' ? 'zh' : 'en';
  const data = reportData[lang] || reportData;
  
  if (!data) return null;
  
  return (
    <div style={{ padding: '1rem' }}>
      {/* Cover Page */}
      {data.coverPage && (
        <div style={{
          background: '#f7fafc',
          borderRadius: '12px',
          padding: '3rem 2rem',
          margin: '1rem 0',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          {formatMarkdownText(data.coverPage, language)}
        </div>
      )}
      
      {/* Executive Summary */}
      {data.executiveSummary && (
        <div style={{
          background: '#f7fafc',
          borderRadius: '8px',
          padding: '1.5rem',
          margin: '1rem 0',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#4a5568',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            {language === 'zh' ? '📊 執行摘要' : '📊 Executive Summary'}
          </h3>
          {formatMarkdownText(data.executiveSummary, language)}
        </div>
      )}
      
      {/* Detailed Analysis */}
      {data.detailedAnalysis && (
        <div style={{
          background: '#f7fafc',
          borderRadius: '8px',
          padding: '1.5rem',
          margin: '1rem 0',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#4a5568',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            {language === 'zh' ? '🔍 詳細分析' : '🔍 Detailed Analysis'}
          </h3>
          {formatMarkdownText(data.detailedAnalysis, language)}
        </div>
      )}
      
      {/* Latest Research Insights */}
      {data.latestResearchInsights && (
        <div style={{
          background: '#f7fafc',
          borderRadius: '8px',
          padding: '1.5rem',
          margin: '1rem 0',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#4a5568',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            {language === 'zh' ? '🔬 最新研究洞察' : '🔬 Latest Research Insights'}
          </h3>
          {formatMarkdownText(data.latestResearchInsights, language)}
        </div>
      )}
      
      {/* Visual Elements */}
      {data.visualElements && (
        <div style={{
          background: '#f7fafc',
          borderRadius: '8px',
          padding: '1.5rem',
          margin: '1rem 0',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#4a5568',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            {language === 'zh' ? '📊 視覺元素' : '📊 Visual Elements'}
          </h3>
          {formatMarkdownText(data.visualElements, language)}
        </div>
      )}
      
      {/* Action Plan */}
      {data.actionPlan && (
        <div style={{
          background: '#f7fafc',
          borderRadius: '8px',
          padding: '1.5rem',
          margin: '1rem 0',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#4a5568',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            {language === 'zh' ? '📋 行動計劃' : '📋 Action Plan'}
          </h3>
          {formatMarkdownText(data.actionPlan, language)}
        </div>
      )}
      
      {/* Resources */}
      {data.resources && (
        <div style={{
          background: '#f7fafc',
          borderRadius: '8px',
          padding: '1.5rem',
          margin: '1rem 0',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#4a5568',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            {language === 'zh' ? '📚 資源' : '📚 Resources'}
          </h3>
          {formatMarkdownText(data.resources, language)}
        </div>
      )}
    </div>
  );
};

// Helper function to format key insights
const formatKeyInsights = (insights, language) => {
  if (!insights || !Array.isArray(insights)) return null;
  
  return (
    <div style={{
      background: '#f7fafc',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '1rem 0',
      border: '1px solid #e2e8f0'
    }}>
      <h4 style={{
        margin: '0 0 1rem 0',
        color: '#4a5568',
        fontSize: '1.2rem',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        {language === 'zh' ? '💡 關鍵洞察' : '💡 Key Insights'}
      </h4>
      <ul style={{
        margin: '0.5rem 0',
        paddingLeft: '1.5rem'
      }}>
        {insights.map((insight, index) => (
          <li key={index} style={{
            margin: '0.3rem 0',
            color: '#4a5568',
            lineHeight: '1.6'
          }}>
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
};
