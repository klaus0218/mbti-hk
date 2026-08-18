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
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Download as DownloadIcon,
  Payment as PaymentIcon,
  Preview as PreviewIcon,
  Lock as LockIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  Favorite as FavoriteIcon,
  School as SchoolIcon,
  PictureAsPdf as PictureAsPdfIcon
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import mbtiPreviewContent from '../../data/mbtiPreviewContent';
import { 
  createAnalysisPackage, 
  unlockPremiumContent
} from '../../services/enhancedAIAnalysisService';
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain, faCrown, faRedo, faShare, faLock, faUnlock, faDownload, faLightbulb, faBriefcase, faHeartPulse, faChartLine, faSearch } from '@fortawesome/free-solid-svg-icons';

const EnhancedAIAnalysis = ({ mbtiResult, onAnalysisComplete }) => {
  const { language } = useLanguage();
  
  // Configuration: Enable/disable premium mode
  // Set via environment variable or change this constant
  // If false, premium features (unlock, payment, download) will be hidden
  // Default is false - set to true to enable premium features
  const ENABLE_PREMIUM_MODE = process.env.REACT_APP_ENABLE_PREMIUM_MODE === 'true';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    email: '',
    name: ''
  });

  // Only show unlock step if premium mode is enabled
  const steps = ENABLE_PREMIUM_MODE
    ? ['View Preview', 'Unlock Premium', 'Complete Report']
    : ['View Preview'];

  const getActiveStep = () => {
    // If premium mode is disabled, just show preview step
    if (!ENABLE_PREMIUM_MODE) {
      return 0;
    }
    // Check if premium is unlocked from mbtiResult data
    if (mbtiResult?.premium || mbtiResult?.isPremiumUnlocked) {
      return 2; // Show as completed
    }
    return currentStep;
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  useEffect(() => {
    if (mbtiResult) {
      setError(null);
      setCurrentStep(0);
      
      if (!ENABLE_PREMIUM_MODE) {
        // If premium mode is disabled, just show preview
        setTimeout(() => {
          setCurrentStep(1);
        }, 1000);
        return;
      }
      
      // Check if premium is already unlocked
      if (mbtiResult.premium || mbtiResult.isPremiumUnlocked) {
        setCurrentStep(2);
      } else {
        // Automatically show preview since it's pre-generated
        setTimeout(() => {
          setCurrentStep(1);
        }, 1000);
      }
    }
  }, [mbtiResult, ENABLE_PREMIUM_MODE]);

  const handlePayment = () => {
    if (!ENABLE_PREMIUM_MODE) return;
    setShowPaymentDialog(true);
  };

  const handlePaymentSubmit = async () => {
    if (!ENABLE_PREMIUM_MODE) return;
    setLoading(true);
    try {
      // Here you would integrate with your payment gateway
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Unlock premium content
      const sessionId = localStorage.getItem('mbti_session_id');
      if (sessionId && mbtiResult) {
        console.log('🔓 Unlocking premium content...');
        const unlocked = await unlockPremiumContent(sessionId, mbtiResult.type);
        
        if (unlocked) {
          console.log('✅ Premium content unlocked, moving to final step...');
          setCurrentStep(3);
          
          // Update the mbtiResult with premium status
          if (onAnalysisComplete) {
            onAnalysisComplete({ ...mbtiResult, premium: true });
          }
        } else {
          throw new Error('Failed to unlock premium content');
        }
      } else {
        throw new Error('Session or MBTI result not available');
      }
      
      setShowPaymentDialog(false);
      
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!ENABLE_PREMIUM_MODE) return;
    if (!mbtiResult?.premium && !mbtiResult?.isPremiumUnlocked) {
      setError('Premium content not unlocked');
      return;
    }

    try {
      setLoading(true);
      // Here you would generate and download the actual PDF
      // For now, we'll simulate the download
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a downloadable text file as placeholder
      const reportContent = `MBTI Complete Report for ${mbtiResult.type}\n\nThis is your complete AI analysis report.`;
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MBTI_Complete_Report_${mbtiResult.type}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      setError('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  const formatMBTIScores = (scores) => {
    if (!scores) return null;
    
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

  // Check if premium is unlocked
  const isPremiumUnlocked = mbtiResult.premium || mbtiResult.isPremiumUnlocked;

  // Add new styled components for better preview display
  const PreviewSection = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    
    &:last-child {
      margin-bottom: 0;
    }
  `;

  const PreviewSectionTitle = styled.h4`
    color: #667eea;
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    font-size: ${({ theme }) => theme.typography.lg};
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
  `;

  const PreviewSectionContent = styled.div`
    color: ${({ theme }) => theme.colors.gray700};
    line-height: 1.6;
    font-size: ${({ theme }) => theme.typography.base};
  `;

  const PreviewInsightsList = styled.ul`
    margin: ${({ theme }) => theme.spacing.sm} 0;
    padding-left: ${({ theme }) => theme.spacing.lg};
    
    li {
      margin-bottom: ${({ theme }) => theme.spacing.xs};
      color: ${({ theme }) => theme.colors.gray700};
      line-height: 1.5;
    }
  `;

  const PreviewCallToAction = styled.div`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin-top: ${({ theme }) => theme.spacing.lg};
    text-align: center;
    
    p {
      margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
      font-size: ${({ theme }) => theme.typography.lg};
      font-weight: 500;
    }
  `;

  const FullReportSection = styled.div`
    background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
    border: 2px solid #667eea;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.lg};
    margin-top: ${({ theme }) => theme.spacing.lg};
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    h4 {
      color: #667eea;
      margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
      font-size: ${({ theme }) => theme.typography.lg};
      font-weight: 600;
    }
    
    p {
      color: ${({ theme }) => theme.colors.gray700};
      margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
      line-height: 1.6;
      text-align: center;
    }
  `;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <PsychologyIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              {ENABLE_PREMIUM_MODE 
                ? (language === 'zh-CN' ? '高级 MBTI 分析' : (language === 'zh' ? '高級 MBTI 分析' : 'Premium MBTI Analysis'))
                : (language === 'zh-CN' ? 'MBTI 分析' : (language === 'zh' ? 'MBTI 分析' : 'MBTI Analysis'))
              }
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            {ENABLE_PREMIUM_MODE
              ? (language === 'zh-CN'
                  ? '获得全面的 AI 驱动人格分析，包含最新研究见解和专业报告。'
                  : (language === 'zh' 
                      ? '獲得全面的 AI 驅動人格分析，包含最新研究見解和專業報告。'
                      : 'Get comprehensive, AI-powered personality analysis with latest research insights and professional reports.'))
              : (language === 'zh-CN'
                  ? '获得全面的 AI 驱动人格分析，包含深入见解和专业建议。'
                  : (language === 'zh'
                      ? '獲得全面的 AI 驅動人格分析，包含深入見解和專業建議。'
                      : 'Get comprehensive, AI-powered personality analysis with deep insights and professional recommendations.'))
            }
          </Typography>
        </CardContent>
      </Card>

      {/* Stepper - only show if premium mode is enabled */}
      {ENABLE_PREMIUM_MODE && (
        <Paper sx={{ mb: 3, p: 2 }}>
          <Stepper activeStep={getActiveStep()} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel onClick={() => handleStepClick(index)}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      {/* MBTI Results Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your MBTI Results: {mbtiResult.type}
          </Typography>
          <Box sx={{ mb: 2 }}>
            {formatMBTIScores(mbtiResult.scores)}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {mbtiResult.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Step Content */}
      {currentStep === 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {language === 'zh-CN' ? '步骤 1：查看分析预览' : (language === 'zh' ? '步驟 1：查看分析預覽' : 'Step 1: View Analysis Preview')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {language === 'zh-CN' ? '您的 MBTI 类型分析预览已准备就绪：' : (language === 'zh' ? '您的 MBTI 類型分析預覽已準備就緒：' : 'Your MBTI type analysis preview is ready:')}
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PsychologyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={language === 'zh-CN' ? '个性特征分析' : (language === 'zh' ? '個性特徵分析' : 'Personality Trait Analysis')}
                  secondary={language === 'zh-CN' ? '基于您的 MBTI 类型的深入洞察' : (language === 'zh' ? '基於您的 MBTI 類型的深入洞察' : 'Deep insights based on your specific type')}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrendingIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={language === 'zh-CN' ? '职业发展建议' : (language === 'zh' ? '職業發展建議' : 'Career Development Advice')}
                  secondary={language === 'zh-CN' ? '针对您特定类型的职业指导' : (language === 'zh' ? '針對您特定類型的職業指導' : 'Career guidance tailored to your specific type')}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WorkIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={language === 'zh-CN' ? '人际关系动态' : (language === 'zh' ? '人際關係動態' : 'Relationship Dynamics')}
                  secondary={language === 'zh-CN' ? '友谊和恋爱关系的兼容性分析' : (language === 'zh' ? '友誼和戀愛關係的相容性分析' : 'Compatibility analysis for friendships and romantic relationships')}
                />
              </ListItem>
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setCurrentStep(1)}
                sx={{ 
                  py: 2, 
                  px: 6, 
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  minHeight: '64px',
                  minWidth: '320px',
                  borderRadius: 3,
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)'
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)'
                }}
              >
                <PreviewIcon sx={{ mr: 2, fontSize: '1.5rem' }} />
                {language === 'zh-CN' ? '查看分析预览' : (language === 'zh' ? '查看分析預覽' : 'View Analysis Preview')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Preview Results */}
      {currentStep >= 1 && mbtiResult && mbtiPreviewContent[mbtiResult.type] && (() => {
        const previewData = mbtiPreviewContent[mbtiResult.type][language] ||
          (language === 'zh-CN' ? mbtiPreviewContent[mbtiResult.type]['zh-CN'] : (language === 'zh' ? mbtiPreviewContent[mbtiResult.type].zh : mbtiPreviewContent[mbtiResult.type].en)) ||
          mbtiPreviewContent[mbtiResult.type].en;
        if (!previewData) return null;

        return (
          <div>
            <Typography variant="h5" gutterBottom style={{ color: '#667eea', textAlign: 'center', marginBottom: '2rem' }}>
              <FontAwesomeIcon icon={faBrain} style={{ marginRight: '0.5rem' }} />
              {language === 'zh-CN' ? 'AI 分析预览' : (language === 'zh' ? 'AI 分析預覽' : 'AI Analysis Preview')}
            </Typography>
            
            {/* Complete preview content */}
            <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
              <PreviewSection>
                <PreviewSectionTitle>
                  <FontAwesomeIcon icon={faCrown} />
                  {previewData.title}
                </PreviewSectionTitle>
                <PreviewSectionContent>
                  {previewData.summary}
                </PreviewSectionContent>
              </PreviewSection>

              <PreviewSection>
                <PreviewSectionTitle>
                  <FontAwesomeIcon icon={faLightbulb} />
                  {language === 'zh-CN' ? '核心洞察' : (language === 'zh' ? '核心洞察' : 'Key Insights')}
                </PreviewSectionTitle>
                <PreviewInsightsList>
                  {(previewData.keyInsights || []).map((insight, index) => (
                    <li key={index}>
                      {insight}
                    </li>
                  ))}
                </PreviewInsightsList>
              </PreviewSection>

              <PreviewSection>
                <PreviewSectionTitle>
                  <FontAwesomeIcon icon={faBriefcase} />
                  {language === 'zh-CN' ? '职业发展' : (language === 'zh' ? '職業發展' : 'Career Development')}
                </PreviewSectionTitle>
                <PreviewSectionContent>
                  {previewData.careerPath}
                </PreviewSectionContent>
              </PreviewSection>

              <PreviewSection>
                <PreviewSectionTitle>
                  <FontAwesomeIcon icon={faShare} />
                  {language === 'zh-CN' ? '人际关系' : (language === 'zh' ? '人際關係' : 'Relationships')}
                </PreviewSectionTitle>
                <PreviewSectionContent>
                  <strong>{language === 'zh-CN' ? '友谊兼容性：' : (language === 'zh' ? '友誼相容性：' : 'Friendship Compatibility: ')}</strong>
                  {previewData.friendshipCompatibility}
                </PreviewSectionContent>
                <PreviewSectionContent style={{ marginTop: '1rem' }}>
                  <strong>{language === 'zh-CN' ? '恋爱兼容性：' : (language === 'zh' ? '戀愛相容性：' : 'Romantic Compatibility: ')}</strong>
                  {previewData.romanticCompatibility}
                </PreviewSectionContent>
              </PreviewSection>

              <PreviewSection>
                <PreviewSectionTitle>
                  <FontAwesomeIcon icon={faHeartPulse} />
                  {language === 'zh-CN' ? '心理健康洞察' : (language === 'zh' ? '心理健康洞察' : 'Mental Health Insights')}
                </PreviewSectionTitle>
                <PreviewSectionContent>
                  {previewData.mentalHealthInsights}
                </PreviewSectionContent>
              </PreviewSection>

              <PreviewSection>
                <PreviewSectionTitle>
                  <FontAwesomeIcon icon={faChartLine} />
                  {language === 'zh-CN' ? '自我提升' : (language === 'zh' ? '自我提升' : 'Self Improvement')}
                </PreviewSectionTitle>
                <PreviewSectionContent>
                  {previewData.selfImprovement}
                </PreviewSectionContent>
              </PreviewSection>

              <PreviewSection>
                <PreviewSectionTitle>
                  <FontAwesomeIcon icon={faSearch} />
                  {language === 'zh-CN' ? '深度分析' : (language === 'zh' ? '深度分析' : 'Deep Analysis')}
                </PreviewSectionTitle>
                <PreviewSectionContent>
                  {previewData.coreAnalysisPreview}
                </PreviewSectionContent>
              </PreviewSection>

              {/* Only show call to action if premium mode is enabled */}
              {ENABLE_PREMIUM_MODE && (
                <PreviewCallToAction>
                  <p>
                    {previewData.callToAction}
                  </p>
                </PreviewCallToAction>
              )}
            </div>

            {/* Show different actions based on premium status - only if premium mode is enabled */}
            {ENABLE_PREMIUM_MODE && (
              <>
                {!isPremiumUnlocked ? (
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => setCurrentStep(2)}
                      style={{
                        background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                        color: '#8b4513',
                        fontWeight: 'bold',
                        padding: '12px 24px',
                        fontSize: '1.1rem'
                      }}
                    >
                      <FontAwesomeIcon icon={faLock} style={{ marginRight: '0.5rem' }} />
                      {language === 'zh-CN' ? '解锁完整报告' : (language === 'zh' ? '解鎖完整報告' : 'Unlock Full Report')}
                    </Button>
                  </div>
                ) : (
                  <FullReportSection>
                    <h4>
                      <FontAwesomeIcon icon={faUnlock} />
                      {language === 'zh-CN' ? '高级内容已解锁！' : (language === 'zh' ? '高級內容已解鎖！' : 'Premium Content Unlocked!')}
                    </h4>
                    <p>
                      {language === 'zh-CN'
                        ? '恭喜！您现在可以下载完整的AI分析报告，包含更深入的见解、个性化建议和行动计划。'
                        : (language === 'zh' 
                            ? '恭喜！您現在可以下載完整的AI分析報告，包含更深入的見解、個性化建議和行動計劃。'
                            : 'Congratulations! You now have access to the complete AI analysis report with deeper insights, personalized recommendations, and action plans.')
                      }
                    </p>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={handleDownloadReport}
                      style={{
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '12px 24px',
                        fontSize: '1.1rem'
                      }}
                    >
                      <FontAwesomeIcon icon={faDownload} style={{ marginRight: '0.5rem' }} />
                      {language === 'zh-CN' ? '下载完整报告' : (language === 'zh' ? '下載完整報告' : 'Download Full Report')}
                    </Button>
                  </FullReportSection>
                )}
              </>
            )}
          </div>
        );
      })()}

      {/* Payment Section - only show if premium mode is enabled */}
      {ENABLE_PREMIUM_MODE && currentStep >= 1 && !isPremiumUnlocked && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <PaymentIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6">
                {language === 'zh-CN' ? '获取完整报告' : (language === 'zh' ? '獲取完整報告' : 'Get Complete Report')}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  {language === 'zh-CN' ? '包含内容' : (language === 'zh' ? '包含內容' : "What's Included")}
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PsychologyIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={language.startsWith('zh') ? '完整人格分析' : 'Complete Personality Analysis'} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={language === 'zh-CN' ? '职业工作见解' : (language === 'zh' ? '職業工作見解' : 'Career & Work Insights')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FavoriteIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={language === 'zh-CN' ? '人际关系动态' : (language === 'zh' ? '人際關係動態' : 'Relationship Dynamics')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={language === 'zh-CN' ? '个人成长计划' : (language === 'zh' ? '個人成長計劃' : 'Personal Growth Plan')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={language === 'zh-CN' ? '最新研究发现' : (language === 'zh' ? '最新研究發現' : 'Latest Research Findings')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PictureAsPdfIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={language === 'zh-CN' ? '专业 PDF 报告' : (language === 'zh' ? '專業 PDF 報告' : 'Professional PDF Report')} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, bgcolor: 'primary.50', textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main" gutterBottom>
                    $9.99
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {language === 'zh-CN' ? '特别推出价格' : (language === 'zh' ? '特別推出價格' : 'Special Launch Price')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {language === 'zh-CN' ? '一次性付款，终身访问，专业品质' : (language === 'zh' ? '一次性付款，終身訪問，專業品質' : 'One-time payment, lifetime access, professional quality')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                color="success"
                onClick={() => setShowPaymentDialog(true)}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <PaymentIcon />}
                sx={{ py: 1.5, px: 4, fontSize: '1rem', fontWeight: 600 }}
              >
                {loading ? (language.startsWith('zh') ? '处理中...' : 'Processing...') : (language === 'zh-CN' ? '获取完整报告' : (language === 'zh' ? '獲取完整報告' : 'Get Complete Report'))}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Download Section - only show if premium mode is enabled */}
      {ENABLE_PREMIUM_MODE && currentStep === 3 && isPremiumUnlocked && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <CheckIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6" color="success.main">
                {language === 'zh-CN' ? '付款成功' : (language === 'zh' ? '付款成功' : 'Payment Successful')}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ mb: 2 }}>
              {language === 'zh-CN' ? '感谢您的购买！您的完整 MBTI 分析报告已准备好下载。' : (language === 'zh' ? '感謝您的購買！您的完整 MBTI 分析報告已準備好下載。' : 'Thank you for your purchase! Your complete MBTI analysis report is ready for download.')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={handleDownloadReport}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <DownloadIcon />}
              sx={{ py: 1.5, px: 4, fontSize: '1rem', fontWeight: 600 }}
            >
              {loading ? (language.startsWith('zh') ? '准备下载...' : 'Preparing Download...') : (language === 'zh-CN' ? '下载完整报告' : (language === 'zh' ? '下載完整報告' : 'Download Complete Report'))}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment Dialog - only show if premium mode is enabled */}
      {ENABLE_PREMIUM_MODE && (
        <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{language === 'zh-CN' ? '完成您的购买' : (language === 'zh' ? '完成您的購買' : 'Complete Your Purchase')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {language === 'zh-CN' ? '输入您的详细信息以完成购买并获得您的完整 MBTI 分析报告' : (language === 'zh' ? '輸入您的詳細信息以完成購買並獲得您的完整 MBTI 分析報告' : 'Enter your details to complete purchase and get your full MBTI analysis report')}
          </Typography>
          <TextField
            fullWidth
            label={language.startsWith('zh') ? '全名' : 'Full Name'}
            value={paymentDetails.name}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={language.startsWith('zh') ? '电子邮件' : 'Email'}
            type="email"
            value={paymentDetails.email}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary">
              <strong>{language.startsWith('zh') ? '订单摘要' : 'Order Summary'}: {language === 'zh-CN' ? '高级 MBTI 分析报告' : (language === 'zh' ? '高級 MBTI 分析報告' : 'Premium MBTI Analysis Report')} - $9.99</strong>
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>{language.startsWith('zh') ? '取消' : 'Cancel'}</Button>
          <Button 
            onClick={handlePaymentSubmit} 
            variant="contained" 
            color="success"
            disabled={loading}
          >
            {loading ? (language.startsWith('zh') ? '处理中...' : 'Processing...') : (language === 'zh-CN' ? '完成购买' : (language === 'zh' ? '完成購買' : 'Complete Purchase'))}
          </Button>
        </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default EnhancedAIAnalysis;
