import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Paper,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { createAnalysisPackage, downloadReport, getAnalysisFromDatabase } from '../../services/enhancedAIAnalysisService';
import { formatAnalysisForLanguage, getLanguageLabel } from '../../utils/languageUtils';
import { formatPreviewContent, formatFullReportContent } from '../../utils/contentFormatter';

const AIAnalysis = ({ mbtiResult, onAnalysisComplete }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [reportStatus, setReportStatus] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [analysisEmail, setAnalysisEmail] = useState('');

  console.log(language)
  useEffect(() => {
    if (mbtiResult) {
      setError(null);
      setAnalysis(null);
      setReportStatus(null);
      
      // Initialize analysisEmail from existing result
      if (mbtiResult.demographics?.email) {
        setAnalysisEmail(mbtiResult.demographics.email);
      }
      
      // Check for existing analysis
      checkExistingAnalysis();
    }
  }, [mbtiResult]);

  const handleGenerateAnalysis = async () => {
    if (!mbtiResult) {
      setError('No MBTI results available');
      return;
    }

    // Check if user has email in the result
    const userEmail = mbtiResult.demographics?.email || analysisEmail;
    if (!userEmail || !userEmail.trim()) {
      setShowEmailModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Get sessionId from localStorage or generate one
      let sessionId = localStorage.getItem('mbti_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}`;
        localStorage.setItem('mbti_session_id', sessionId);
      }

      // Use the existing email from the result or the updated email
      const resultWithEmail = {
        ...mbtiResult,
        demographics: {
          ...mbtiResult.demographics,
          email: userEmail.trim()
        }
      };

      const result = await createAnalysisPackage(resultWithEmail, sessionId, null);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setAnalysis(result);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }

      setTimeout(() => setProgress(0), 1000);

    } catch (err) {
      setError(err.message || 'Failed to generate analysis');
    } finally {
      setLoading(false);
    }
  };

  // Function to check for existing analysis
  const checkExistingAnalysis = async () => {
    if (!mbtiResult) return;
    
    try {
      const sessionId = localStorage.getItem('mbti_session_id');
      if (!sessionId) return;
      
      console.log('🔍 Checking for existing analysis...');
      const existingAnalysis = await getAnalysisFromDatabase(sessionId, mbtiResult.type);
      
      if (existingAnalysis) {
        console.log('✅ Found existing analysis, auto-loading...');
        setAnalysis(existingAnalysis);
        if (onAnalysisComplete) {
          onAnalysisComplete(existingAnalysis);
        }
      } else {
        console.log('❌ No existing analysis found');
      }
    } catch (error) {
      console.error('Error checking for existing analysis:', error);
    }
  };

  const handleGenerateReport = async () => {
    if (!mbtiResult) {
      setError('No MBTI results available');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 85));
      }, 300);

      const result = await createAnalysisPackage(mbtiResult);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setReportStatus(result);
      
      setTimeout(() => setProgress(0), 1000);

    } catch (err) {
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!reportStatus?.downloadUrl) {
      setError('No report available for download');
      return;
    }

    try {
      await downloadReport(reportStatus.downloadUrl, reportStatus.filename);
    } catch (err) {
      setError('Failed to download report');
    }
  };

  const formatMBTIScores = (scores) => {
    return Object.entries(scores).map(([dimension, score]) => (
      <Chip
        key={dimension}
        label={`${dimension}: ${score}%`}
        color={score > 50 ? 'primary' : 'default'}
        variant="outlined"
        size="small"
        sx={{ m: 0.5 }}
      />
    ));
  };

  if (!mbtiResult) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="text.secondary" align="center">
            Complete the MBTI test to get AI analysis
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <PsychologyIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h2">
              {language === 'zh-CN' ? 'AI 驱动的 MBTI 分析' : (language === 'zh' ? 'AI 驅動的 MBTI 分析' : 'AI-Powered MBTI Analysis')}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            {language === 'zh-CN'
              ? '使用先进的 AI 分析，基于您的 MBTI 测试结果获得个性化见解和详细报告。'
              : (language === 'zh' 
                  ? '使用先進的 AI 分析，基於您的 MBTI 測試結果獲得個性化見解和詳細報告。'
                  : 'Get personalized insights and detailed reports based on your MBTI results using advanced AI analysis.')
            }
          </Typography>
        </CardContent>
      </Card>

      {/* MBTI Results Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {language === 'zh-CN' ? '您的 MBTI 结果：' : (language === 'zh' ? '您的 MBTI 結果：' : 'Your MBTI Results: ')}{mbtiResult.type}
          </Typography>
          <Box sx={{ mb: 2 }}>
            {formatMBTIScores(mbtiResult.scores)}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {mbtiResult.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {progress < 50 
              ? (language === 'zh-CN' ? '分析您的人格...' : (language === 'zh' ? '分析您的人格...' : 'Analyzing your personality...'))
              : progress < 80 
                ? (language === 'zh-CN' ? '生成见解...' : (language === 'zh' ? '生成見解...' : 'Generating insights...'))
                : (language === 'zh-CN' ? '完成中...' : (language === 'zh' ? '完成中...' : 'Finalizing...'))
            }
          </Typography>
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            size="medium"
            onClick={handleGenerateAnalysis}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <PsychologyIcon />}
            sx={{ py: 1, px: 2, fontSize: '0.875rem' }}
          >
            {loading ? (language.startsWith('zh') ? '分析中...' : 'Analyzing...') : (language === 'zh-CN' ? '生成 AI 分析' : (language === 'zh' ? '生成 AI 分析' : 'Generate AI Analysis'))}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            size="medium"
            onClick={handleGenerateReport}
            disabled={loading || !analysis}
            startIcon={loading ? <CircularProgress size={16} /> : <DescriptionIcon />}
            sx={{ py: 1, px: 2, fontSize: '0.875rem' }}
          >
            {loading ? (language.startsWith('zh') ? '生成中...' : 'Generating...') : (language === 'zh-CN' ? '生成 PDF 报告' : (language === 'zh' ? '生成 PDF 報告' : 'Generate PDF Report'))}
          </Button>
        </Grid>
      </Grid>

      {/* AI Analysis Results */}
      {analysis && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              {language === 'zh-CN' ? 'AI 分析结果' : (language === 'zh' ? 'AI 分析結果' : 'AI Analysis Results')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ 
              backgroundColor: '#f8f9fa', 
              p: 2, 
              borderRadius: 1,
              border: '1px solid #e9ecef'
            }}>
              {analysis.preview 
                ? formatPreviewContent(analysis.preview, language)
                : formatFullReportContent(analysis.analysis, language)
              }
            </Box>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {language === 'zh-CN' ? '生成时间：' : (language === 'zh' ? '生成時間：' : 'Generated on: ')}
                {new Date(analysis.timestamp).toLocaleString()}
              </Typography>
              <Chip 
                label={`${language.startsWith('zh') ? '模型：' : 'Model: '}${analysis.model || 'gemini-2.5-flash'}`} 
                size="small" 
                variant="outlined"
                color="primary"
              />
              <Chip 
                label={getLanguageLabel(language)} 
                size="small" 
                variant="outlined"
                color="secondary"
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Report Status */}
      {reportStatus && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {language === 'zh-CN' ? 'PDF 报告已生成' : (language === 'zh' ? 'PDF 報告已生成' : 'PDF Report Generated')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {language === 'zh-CN' ? '文件名：' : (language === 'zh' ? '檔案名：' : 'Filename: ')}{reportStatus.filename}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'zh-CN' ? '大小：' : (language === 'zh' ? '大小：' : 'Size: ')}{(reportStatus.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadReport}
                color="success"
              >
                {language === 'zh-CN' ? '下载报告' : (language === 'zh' ? '下載報告' : 'Download Report')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Information */}
      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary">
          <strong>{language.startsWith('zh') ? '注意：' : 'Note:'}</strong> {language === 'zh-CN'
            ? 'AI 分析基于全面的 MBTI 研究和您的具体测试结果。报告会在 24 小时后自动清理，以确保安全性和存储效率。'
            : (language === 'zh' 
                ? 'AI 分析基於全面的 MBTI 研究和您的具體測試結果。報告會在 24 小時後自動清理，以確保安全性和存儲效率。'
                : 'The AI analysis is based on comprehensive MBTI research and your specific test results. Reports are automatically cleaned up after 24 hours for security and storage efficiency.')
          }
        </Typography>
      </Paper>

      {/* Email Collection Modal */}
      {showEmailModal && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Paper sx={{
            p: 3,
            maxWidth: 400,
            width: '90%',
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              {language === 'zh-CN' ? '电子邮件确认' : (language === 'zh' ? '電子郵件確認' : 'Email Confirmation')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              {language === 'zh-CN'
                ? '请确认或更新您的电子邮件地址，AI分析报告将发送到此邮箱。'
                : (language === 'zh' 
                    ? '請確認或更新您的電子郵件地址，AI分析報告將發送到此郵箱。'
                    : 'Please confirm or update your email address. The AI analysis report will be sent to this email.')
              }
            </Typography>
            <Box sx={{ mb: 2 }}>
              <input
                type="email"
                placeholder={language.startsWith('zh') ? '输入您的电子邮件' : 'Enter your email'}
                value={analysisEmail}
                onChange={(e) => setAnalysisEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowEmailModal(false);
                  setAnalysisEmail('');
                }}
              >
                {language.startsWith('zh') ? '取消' : 'Cancel'}
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  if (analysisEmail.trim()) {
                    setShowEmailModal(false);
                    handleGenerateAnalysis();
                  }
                }}
              >
                {language === 'zh-CN' ? '生成分析' : (language === 'zh' ? '生成分析' : 'Generate Analysis')}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
                    handleGenerateAnalysis();
                  }
                }}
                disabled={!analysisEmail.trim()}
              >
                {language === 'zh' ? '生成分析' : 'Generate Analysis'}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default AIAnalysis; 
