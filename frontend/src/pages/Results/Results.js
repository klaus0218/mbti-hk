import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faDownload, faShare, faEnvelope, faLock, faUnlock, faCrown, faBrain, faSpinner, faExternalLinkAlt, faFilePdf, faFileCode, faLightbulb, faBriefcase, faHeartPulse, faChartLine, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Container, Section, Button } from '../../styles/theme';
import { useSession } from '../../contexts/SessionContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslations } from '../../locales';
import { mbtiPopulationData } from '../../data/mbtiPopulationData';
import mbtiImages from '../../data/mbtiImages';
import mbtiPreviewContent from '../../data/mbtiPreviewContent';
import { getAnalysisFromDatabase, updateResultEmail, generateHTMLFromAnalysis, generatePDFFromHTML, unlockPremiumContent } from '../../services/enhancedAIAnalysisService';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import { Typography } from '@mui/material'; // Added Typography import
import apiService from '../../services/api';

const ResultsPage = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
  padding-top: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing['3xl']};
  /* Fix mobile scrolling and prevent horizontal overflow */
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  overflow-x: hidden !important;
  width: 100vw;
  max-width: 100%;
  position: relative;
  box-sizing: border-box;
  
  /* Enable mouse wheel scrolling */
  overscroll-behavior: contain;
  scroll-behavior: smooth;
  
  /* Force scrollable content */
  min-height: calc(100vh + 100px);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-top: ${({ theme }) => theme.spacing.lg};
    padding-bottom: ${({ theme }) => theme.spacing['2xl']};
    /* Ensure mobile scrolling works */
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll !important;
    height: auto;
    min-height: calc(100vh + 200px);
  }
`;

const ResultCard = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  padding-top: ${({ theme }) => theme.spacing.md}; // Added smaller padding top
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 100%;
    margin: 0;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
  }
`;

// Update Header padding
const Header = styled.div`
  background: ${({ theme }) => theme.colors.gradientPrimary};
  color: ${({ theme }) => theme.colors.white};
  padding: 30px ${({ theme }) => theme.spacing['2xl']} 30px; // Changed bottom padding to 20px
  text-align: center;
`;

const TypeTitle = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 0; // Remove default margin
  font-size: ${({ theme }) => theme.typography['2xl']};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.xl};
  }
`;

// Update TypeDisplay to minimize white space
const TypeDisplay = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 0;  // Remove all padding
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}; // Use gap for consistent spacing
  margin-bottom: ${({ theme }) => theme.spacing.xl}; // Add margin bottom if needed
`;

// Create a wrapper to crop the image
const ImageWrapper = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: relative;
  margin-top: 10px; // Added margin-top
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 200px;
    height: 200px;
  }
`;

// Update TypeImage to use percentage
const TypeImage = styled.img`
  width: 180%; // Changed to 180%
  height: 100%; // Changed to 180%
  object-fit: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); // Center the image
  margin: 10px 0 0 0; // Added margin-top: 10px
`;

// Update LargeTypeText to be more compact
const LargeTypeText = styled.div`
  font-size: 4rem;
  font-weight: 900;
  color: #8B5A3C;
  letter-spacing: 0.1em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  line-height: 1; // Reduce line height
  margin: 0; // Remove margins
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2.5rem;
  }
`;

// Update TypeSubtitle to be more compact
const TypeSubtitle = styled.h3`
  color: #8B5A3C;
  margin: 0; // Remove margins
  line-height: 1.2; // Reduce line height
`;

// Update TypeDescription to be more compact
const TypeDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.typography.lg};
  line-height: 1.4;
  max-width: 600px;
  margin: 0; // Remove margins
  padding: 0 ${({ theme }) => theme.spacing.xl}; // Add horizontal padding if needed
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.base};
  }
`;

const LearnMoreButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

// Update ScoresSection to ensure consistent background
const ScoresSection = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
  background: ${({ theme }) => theme.colors.gray50};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const ScoresTitle = styled.h2`
  color: #D2691E;
  font-size: ${({ theme }) => theme.typography['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.xl};
  }
`;

// Update score components to be closer to progress bar
const ScoreItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  position: relative;
  padding-top: 4px; // Small padding to prevent text from touching container edge
`;

const ScoreLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0; // Remove bottom margin
  color: ${({ theme }) => theme.colors.gray600};
  font-size: 0.9rem;
`;

// Update ScoreHeader to match background and adjust positioning
const ScoreHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  position: absolute;
  left: ${props => props.percentage}%;
  transform: translateX(-50%);
  top: 0; // Set to 0
  background: ${({ theme }) => theme.colors.gray50}; // Match the background color
  padding: 0 4px;
  z-index: 2;
`;

const ScorePercentage = styled.span`
  color: ${props => props.color};
  font-weight: bold;
  font-size: 1.1rem;
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

const ScoreType = styled.span`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 0.9rem;
  font-weight: bold; // Added bold font weight
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => props.color};
  border-radius: 4px;
  transition: width 0.6s ease-in-out;
`;

const ProgressPoint = styled.div`
  width: 16px;
  height: 16px;
  background: white;
  border: 2px solid ${props => props.color};
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: ${props => props.percentage}%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const ProgressIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ percentage }) => percentage}%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: ${({ theme }) => theme.colors.white};
  border: 3px solid ${({ color }) => color};
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const StatsSection = styled.div`
  padding: ${({ theme }) => theme.spacing['lg']};
  background: ${({ theme }) => theme.colors.white};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const StatsTitle = styled.h2`
  color: #D2691E;
  font-size: ${({ theme }) => theme.typography['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.xl};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const StatCard = styled.div`
  text-align: center;
`;

const CircularProgress = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  padding: 10px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 120px;
    height: 120px;
  }
`;

const CircularProgressSvg = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const CircularProgressBackground = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.colors.gray200};
  stroke-width: 6;
`;

const CircularProgressFill = styled.circle`
  fill: none;
  stroke: #D2691E;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: ${({ circumference }) => circumference};
  stroke-dashoffset: ${({ circumference, percentage }) => 
    circumference - (percentage / 100) * circumference};
  transition: stroke-dashoffset 1s ease-in-out;
`;

const CircularProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${({ theme }) => theme.typography.lg};
  font-weight: ${({ theme }) => theme.typography.bold};
  color: #D2691E;
  text-align: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.base};
  }
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.typography.medium};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.sm};
  }
`;

const CelebsSection = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
  background: ${({ theme }) => theme.colors.gray50};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const CelebsTitle = styled.h2`
  color: #D2691E;
  font-size: ${({ theme }) => theme.typography['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.xl};
  }
`;

const CelebCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    text-align: center;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const CelebAvatar = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.gradientSecondary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography['2xl']};
  font-weight: ${({ theme }) => theme.typography.bold};
  flex-shrink: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 60px;
    height: 60px;
    font-size: ${({ theme }) => theme.typography.lg};
  }
`;

const CelebInfo = styled.div`
  flex: 1;
`;

const CelebName = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.lg};
  }
`;

const CelebDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.typography.sm};
`;

const ActionsSection = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
  background: ${({ theme }) => theme.colors.white};
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const EmailSection = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  background: #D2691E;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.white};
`;

const EmailTitle = styled.h3`
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmailForm = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.base};
`;

const EmailButton = styled(Button)`
  white-space: nowrap;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
`;

const dimensionColors = {
  E: '#4A7BC8', // Much stronger blue for Extroversion
  I: '#5A9BD4', // Stronger blue for Introversion
  S: '#5A9D3A', // Much stronger green for Sensing
  N: '#7B5BA8', // Much stronger purple for Intuition
  T: '#5A6BC6', // Much stronger blue-gray for Thinking
  F: '#B86B7A', // Much stronger pink for Feeling
  J: '#6A6A6A', // Much stronger gray for Judging
  P: '#6BB4C9'  // Much stronger blue-gray for Perceiving
};

// Add debugging to see what data we're working with
const getScore = (result, dimension) => {
  try {
    // Check if we have normalized scores in the expected format
    if (result?.normalizedScores?.[dimension]) {
      return result.normalizedScores[dimension];
    }
    // Check if we have scores in the transformed format
    if (result?.scores?.[dimension.slice(0, 2)]) {
      return result.scores[dimension.slice(0, 2)][dimension];
    }
    // Check if we have confidence scores
    if (result?.confidence?.[dimension.slice(0, 2)]) {
      return result.confidence[dimension.slice(0, 2)];
    }
    // Default to 50 if no score is found
    return 50;
  } catch (error) {
    console.error(`Error getting score for dimension ${dimension}:`, error);
    return 50;
  }
};

// Update the getDominantTrait function to handle different positioning logic
const getDominantTrait = (result, dimensionPair) => {
  const leftTrait = dimensionPair[0]; // E, S, T, J (left side)
  const rightTrait = dimensionPair[1]; // I, N, F, P (right side)
  
  const leftScore = getScore(result, leftTrait);
  const rightScore = getScore(result, rightTrait);
  
  
  // Determine which trait to display (the higher one)
  const displayTrait = leftScore >= rightScore ? leftTrait : rightTrait;
  const displayScore = leftScore >= rightScore ? leftScore : rightScore;
  
  // Position logic: Position based on left trait score
  // If left trait is dominant, position at leftScore
  // If right trait is dominant, position at (100 - rightScore)
  const positionScore = leftScore >= rightScore ? leftScore : (100 - rightScore);
  
  
  return { 
    trait: displayTrait, 
    percentage: displayScore,
    positionPercentage: positionScore
  };
};

// Add this helper function to transform API result data
const transformResultData = (apiResult) => {
  const { mbtiType, typeInfo, scores, celebrities, recommendations, statistics, compatibility } = apiResult;
  
  // Transform scores from API format to component format
  const transformedScores = {
    EI: {
      E: scores.normalized.E,
      I: scores.normalized.I,
      color: '#8B5A3C'
    },
    SN: {
      S: scores.normalized.S,
      N: scores.normalized.N,
      color: '#8B5A3C'
    },
    TF: {
      T: scores.normalized.T,
      F: scores.normalized.F,
      color: '#8B5A3C'
    },
    JP: {
      J: scores.normalized.J,
      P: scores.normalized.P,
      color: '#8B5A3C'
    }
  };

  // Transform celebrities to expected format
  const transformedCelebrities = celebrities.map(celeb => ({
    ...celeb,
    initials: celeb.name.split(' ').map(n => n[0]).join('')
  }));

  // Mock population statistics that the Results component expects
  const mockPopulationStats = {
    totalPopulation: 3.4,
    maleRatio: 52.1,
    femaleRatio: 47.9
  };

  return {
    type: mbtiType,
    typeName: typeInfo.title,
    description: typeInfo.description,
    scores: transformedScores,
    celebrities: transformedCelebrities,
    recommendations,
    stats: mockPopulationStats,
    statistics,
    compatibility,
    rawScores: scores.raw,
    normalizedScores: scores.normalized,
    dimensions: apiResult.dimensions,
    confidence: apiResult.confidence,
    typeStrength: apiResult.typeStrength,
    demographics: apiResult.demographics || {}, // Include demographics data
    premium: apiResult.premium, // Preserve premium status
    isPremiumUnlocked: apiResult.isPremiumUnlocked // Preserve premium unlock status
  };
};

// New styled components for AI Analysis
const AIAnalysisSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: 0px;
`;

const AIAnalysisHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  position: relative;
`;

const AIAnalysisTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PremiumBadge = styled.span`
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #8b4513;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  margin-left: 8px;
`;

const AIAnalysisContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const AnalysisPreview = styled.div`
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-left: 4px solid #667eea;
`;

const PreviewSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PreviewSectionTitle = styled.h4`
  color: #D2691E;
  font-size: ${({ theme }) => theme.typography.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PreviewSectionContent = styled.p`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.typography.base};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PreviewInsightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.typography.sm};
  line-height: 1.8;
`;

const PreviewCallToAction = styled.div`
  background: #D2691E;
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.base};
  font-weight: ${({ theme }) => theme.typography.bold};
`;

const AIAnalysisActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const PremiumButton = styled(Button)`
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  height: 28px;
  color: #8b4513;
  border: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: all 0.3s ease;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
  }
`;

const DownloadButton = styled(Button)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: all 0.3s ease;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const ViewReportButton = styled(Button)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 10px 20px;
    font-size: 13px;
    margin-left: 8px;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c53030;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  text-align: center;
`;

// Rename this to avoid conflict with the MBTI dimension score bars
const AIAnalysisProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  .progress-fill {
    height: 100%;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    transition: width 0.3s ease;
    width: ${({ progress }) => progress}%;
  }
`;

// Add this component for the MBTI dimension score bars
const ProgressBar = styled.div`
  height: 8px;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 4px;
  position: relative;
  overflow: visible;
  margin-top: 10px;
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.sm};
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  margin-top: 15px;
`;

// Add new styled components for the download modal
const DownloadModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DownloadModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const DownloadModalTitle = styled.h3`
  margin-bottom: 1.5rem;
  color: #D2691E;
  font-size: 1.25rem;
`;

const DownloadOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DownloadOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  font-weight: 500;
  
  &:hover {
    border-color: #D2691E;
    background: #fef7f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(210, 105, 30, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const DownloadOptionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
`;

const PDFIcon = styled(DownloadOptionIcon)`
  background: linear-gradient(45deg, #dc2626, #ef4444);
`;

const HTMLIcon = styled(DownloadOptionIcon)`
  background: linear-gradient(45deg, #059669, #10b981);
`;

const DownloadOptionText = styled.div`
  text-align: left;
`;

const DownloadOptionTitle = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const DownloadOptionDescription = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const Results = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { result, isLoading } = useSession();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Configuration: Enable/disable premium mode
  // Set via environment variable or change this constant
  // If false, premium features (unlock, payment, download) will be hidden
  // Default is false - set to true to enable premium features
  const ENABLE_PREMIUM_MODE = process.env.REACT_APP_ENABLE_PREMIUM_MODE === 'true';
  
  const [email, setEmail] = useState('');
  const [displayResult, setDisplayResult] = useState(null);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [analysisEmail, setAnalysisEmail] = useState('');
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisGenerationComplete, setAnalysisGenerationComplete] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isPDFGenerating, setIsPDFGenerating] = useState(false);
  const [isHTMLGenerating, setIsHTMLGenerating] = useState(false);

  // Auto-scroll to top when entering the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Initialize analysisEmail from existing result when displayResult changes
  useEffect(() => {
    if (displayResult?.demographics?.email) {
      setAnalysisEmail(displayResult.demographics.email);
    }
  }, [displayResult]);

  // Check if premium is unlocked from the result data
  const isPremiumUnlocked = displayResult?.premium || displayResult?.isPremiumUnlocked;

  useEffect(() => {
    const loadResult = async () => {
      // First, try to get result from session context (for current test)
      if (result) {
        const populationStats = mbtiPopulationData[result.type] || {
          totalPopulation: 0,
          maleRatio: 0,
          femaleRatio: 0
        };
        
        const newResult = {
          ...result,
          stats: {
            ...result.stats,
            totalPopulation: populationStats.totalPopulation,
            maleRatio: populationStats.maleRatio,
            femaleRatio: populationStats.femaleRatio
          },
          timestamp: Date.now()
        };
        localStorage.setItem('mbtiResult', JSON.stringify(newResult));
        setDisplayResult(newResult);
        return;
      }

      // If no result in session context, try localStorage (for retrieved results)
      const savedResult = localStorage.getItem('mbtiResult');
      if (savedResult) {
        const parsed = JSON.parse(savedResult);
        if (Date.now() - parsed.timestamp < 4 * 60 * 60 * 1000) {
          setDisplayResult(parsed);
          return;
        } else {
          // Clear expired result
          localStorage.removeItem('mbtiResult');
        }
      }

      // If no result in localStorage, fetch from backend using sessionId
      if (sessionId && !isLoadingResult) {
        setIsLoadingResult(true);
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/results/${sessionId}?language=${language}`);
          if (response.ok) {
            const data = await response.json();
            if (data.result) {
              console.log('📊 Raw API result:', data.result);
              const transformedResult = transformResultData(data.result);
              console.log('🔄 Transformed result:', transformedResult);
              const resultWithTimestamp = {
                ...transformedResult,
                timestamp: Date.now()
              };
              console.log('💾 Saving to localStorage:', resultWithTimestamp);
              localStorage.setItem('mbtiResult', JSON.stringify(resultWithTimestamp));
              setDisplayResult(resultWithTimestamp);
            }
          } else {
            console.error('Failed to fetch result:', response.status);
          }
        } catch (error) {
          console.error('Error fetching result:', error);
        } finally {
          setIsLoadingResult(false);
        }
      }
    };

    loadResult();
  }, [result, sessionId, language, isLoadingResult]);

  // Auto-sync when premium status changes to ensure consistency
  useEffect(() => {
    if (isPremiumUnlocked && sessionId && !isLoadingResult) {
      // Check if analysis already exists
      checkExistingAnalysis();
    }
  }, [isPremiumUnlocked, sessionId]);

  const handleRetakeTest = () => {
    // Clear stored result when retaking test
    localStorage.removeItem('mbtiResult');
    navigate('/test');
  };

  const handleEmailSubmit = () => {
    if (email.trim()) {
      alert(language === 'zh' ? '已發送到您的電子郵件！' : 'Sent to your email!');
      setEmail('');
    }
  };

  // Function to handle premium unlock (simulate payment)
  const handlePremiumUnlock = () => {
    if (!ENABLE_PREMIUM_MODE) return;
    setShowPaymentModal(true);
  };

  // Function to handle email submission for analysis
  const handleAnalysisEmailSubmit = async () => {
    if (analysisEmail.trim()) {
      // Update the displayResult with the new email
      const updatedResult = {
        ...displayResult,
        demographics: {
          ...displayResult.demographics,
          email: analysisEmail.trim()
        }
      };
      
      // Update localStorage
      localStorage.setItem('mbtiResult', JSON.stringify(updatedResult));
      setDisplayResult(updatedResult);
      
      // Update backend if we have sessionId
      if (sessionId) {
        try {
          await updateResultEmail(sessionId, analysisEmail.trim());
          console.log('✅ Backend result updated with new email');
        } catch (error) {
          console.error('Failed to update backend result with email:', error);
        }
      }
      
      setShowEmailModal(false);
    }
  };

  // Function to handle email modal close
  const handleEmailModalClose = () => {
    setShowEmailModal(false);
    setAnalysisEmail('');
  };

  // Function to download full report
  const handleDownloadClick = () => {
    if (!ENABLE_PREMIUM_MODE) return;
    setShowDownloadModal(true);
  };

  const handleCloseDownloadModal = () => {
    setShowDownloadModal(false);
  };

  const handlePDFDownload = async () => {
    if (!ENABLE_PREMIUM_MODE) return;
    if (!displayResult?.premium) {
      const message = language === 'zh' 
        ? '請先解鎖高級內容以生成完整報告'
        : 'Please unlock premium content first to generate the full report';
      alert(message);
      return;
    }

    if (!analysisGenerationComplete) {
      const message = language === 'zh' 
        ? 'AI分析報告正在生成中，請稍候'
        : 'AI analysis report is being generated, please wait';
      alert(message);
      return;
    }
    
    setIsPDFGenerating(true);
    
    try {
      const htmlData = await generateHTMLFromAnalysis(sessionId, displayResult.type, language);
      
      if (htmlData) {
        await generatePDFFromHTML(htmlData, `MBTI_Report_${displayResult.type}.pdf`);
        setShowDownloadModal(false);
      } else {
        throw new Error('No HTML data received');
      }
    } catch (error) {
      console.error('Failed to generate PDF report:', error);
      alert(language === 'zh' ? 'PDF生成失敗，請重試' : 'PDF generation failed, please try again');
    } finally {
      setIsPDFGenerating(false);
    }
  };

  const handleHTMLDownload = async () => {
    if (!ENABLE_PREMIUM_MODE) return;
    if (!displayResult?.premium) {
      const message = language === 'zh' 
        ? '請先解鎖高級內容以生成完整報告'
        : 'Please unlock premium content first to generate the full report';
      alert(message);
      return;
    }

    if (!analysisGenerationComplete) {
      const message = language === 'zh' 
        ? 'AI分析報告正在生成中，請稍候'
        : 'AI analysis report is being generated, please wait';
      alert(message);
      return;
    }
    
    setIsHTMLGenerating(true);
    
    try {
      const htmlData = await generateHTMLFromAnalysis(sessionId, displayResult.type, language);
      
      if (htmlData) {
        // Create a blob and download the HTML file
        const blob = new Blob([htmlData], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `MBTI_Report_${displayResult.type}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setShowDownloadModal(false);
      } else {
        throw new Error('No HTML data received');
      }
    } catch (error) {
      console.error('Failed to generate HTML report:', error);
      alert(language === 'zh' ? 'HTML生成失敗，請重試' : 'HTML generation failed, please try again');
    } finally {
      setIsHTMLGenerating(false);
    }
  };

  // Function to view report in new window
  const handleViewReport = async () => {
    if (!ENABLE_PREMIUM_MODE) return;
    if (!analysisGenerationComplete) {
      // If analysis is not ready, show a message
      const message = language === 'zh' 
        ? 'AI分析報告正在生成中，請稍候'
        : 'AI analysis report is being generated, please wait';
      alert(message);
      return;
    }
    
    try {
      const htmlData = await generateHTMLFromAnalysis(sessionId, displayResult.type, language);
      
      if (htmlData) {
        // Open HTML report in a new window
        const newWindow = window.open('', '_blank');
        newWindow.document.write(htmlData);
        newWindow.document.close();
      } else {
        throw new Error('No HTML data received');
      }
    } catch (error) {
      console.error('Failed to open report:', error);
      alert(language === 'zh' ? '無法打開報告，請重試' : 'Failed to open report, please try again');
    }
  };

  // Function to manually sync local storage with remote data
  const syncWithRemoteData = async () => {
    if (!sessionId) {
      console.error('No sessionId available for sync');
      return;
    }
    
    try {
      setIsLoadingResult(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/results/${sessionId}?language=${language}`);
      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          console.log('🔄 Syncing with remote data:', data.result);
          const transformedResult = transformResultData(data.result);
          
          const updatedResult = {
            ...transformedResult,
            timestamp: Date.now()
          };
          
          localStorage.setItem('mbtiResult', JSON.stringify(updatedResult));
          setDisplayResult(updatedResult);
          
          console.log('✅ Local storage synced with remote data');
        }
      } else {
        console.error('Failed to sync with remote data:', response.status);
      }
    } catch (error) {
      console.error('Error syncing with remote data:', error);
    } finally {
      setIsLoadingResult(false);
    }
  };

  // Function to verify localStorage content
  const verifyLocalStorage = () => {
    const stored = localStorage.getItem('mbtiResult');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('🔍 Current localStorage content:', parsed);
      console.log('🔍 Premium status in localStorage:', {
        premium: parsed.premium,
        isPremiumUnlocked: parsed.premium
      });
      return parsed;
    } else {
      console.log('🔍 No data in localStorage');
      return null;
    }
  };

  // Function to check if AI analysis exists
  const checkExistingAnalysis = async () => {
    if (!sessionId || !displayResult?.type) {
      return false;
    }

    try {
      const data = await apiService.aiAnalysis.getAnalysis(sessionId, displayResult.type);
      if (data.success && data.data) {
        console.log('✅ Existing analysis found:', data.data);
        setAnalysisGenerationComplete(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error checking existing analysis:', error);
      return false;
    }
  };

  // Function to generate AI analysis with progress tracking
  const generateAIAnalysis = async () => {
    if (!ENABLE_PREMIUM_MODE) return false;
    if (!sessionId || !displayResult?.type) {
      console.error('Missing sessionId or MBTI type for analysis generation');
      return false;
    }

    try {
      setIsGeneratingAnalysis(true);
      setAnalysisProgress(0);
      setAnalysisGenerationComplete(false);

      console.log('🚀 Starting AI analysis generation...');

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 99) {
            clearInterval(progressInterval);
            return 99;
          }
          return prev + Math.random();
        });
      }, 1000);

      // Prepare the data to send to backend
      const requestData = {
        sessionId,
        mbtiType: displayResult.type,
        mbtiResult: {
          type: displayResult.type,
          typeName: displayResult.typeName && typeof displayResult.typeName === 'object' 
            ? (displayResult.typeName[language] || displayResult.typeName.en || '')
            : displayResult.typeName || '',
          description: displayResult.description && typeof displayResult.description === 'object'
            ? (displayResult.description[language] || displayResult.description.en || '')
            : displayResult.description || '',
          scores: displayResult.scores,
          dimensions: displayResult.dimensions,
          confidence: displayResult.confidence,
          typeStrength: displayResult.typeStrength,
          celebrities: displayResult.celebrities,
          recommendations: displayResult.recommendations,
          statistics: displayResult.statistics,
          demographics: displayResult.demographics || {}
        },
        email: displayResult.demographics?.email || ''
      };

      console.log('📤 Sending data to backend:', requestData);

      // Call backend to generate analysis using API service
      const data = await apiService.aiAnalysis.createAnalysisPackage(requestData);
      console.log('✅ AI analysis generation completed:', data);
      
      // Complete progress
      setAnalysisProgress(100);
      setAnalysisGenerationComplete(true);
      
      // Clear progress interval
      clearInterval(progressInterval);
      
      return true;
    } catch (error) {
      console.error('❌ Error generating AI analysis:', error);
      setAnalysisProgress(0);
      setAnalysisGenerationComplete(false);
      return false;
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  // Updated function to handle successful payment
  const handlePaymentSuccess = async () => {
    if (!ENABLE_PREMIUM_MODE) return;
    try {
      console.log('🔓 Starting premium unlock process...');
      
      // Check current localStorage state
      console.log('🔍 Current localStorage state before unlock:');
      verifyLocalStorage();
      
      // Call backend to unlock premium content using API service
      if (sessionId && displayResult?.type) {
        const unlocked = await apiService.aiAnalysis.unlockPremiumContent(sessionId, displayResult.type);
        
        if (unlocked.success) {
          console.log('🔓 Premium unlocked, fetching updated result...');
          
          // Fetch the updated result from backend to sync with remote data
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/results/${sessionId}?language=${language}`);
            if (response.ok) {
              const data = await response.json();
              console.log('📊 Raw API response:', data);
              
              if (data.result) {
                console.log('🔄 Fetched updated result from backend:', data.result);
                
                // Check if the result has premium status
                if (data.result.premium || data.result.isPremiumUnlocked) {
                  console.log('✅ Backend result shows premium is unlocked');
                } else {
                  console.log('⚠️ Backend result does not show premium status yet');
                }
                
                const transformedResult = transformResultData(data.result);
                console.log('🔄 Transformed result:', transformedResult);
                
                // Update the displayResult with the latest data from backend
                const updatedResult = {
                  ...transformedResult,
                  timestamp: Date.now()
                };
                
                console.log('💾 Final result to save:', updatedResult);
                
                // Update localStorage with the synced data
                localStorage.setItem('mbtiResult', JSON.stringify(updatedResult));
                console.log('💾 localStorage updated successfully');
                
                // Verify localStorage was updated correctly
                verifyLocalStorage();
                
                // Update component state
                setDisplayResult(updatedResult);
                console.log('✅ Component state updated');
                
                console.log('✅ Local storage synced with remote data');
                
                // Start generating AI analysis
                console.log('🚀 Starting AI analysis generation...');
                const analysisGenerated = await generateAIAnalysis();
                
                if (analysisGenerated) {
                  console.log('✅ AI analysis generation completed successfully');
                } else {
                  console.log('⚠️ AI analysis generation failed, but premium is unlocked');
                }
              } else {
                console.error('❌ No result data in API response');
                throw new Error('No result data received from backend');
              }
            } else {
              console.error('❌ Failed to fetch updated result:', response.status);
              throw new Error(`HTTP ${response.status}: Failed to fetch updated result`);
            }
          } catch (fetchError) {
            console.error('❌ Error fetching updated result:', fetchError);
            // Fallback: update local state with premium status
            console.log('🔄 Using fallback: updating local state only');
            const updatedResult = {
              ...displayResult,
              premium: true,
              isPremiumUnlocked: true
            };
            localStorage.setItem('mbtiResult', JSON.stringify(updatedResult));
            setDisplayResult(updatedResult);
            
            // Verify localStorage was updated correctly
            verifyLocalStorage();
            
            console.log('✅ Fallback update completed');
          }
          
          console.log('✅ Premium content unlocked successfully');
        } else {
          throw new Error('Failed to unlock premium content');
        }
      } else {
        throw new Error('Missing sessionId or MBTI type');
      }
    } catch (error) {
      console.error('❌ Error unlocking premium content:', error);
      
      // Show error message to user
      const errorMessage = language === 'zh' 
        ? '解鎖高級內容時發生錯誤，請重試'
        : 'Error unlocking premium content, please try again';
      
      alert(errorMessage);
      
      // Don't update local state if backend call failed
      return;
    }
  };

  // Check if premium is already unlocked on component mount
  useEffect(() => {
    // Premium status is now checked directly from displayResult data
    // No need to check localStorage separately
  }, []);

  if (isLoading || isLoadingResult) {
    return (
      <ResultsPage>
        <Container>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            {t.common.loading}
          </div>
        </Container>
      </ResultsPage>
    );
  }

  if (!displayResult) {
    return (
      <ResultsPage>
        <Container>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            No results available
          </div>
        </Container>
      </ResultsPage>
    );
  }

  const circumference = 2 * Math.PI * 45; // radius = 45
  return (
    <ResultsPage>
      <Container>
        <ResultCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Header>
            <TypeTitle>
              {language === 'zh' ? `你的MBTI是: ${displayResult.type}` : `Your MBTI Type: ${displayResult.type}`}
            </TypeTitle>
          </Header>

          {/* Type Display */}
          <TypeDisplay>
            <ImageWrapper>
              <TypeImage 
                src={mbtiImages[displayResult.type]} 
                alt={displayResult.type}
              />
            </ImageWrapper>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <LargeTypeText>{displayResult.type}</LargeTypeText>
              <TypeSubtitle>
                {displayResult.typeName && typeof displayResult.typeName === 'object' 
                  ? (displayResult.typeName[language.toLowerCase()] || displayResult.typeName.en || '')
                  : displayResult.typeName || ''}
              </TypeSubtitle>
              <TypeDescription>
                {displayResult.description && typeof displayResult.description === 'object'
                  ? (displayResult.description[language.toLowerCase()] || displayResult.description.en || '')
                  : displayResult.description || ''}
              </TypeDescription>
            </div>
            <LearnMoreButton 
              variant="primary"
              onClick={() => navigate(`/mbti-types/${displayResult.type.toLowerCase()}`)}
            >
              {language === 'zh' ? `了解更多${displayResult.type}` : `Learn More About ${displayResult.type}`}
            </LearnMoreButton>
          </TypeDisplay>

          {/* Scores Section */}
          <ScoresSection>
            <ScoresTitle>
              {language === 'zh' ? '你的維度分數' : 'Your Dimension Scores'}
            </ScoresTitle>
            
            {/* E-I Dimension */}
            <ScoreItem>
              <ScoreLabels>
                <span>Extraverted</span>
                <span>Introverted</span>
              </ScoreLabels>
              {(() => {
                const dominant = getDominantTrait(displayResult, ['E', 'I']);
                return (
                  <>
                    <ScoreHeader percentage={dominant.positionPercentage}> {/* Position at calculated score */}
                      <ScorePercentage color={dimensionColors[dominant.trait]}>
                        {Math.round(dominant.percentage)}% {/* Show higher score */}
                      </ScorePercentage>
                      <ScoreType>
                        {dominant.trait === 'E' ? 'Extraverted' : 'Introverted'}
                      </ScoreType>
                    </ScoreHeader>
                    <ProgressBar>
                      <ProgressFill 
                        percentage={100}
                        color={dimensionColors[dominant.trait]}
                      />
                      <ProgressPoint 
                        percentage={dominant.positionPercentage} // Position at calculated score
                        color={dimensionColors[dominant.trait]}
                      />
                    </ProgressBar>
                  </>
                );
              })()}
            </ScoreItem>

            {/* S-N Dimension */}
            <ScoreItem>
              <ScoreLabels>
                <span>Intuitive</span>
                <span>Observant</span>
              </ScoreLabels>
              {(() => {
                const dominant = getDominantTrait(displayResult, ['N', 'S']); // Changed from ['S', 'N'] to ['N', 'S']
                return (
                  <>
                    <ScoreHeader percentage={dominant.positionPercentage}> {/* Position at calculated score */}
                      <ScorePercentage color={dimensionColors[dominant.trait]}>
                        {Math.round(dominant.percentage)}% {/* Show higher score */}
                      </ScorePercentage>
                      <ScoreType>
                        {dominant.trait === 'N' ? 'Intuitive' : 'Observant'} {/* Updated to match new order */}
                      </ScoreType>
                    </ScoreHeader>
                    <ProgressBar>
                      <ProgressFill 
                        percentage={100}
                        color={dimensionColors[dominant.trait]}
                      />
                      <ProgressPoint 
                        percentage={dominant.positionPercentage} // Position at calculated score
                        color={dimensionColors[dominant.trait]}
                      />
                    </ProgressBar>
                  </>
                );
              })()}
            </ScoreItem>

            {/* T-F Dimension */}
            <ScoreItem>
              <ScoreLabels>
                <span>Thinking</span>
                <span>Feeling</span>
              </ScoreLabels>
              {(() => {
                const dominant = getDominantTrait(displayResult, ['T', 'F']);
                return (
                  <>
                    <ScoreHeader percentage={dominant.positionPercentage}> {/* Position at calculated score */}
                      <ScorePercentage color={dimensionColors[dominant.trait]}>
                        {Math.round(dominant.percentage)}% {/* Show higher score */}
                      </ScorePercentage>
                      <ScoreType>
                        {dominant.trait === 'T' ? 'Thinking' : 'Feeling'}
                      </ScoreType>
                    </ScoreHeader>
                    <ProgressBar>
                      <ProgressFill 
                        percentage={100}
                        color={dimensionColors[dominant.trait]}
                      />
                      <ProgressPoint 
                        percentage={dominant.positionPercentage} // Position at calculated score
                        color={dimensionColors[dominant.trait]}
                      />
                    </ProgressBar>
                  </>
                );
              })()}
            </ScoreItem>

            {/* J-P Dimension */}
            <ScoreItem>
              <ScoreLabels>
                <span>Judging</span>
                <span>Prospecting</span>
              </ScoreLabels>
              {(() => {
                const dominant = getDominantTrait(displayResult, ['J', 'P']);
                return (
                  <>
                    <ScoreHeader percentage={dominant.positionPercentage}> {/* Position at calculated score */}
                      <ScorePercentage color={dimensionColors[dominant.trait]}>
                        {Math.round(dominant.percentage)}% {/* Show higher score */}
                      </ScorePercentage>
                      <ScoreType>
                        {dominant.trait === 'J' ? 'Judging' : 'Prospecting'}
                      </ScoreType>
                    </ScoreHeader>
                    <ProgressBar>
                      <ProgressFill 
                        percentage={100}
                        color={dimensionColors[dominant.trait]}
                      />
                      <ProgressPoint 
                        percentage={dominant.positionPercentage} // Position at calculated score
                        color={dimensionColors[dominant.trait]}
                      />
                    </ProgressBar>
                  </>
                );
              })()}
            </ScoreItem>
          </ScoresSection>

          {/* Statistics */}
          <StatsSection>
            <StatsTitle>{language === 'zh' ? '人口占比' : 'Population Statistics'}</StatsTitle>
            <StatsGrid>
                             <StatCard>
                 <CircularProgress>
                   <CircularProgressSvg viewBox="0 0 100 100">
                     <CircularProgressBackground cx="50" cy="50" r="45" />
                     <CircularProgressFill 
                       cx="50" 
                       cy="50" 
                       r="45"
                       circumference={circumference}
                       percentage={displayResult.stats.totalPopulation}
                     />
                   </CircularProgressSvg>
                   <CircularProgressText>{displayResult.stats.totalPopulation}%</CircularProgressText>
                 </CircularProgress>
                 <StatLabel>{language === 'zh' ? '佔總人口' : 'Total Population'}</StatLabel>
               </StatCard>
               
               <StatCard>
                 <CircularProgress>
                   <CircularProgressSvg viewBox="0 0 100 100">
                     <CircularProgressBackground cx="50" cy="50" r="45" />
                     <CircularProgressFill 
                       cx="50" 
                       cy="50" 
                       r="45"
                       circumference={circumference}
                       percentage={displayResult.stats.maleRatio}
                     />
                   </CircularProgressSvg>
                   <CircularProgressText>{displayResult.stats.maleRatio}%</CircularProgressText>
                 </CircularProgress>
                 <StatLabel>{language === 'zh' ? '佔男性比例' : 'Male Ratio'}</StatLabel>
               </StatCard>
               
               <StatCard>
                 <CircularProgress>
                   <CircularProgressSvg viewBox="0 0 100 100">
                     <CircularProgressBackground cx="50" cy="50" r="45" />
                     <CircularProgressFill 
                       cx="50" 
                       cy="50" 
                       r="45"
                       circumference={circumference}
                       percentage={displayResult.stats.femaleRatio}
                     />
                   </CircularProgressSvg>
                   <CircularProgressText>{displayResult.stats.femaleRatio}%</CircularProgressText>
                 </CircularProgress>
                 <StatLabel>{language === 'zh' ? '佔女性比例' : 'Female Ratio'}</StatLabel>
               </StatCard>
            </StatsGrid>
          </StatsSection>

          {/* New AI Analysis Section */}
          <AIAnalysisSection>
            <AIAnalysisHeader>
              <AIAnalysisTitle>
                <FontAwesomeIcon icon={faBrain} />
                {language === 'zh' ? 'AI 深度分析' : 'AI Deep Analysis'}
                {ENABLE_PREMIUM_MODE && (
                  <PremiumBadge>
                    <FontAwesomeIcon icon={faCrown} />
                    {language === 'zh' ? ' PREMIUM' : ' PREMIUM'}
                  </PremiumBadge>
                )}
              </AIAnalysisTitle>
            </AIAnalysisHeader>
            
            <AIAnalysisContent>
                <div>
                  {/* Show preview content from JSON file */}
                  {displayResult?.type && mbtiPreviewContent[displayResult.type] && (
                    <AnalysisPreview>
                      <PreviewSection>
                        <PreviewSectionTitle>
                          <FontAwesomeIcon icon={faCrown} />
                          {language === 'zh' 
                            ? mbtiPreviewContent[displayResult.type].zh.title
                            : mbtiPreviewContent[displayResult.type].en.title
                          }
                        </PreviewSectionTitle>
                        <PreviewSectionContent>
                          {language === 'zh' 
                            ? mbtiPreviewContent[displayResult.type].zh.summary
                            : mbtiPreviewContent[displayResult.type].en.summary
                          }
                        </PreviewSectionContent>
                      </PreviewSection>

                      <PreviewSection>
                        <PreviewSectionTitle>
                          <FontAwesomeIcon icon={faLightbulb} />
                          {language === 'zh' ? '核心洞察' : 'Key Insights'}
                        </PreviewSectionTitle>
                        <PreviewInsightsList>
                          {(language === 'zh' 
                            ? mbtiPreviewContent[displayResult.type].zh.keyInsights
                            : mbtiPreviewContent[displayResult.type].en.keyInsights
                          ).map((insight, index) => (
                            <li key={index}>
                              {insight}
                            </li>
                          ))}
                        </PreviewInsightsList>
                      </PreviewSection>

                      <PreviewSection>
                        <PreviewSectionTitle>
                          <FontAwesomeIcon icon={faBriefcase} />
                          {language === 'zh' ? '職業發展' : 'Career Development'}
                        </PreviewSectionTitle>
                        <PreviewSectionContent>
                          {language === 'zh' 
                            ? mbtiPreviewContent[displayResult.type].zh.careerPath
                            : mbtiPreviewContent[displayResult.type].en.careerPath
                          }
                        </PreviewSectionContent>
                      </PreviewSection>

                      <PreviewSection>
                        <PreviewSectionTitle>
                          <FontAwesomeIcon icon={faShare} />
                          {language === 'zh' ? '人際關係' : 'Relationships'}
                        </PreviewSectionTitle>
                        <PreviewSectionContent>
                          <strong>{language === 'zh' ? '友誼相容性：' : 'Friendship Compatibility: '}</strong>
                          {language === 'zh' 
                            ? mbtiPreviewContent[displayResult.type].zh.friendshipCompatibility
                            : mbtiPreviewContent[displayResult.type].en.friendshipCompatibility
                          }
                        </PreviewSectionContent>
                        <PreviewSectionContent style={{ marginTop: '1rem' }}>
                          <strong>{language === 'zh' ? '戀愛相容性：' : 'Romantic Compatibility: '}</strong>
                          {language === 'zh' 
                            ? mbtiPreviewContent[displayResult.type].zh.romanticCompatibility
                            : mbtiPreviewContent[displayResult.type].en.romanticCompatibility
                          }
                        </PreviewSectionContent>
                      </PreviewSection>

                      <PreviewSection>
                        <PreviewSectionTitle>
                          <FontAwesomeIcon icon={faHeartPulse} />
                          {language === 'zh' ? '心理健康洞察' : 'Mental Health Insights'}
                        </PreviewSectionTitle>
                        <PreviewSectionContent>
                          {language === 'zh' 
                            ? mbtiPreviewContent[displayResult.type].zh.mentalHealthInsights
                            : mbtiPreviewContent[displayResult.type].en.mentalHealthInsights
                          }
                        </PreviewSectionContent>
                      </PreviewSection>

                      <PreviewSection>
                        <PreviewSectionTitle>
                          <FontAwesomeIcon icon={faChartLine} />
                          {language === 'zh' ? '自我提升' : 'Self Improvement'}
                        </PreviewSectionTitle>
                        <PreviewSectionContent>
                          {language === 'zh' 
                            ? mbtiPreviewContent[displayResult.type].zh.selfImprovement
                            : mbtiPreviewContent[displayResult.type].en.selfImprovement
                          }
                        </PreviewSectionContent>
                      </PreviewSection>

                      <PreviewSection>
                        <PreviewSectionTitle>
                          <FontAwesomeIcon icon={faSearch} />
                          {language === 'zh' ? '深度分析' : 'Deep Analysis'}
                        </PreviewSectionTitle>
                        <PreviewSectionContent>
                          {language === 'zh' 
                            ? mbtiPreviewContent[displayResult.type].zh.coreAnalysisPreview
                            : mbtiPreviewContent[displayResult.type].en.coreAnalysisPreview
                          }
                        </PreviewSectionContent>
                      </PreviewSection>

                      {ENABLE_PREMIUM_MODE && !isPremiumUnlocked && (
                        <PreviewCallToAction>
                          <p>
                            {language === 'zh' 
                              ? mbtiPreviewContent[displayResult.type].zh.callToAction
                              : mbtiPreviewContent[displayResult.type].en.callToAction
                            }
                          </p>
                        </PreviewCallToAction>
                      )}
                    </AnalysisPreview>
                  )}
                </div>
                {/* Only show premium actions if premium mode is enabled */}
                {ENABLE_PREMIUM_MODE && (
                  <div>                  
                    <AIAnalysisActions>
                      {!isPremiumUnlocked ? (
                        <PremiumButton onClick={handlePremiumUnlock}>
                          <FontAwesomeIcon icon={faLock} />
                          {language === 'zh' ? '解鎖完整報告' : 'Unlock Full Report'}
                        </PremiumButton>
                      ) : (
                          <div style={{ width: '100%', textAlign: 'center' }}>
                            {isGeneratingAnalysis ? (
                              <div>
                                <div style={{ marginBottom: '1rem' }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {language === 'zh' ? '正在生成AI分析報告...' : 'Generating AI Analysis Report...'}
                                  </Typography>
                                  <Typography variant="h6" color="primary" style={{ marginTop: '0.5rem' }}>
                                    {Math.round(analysisProgress)}%
                                  </Typography>
                                </div>
                                <AIAnalysisProgressBar progress={analysisProgress}>
                                  <div className="progress-fill" />
                                </AIAnalysisProgressBar>
                              </div>
                            ) : analysisGenerationComplete ? (
                              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '10px' }}>
                                <DownloadButton onClick={handleDownloadClick}>
                                  <FontAwesomeIcon icon={faDownload} />
                                  {language === 'zh' ? '下載完整報告' : 'Download Full Report'}
                                </DownloadButton>
                                <ViewReportButton onClick={handleViewReport}>
                                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                                  {language === 'zh' ? '查看報告' : 'View Report'}
                                </ViewReportButton>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <Button 
                                  onClick={generateAIAnalysis} 
                                  variant="contained" 
                                  color="primary"
                                  disabled={isGeneratingAnalysis}
                                >
                                  <FontAwesomeIcon icon={faBrain} />
                                  {language === 'zh' ? '生成AI分析' : 'Generate AI Analysis'}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                    </AIAnalysisActions>
                  </div>
                )}
              {analysisError && (
                <ErrorMessage>
                  {analysisError}
                </ErrorMessage>
              )}
            </AIAnalysisContent>
          </AIAnalysisSection>
          {/* Celebrities */}
          <CelebsSection>
            <CelebsTitle>{language === 'zh' ? '名家名人' : 'Famous People'}</CelebsTitle>
            {displayResult.celebrities && displayResult.celebrities.map((celeb, index) => (
              <CelebCard key={index}>
                <CelebAvatar>{celeb.name ? celeb.name.charAt(0) : ''}</CelebAvatar>
                <CelebInfo>
                  <CelebName>{celeb.name}</CelebName>
                  <CelebDescription>
                    {celeb.description && typeof celeb.description === 'object'
                      ? (celeb.description[language.toLowerCase()] || celeb.description.en)
                      : celeb.description}
                  </CelebDescription>
                </CelebInfo>
              </CelebCard>
            ))}
          </CelebsSection>
        </ResultCard>
      </Container>
      {/* Add PaymentModal at the end, before closing Container - only if premium mode is enabled */}
      {ENABLE_PREMIUM_MODE && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          mbtiType={displayResult?.type}
        />
      )}

      {/* Email Collection Modal for AI Analysis - only if premium mode is enabled */}
      {ENABLE_PREMIUM_MODE && showEmailModal && (
        <div style={{
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
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#D2691E' }}>
              {language === 'zh' ? '電子郵件確認' : 'Email Confirmation'}
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              {language === 'zh' 
                ? '請確認或更新您的電子郵件地址，AI分析報告將發送到此郵箱。'
                : 'Please confirm or update your email address. The AI analysis report will be sent to this email.'
              }
            </p>
            <input
              type="email"
              placeholder={language === 'zh' ? '輸入您的電子郵件' : 'Enter your email'}
              value={analysisEmail}
              onChange={(e) => setAnalysisEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '1rem'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                onClick={handleEmailModalClose}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                {language === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={handleAnalysisEmailSubmit}
                disabled={!analysisEmail.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#D2691E',
                  color: 'white',
                  cursor: 'pointer',
                  opacity: analysisEmail.trim() ? 1 : 0.5
                }}
              >
                {language === 'zh' ? '生成分析' : 'Generate Analysis'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add the Download Format Selection Modal - only if premium mode is enabled */}
      {ENABLE_PREMIUM_MODE && showDownloadModal && (
        <DownloadModal>
          <DownloadModalContent>
            <DownloadModalTitle>
              {language === 'zh' ? '選擇下載格式' : 'Choose Download Format'}
            </DownloadModalTitle>
            
            <DownloadOptions>
              <DownloadOption 
                onClick={handlePDFDownload}
                disabled={isPDFGenerating || isHTMLGenerating}
                style={{
                  opacity: (isPDFGenerating || isHTMLGenerating) ? 0.6 : 1,
                  cursor: (isPDFGenerating || isHTMLGenerating) ? 'not-allowed' : 'pointer'
                }}
              >
                <PDFIcon>
                  {isPDFGenerating ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faFilePdf} />
                  )}
                </PDFIcon>
                <DownloadOptionText>
                  <DownloadOptionTitle>
                    {language === 'zh' ? 'PDF 格式' : 'PDF Format'}
                  </DownloadOptionTitle>
                  <DownloadOptionDescription>
                    {isPDFGenerating 
                      ? (language === 'zh' ? '正在生成PDF...' : 'Generating PDF...')
                      : (language === 'zh' 
                          ? '適合打印和離線閱讀，保持格式完整'
                          : 'Perfect for printing and offline reading, maintains formatting'
                        )
                    }
                  </DownloadOptionDescription>
                </DownloadOptionText>
              </DownloadOption>
              
              <DownloadOption 
                onClick={handleHTMLDownload}
                disabled={isPDFGenerating || isHTMLGenerating}
                style={{
                  opacity: (isPDFGenerating || isHTMLGenerating) ? 0.6 : 1,
                  cursor: (isPDFGenerating || isHTMLGenerating) ? 'not-allowed' : 'pointer'
                }}
              >
                <HTMLIcon>
                  {isHTMLGenerating ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faFileCode} />
                  )}
                </HTMLIcon>
                <DownloadOptionText>
                  <DownloadOptionTitle>
                    {language === 'zh' ? 'HTML 格式' : 'HTML Format'}
                  </DownloadOptionTitle>
                  <DownloadOptionDescription>
                    {isHTMLGenerating 
                      ? (language === 'zh' ? '正在生成HTML...' : 'Generating HTML...')
                      : (language === 'zh' 
                          ? '可在瀏覽器中打開，支持互動元素'
                          : 'Open in browser, supports interactive elements'
                        )
                    }
                  </DownloadOptionDescription>
                </DownloadOptionText>
              </DownloadOption>
            </DownloadOptions>
            
            <ModalButtons>
              <CancelButton 
                onClick={handleCloseDownloadModal}
                disabled={isPDFGenerating || isHTMLGenerating}
                style={{
                  opacity: (isPDFGenerating || isHTMLGenerating) ? 0.6 : 1,
                  cursor: (isPDFGenerating || isHTMLGenerating) ? 'not-allowed' : 'pointer'
                }}
              >
                {language === 'zh' ? '取消' : 'Cancel'}
              </CancelButton>
            </ModalButtons>
          </DownloadModalContent>
        </DownloadModal>
      )}
    </ResultsPage>
  );
};

export default Results; 
