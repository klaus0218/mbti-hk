// MBTI Calculator Utility - Updated for 4-point scale
// Calculates MBTI personality type based on user responses with new scoring system

const calculateMBTI = (responses, questionsData) => {
  // Initialize scores for each dimension
  const scores = {
    E: 0, I: 0, // Extroversion vs Introversion
    S: 0, N: 0, // Sensing vs Intuition
    T: 0, F: 0, // Thinking vs Feeling
    J: 0, P: 0  // Judging vs Perceiving
  };

  // Create a map of questions for easy lookup
  const questionMap = {};
  questionsData.sections.forEach(section => {
    section.questions.forEach(q => {
      questionMap[q.questionId] = q;
    });
  });

  // Process each response with new 4-point scoring system
  responses.forEach(response => {
    const question = questionMap[response.questionId];
    if (!question) return;

    const { category, leftType, rightType } = question;
    const answer = response.answer; // 1-4 scale

    // New scoring system:
    // 1 (Strongly Left) = 1.0 point to left type
    // 2 (Slightly Left) = 0.5 point to left type  
    // 3 (Slightly Right) = 0.5 point to right type
    // 4 (Strongly Right) = 1.0 point to right type

    let leftScore = 0;
    let rightScore = 0;

    switch (answer) {
      case 1: // Strongly Left
        leftScore = 1.0;
        break;
      case 2: // Slightly Left
        leftScore = 0.5;
        break;
      case 3: // Slightly Right
        rightScore = 0.5;
        break;
      case 4: // Strongly Right
        rightScore = 1.0;
        break;
    }

    // Apply scores to the appropriate MBTI dimensions
    if (category === 'EI') {
      scores[leftType] += leftScore;
      scores[rightType] += rightScore;
    } else if (category === 'SN') {
      scores[leftType] += leftScore;
      scores[rightType] += rightScore;
    } else if (category === 'FT' || category === 'TF') {
      scores[leftType] += leftScore;
      scores[rightType] += rightScore;
    } else if (category === 'JP' || category === 'PJ') {
      scores[leftType] += leftScore;
      scores[rightType] += rightScore;
    }
  });

  // Normalize scores to percentages
  const totalEI = scores.E + scores.I || 1;
  const totalSN = scores.S + scores.N || 1;
  const totalTF = scores.T + scores.F || 1;
  const totalJP = scores.J + scores.P || 1;

  const normalizedScores = {
    E: Math.round((scores.E / totalEI) * 100),
    I: Math.round((scores.I / totalEI) * 100),
    S: Math.round((scores.S / totalSN) * 100),
    N: Math.round((scores.N / totalSN) * 100),
    T: Math.round((scores.T / totalTF) * 100),
    F: Math.round((scores.F / totalTF) * 100),
    J: Math.round((scores.J / totalJP) * 100),
    P: Math.round((scores.P / totalJP) * 100)
  };

  // Determine type preferences
  const dimensions = {
    EI: scores.E >= scores.I ? 'E' : 'I',
    SN: scores.S >= scores.N ? 'S' : 'N',
    TF: scores.T >= scores.F ? 'T' : 'F',
    JP: scores.J >= scores.P ? 'J' : 'P'
  };

  // Calculate confidence levels (how strong each preference is)
  const confidence = {
    EI: Math.abs(normalizedScores.E - normalizedScores.I),
    SN: Math.abs(normalizedScores.S - normalizedScores.N),
    TF: Math.abs(normalizedScores.T - normalizedScores.F),
    JP: Math.abs(normalizedScores.J - normalizedScores.P)
  };

  // Construct the 4-letter type
  const type = dimensions.EI + dimensions.SN + dimensions.TF + dimensions.JP;

  // Get type description and celebrities
  const mbtiTypes = require('../data/mbtiTypes');
  const celebrities = require('../data/celebrities.json');
  
  const description = mbtiTypes[type]?.shortDescription || 'Type description not available';
  const typeCelebrities = celebrities.celebrities[type] || [];
  const typeInfo = celebrities.typeDescriptions[type] || {};

  console.log(scores)
  console.log(confidence)
  console.log(dimensions)
  return {
    type,
    scores: normalizedScores,
    dimensions,
    confidence,
    description,
    rawScores: scores,
    celebrities: typeCelebrities.slice(0, 3), // Return top 3 celebrities
    typeInfo,
    totalResponses: responses.length
  };
};

// Helper function to validate responses completeness for new question format
const validateResponses = (responses, questionsData) => {
  const totalQuestions = questionsData.sections.reduce((total, section) => 
    total + section.questions.length, 0
  );
  
  const validation = {
    isComplete: responses.length >= totalQuestions,
    completionPercentage: Math.round((responses.length / totalQuestions) * 100),
    missingQuestions: totalQuestions - responses.length,
    totalQuestions
  };

  return validation;
};

// Helper function to get dimension breakdown with new scoring
const getDimensionBreakdown = (responses, questionsData) => {
  const breakdown = {
    EI: { responses: 0, totalScore: 0, avgStrength: 0 },
    SN: { responses: 0, totalScore: 0, avgStrength: 0 },
    TF: { responses: 0, totalScore: 0, avgStrength: 0 },
    JP: { responses: 0, totalScore: 0, avgStrength: 0 }
  };

  const questionMap = {};
  questionsData.sections.forEach(section => {
    section.questions.forEach(q => {
      questionMap[q.questionId] = q;
    });
  });

  // Count responses per dimension
  responses.forEach(response => {
    const question = questionMap[response.questionId];
    if (!question) return;

    const category = question.category.replace(/[^A-Z]/g, ''); // Clean category (remove extra chars)
    if (breakdown[category]) {
      breakdown[category].responses++;
      
      // Calculate strength of response (how far from neutral)
      // 1,4 = strong (1.0), 2,3 = weak (0.5)
      const strength = (response.answer === 1 || response.answer === 4) ? 1.0 : 0.5;
      breakdown[category].totalScore += strength;
    }
  });

  // Calculate averages
  Object.keys(breakdown).forEach(dimension => {
    if (breakdown[dimension].responses > 0) {
      breakdown[dimension].avgStrength = 
        breakdown[dimension].totalScore / breakdown[dimension].responses;
    }
  });

  return breakdown;
};

// Helper function to get recommendations based on type
const getTypeRecommendations = (type) => {
  const recommendations = {
    INTJ: {
      careers: ['Software Engineer', 'Research Scientist', 'Investment Banker', 'Management Consultant'],
      strengths: ['Strategic thinking', 'Long-term planning', 'Independent work', 'Problem solving']
    },
    INTP: {
      careers: ['Software Developer', 'Research Scientist', 'University Professor', 'Data Analyst'],
      strengths: ['Logical analysis', 'Creative problem solving', 'Independent thinking', 'Innovation']
    },
    ENTJ: {
      careers: ['CEO', 'Management Consultant', 'Investment Banker', 'Lawyer'],
      strengths: ['Leadership', 'Strategic planning', 'Decision making', 'Goal achievement']
    },
    ENTP: {
      careers: ['Entrepreneur', 'Marketing Manager', 'Journalist', 'Consultant'],
      strengths: ['Innovation', 'Adaptability', 'Communication', 'Creative thinking']
    },
    INFJ: {
      careers: ['Counselor', 'Social Worker', 'Teacher', 'Non-profit Manager'],
      strengths: ['Empathy', 'Long-term vision', 'Helping others', 'Creative insight']
    },
    INFP: {
      careers: ['Writer', 'Counselor', 'Artist', 'Social Worker'],
      strengths: ['Creativity', 'Empathy', 'Authenticity', 'Value-driven work']
    },
    ENFJ: {
      careers: ['Teacher', 'Social Worker', 'Manager', 'Counselor'],
      strengths: ['Leadership', 'Communication', 'Empathy', 'Team building']
    },
    ENFP: {
      careers: ['Marketing', 'Public Relations', 'Counselor', 'Entrepreneur'],
      strengths: ['Enthusiasm', 'Creativity', 'Communication', 'Inspiration']
    },
    ISTJ: {
      careers: ['Accountant', 'Project Manager', 'Administrator', 'Engineer'],
      strengths: ['Organization', 'Reliability', 'Attention to detail', 'Follow-through']
    },
    ISFJ: {
      careers: ['Nurse', 'Teacher', 'Social Worker', 'Administrator'],
      strengths: ['Caring', 'Loyalty', 'Attention to detail', 'Service orientation']
    },
    ESTJ: {
      careers: ['Manager', 'Administrator', 'Sales Manager', 'Military Officer'],
      strengths: ['Leadership', 'Organization', 'Efficiency', 'Decision making']
    },
    ESFJ: {
      careers: ['Teacher', 'Nurse', 'Social Worker', 'Event Planner'],
      strengths: ['Interpersonal skills', 'Organization', 'Helpfulness', 'Team work']
    },
    ISTP: {
      careers: ['Engineer', 'Mechanic', 'Pilot', 'Software Developer'],
      strengths: ['Problem solving', 'Hands-on skills', 'Adaptability', 'Independence']
    },
    ISFP: {
      careers: ['Artist', 'Musician', 'Counselor', 'Photographer'],
      strengths: ['Creativity', 'Empathy', 'Flexibility', 'Artistic expression']
    },
    ESTP: {
      careers: ['Sales', 'Marketing', 'Entertainment', 'Emergency Services'],
      strengths: ['Action-oriented', 'Adaptability', 'Communication', 'Crisis management']
    },
    ESFP: {
      careers: ['Entertainment', 'Sales', 'Event Planning', 'Social Work'],
      strengths: ['Enthusiasm', 'People skills', 'Adaptability', 'Team spirit']
    }
  };

  return recommendations[type] || {
    careers: ['Explore various fields'],
    strengths: ['Unique combination of traits']
  };
};

module.exports = {
  calculateMBTI,
  validateResponses,
  getDimensionBreakdown,
  getTypeRecommendations
}; 
