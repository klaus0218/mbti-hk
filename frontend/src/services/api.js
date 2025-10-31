// API service for communicating with the backend
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Create axios-like wrapper
const createRequest = (method) => async (url, data = null, options = {}) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
  };

  // Only add body for non-GET requests
  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  const apiUrl = `${API_BASE_URL}${url}`;
  const response = await fetch(apiUrl, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  const responseData = await response.json();
  
  return {
    data: responseData,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  };
};

const api = {
  get: createRequest('GET'),
  post: createRequest('POST'),
  put: createRequest('PUT'),
  delete: createRequest('DELETE'),
  patch: createRequest('PATCH'),
};

// Admin API
export const adminApi = {
  login: async (username, password) => {
    const response = await api.post('/api/admin/login', { username, password });
    return response.data;
  },

  verifyToken: async (token) => {
    const response = await api.get('/api/admin/verify', null, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  getStats: async (token, timeRange) => {
    const response = await api.get(`/api/admin/stats?timeRange=${timeRange}`, null, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  getRecords: async (token, { page = 1, search = '', limit = 10 } = {}) => {
    const response = await api.get(
      `/api/admin/records?page=${page}&search=${search}&limit=${limit}`,
      null,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    return response.data;
  },

  getRecordDetail: async (token, sessionId) => {
    const response = await api.get(`/api/admin/records/${sessionId}`, null, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  deleteRecord: async (token, sessionId) => {
    const response = await api.delete(`/api/admin/records/${sessionId}`, null, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  getMBTIDistribution: async (token, filters = {}) => {
    const params = new URLSearchParams();
    params.append('gender', filters.gender || '');
    if (filters.industries) params.append('industries', filters.industries.join(','));
    if (filters.ageRanges) params.append('ageRanges', filters.ageRanges.join(','));

    const response = await api.get(
      `/api/admin/mbti-distribution?${params.toString()}`,
      null,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    return response.data;
  },

  getTestResults: async (token, { page = 1, search = '', limit = 10 }) => {
    const response = await api.get(`/api/admin/records?page=${page}&search=${search}&limit=${limit}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },
};

// User session management
export const createSession = async (userData = {}) => {
  try {
    const response = await api.post('/api/auth/session', userData);
    return response;
  } catch (error) {
    console.error('Failed to create session:', error);
    throw error;
  }
};

export const validateSession = async (sessionId) => {
  try {
    const response = await api.get(`/api/auth/session/${sessionId}`);
    return response;
  } catch (error) {
    console.error('Failed to validate session:', error);
    throw error;
  }
};

// Questions API
export const getQuestions = async (language = 'zh') => {
  try {
    const response = await api.get(`/api/questions?lang=${language}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    throw error;
  }
};

export const getQuestionsSections = async (language = 'zh') => {
  try {
    const response = await api.get(`/api/questions/sections?lang=${language}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch question sections:', error);
    throw error;
  }
};

export const getQuestionsByCategory = async (category, language = 'zh') => {
  try {
    const response = await api.get(`/api/questions/category/${category}?lang=${language}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch questions by category:', error);
    throw error;
  }
};

export const getQuestionById = async (questionId, language = 'zh') => {
  try {
    const response = await api.get(`/api/questions/${questionId}?lang=${language}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch question:', error);
    throw error;
  }
};

export const getQuestionStats = async () => {
  try {
    const response = await api.get('/api/questions/stats/overview');
    return response;
  } catch (error) {
    console.error('Failed to fetch question statistics:', error);
    throw error;
  }
};

// Responses API
export const submitResponse = async (sessionId, responseData) => {
  try {
    const response = await api.post(`/api/responses/${sessionId}`, {
      questionId: responseData.questionId,
      answer: responseData.answer,
      category: responseData.category,
      selectedType: responseData.leftType || responseData.rightType,
      strength: responseData.answer === 1 || responseData.answer === 4 ? 1.0 : 0.5,
      sectionId: responseData.sectionId,
      language: responseData.language || 'zh',
      responseTime: responseData.responseTime,
      metadata: {
        timestamp: responseData.timestamp,
        userAgent: navigator.userAgent,
        questionVersion: '4-point-scale-v1'
      }
    });
    return response;
  } catch (error) {
    console.error('Failed to submit response:', error);
    throw error;
  }
};

// Submit multiple responses in bulk
export const submitBulkResponses = async (sessionId, responses, language = 'zh') => {
  try {
    const formattedResponses = Object.values(responses).map(responseData => ({
      questionId: responseData.questionId,
      answer: responseData.answer,
      category: responseData.category,
      leftType: responseData.leftType,
      rightType: responseData.rightType,
      sectionId: responseData.sectionId,
      timestamp: responseData.timestamp,
      responseTime: responseData.responseTime || 0
    }));

    const response = await api.post(`/api/responses/bulk/${sessionId}`, {
      responses: formattedResponses,
      language
    });
    return response;
  } catch (error) {
    console.error('Failed to submit bulk responses:', error);
    throw error;
  }
};

export const getResponses = async (sessionId) => {
  try {
    const response = await api.get(`/api/responses/${sessionId}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch responses:', error);
    throw error;
  }
};

export const updateResponse = async (sessionId, questionId, responseData) => {
  try {
    const response = await api.put(`/api/responses/${sessionId}/${questionId}`, responseData);
    return response;
  } catch (error) {
    console.error('Failed to update response:', error);
    throw error;
  }
};

export const deleteResponse = async (sessionId, questionId) => {
  try {
    const response = await api.delete(`/api/responses/${sessionId}/${questionId}`);
    return response;
  } catch (error) {
    console.error('Failed to delete response:', error);
    throw error;
  }
};

// Results API
export const calculateResults = async (sessionId, userData = {}) => {
  try {
    const response = await api.post(`/api/results/calculate/${sessionId}`, {
      userId: userData.userId,
      demographics: userData.demographics,
      language: userData.language || 'zh'
    });
    return response;
  } catch (error) {
    console.error('Failed to calculate results:', error);
    throw error;
  }
};

export const getResults = async (sessionId, language = 'zh') => {
  try {
    const response = await api.get(`/api/results/${sessionId}?lang=${language}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch results:', error);
    throw error;
  }
};

export const getSharedResults = async (shareId, language = 'zh') => {
  try {
    const response = await api.get(`/api/results/shared/${shareId}?lang=${language}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch shared results:', error);
    throw error;
  }
};

export const shareResults = async (sessionId, enable = true) => {
  try {
    const response = await api.post(`/api/results/${sessionId}/share`, { enable });
    return response;
  } catch (error) {
    console.error('Failed to update sharing settings:', error);
    throw error;
  }
};

export const getResultsDistribution = async () => {
  try {
    const response = await api.get('/api/results/stats/distribution');
    return response;
  } catch (error) {
    console.error('Failed to fetch results distribution:', error);
    throw error;
  }
};

export const getDetailedStats = async () => {
  try {
    const response = await api.get('/api/results/stats/detailed');
    return response;
  } catch (error) {
    console.error('Failed to fetch detailed statistics:', error);
    throw error;
  }
};

export const getUserResultHistory = async (userId, page = 1, limit = 10, language = 'zh') => {
  try {
    const response = await api.get(`/api/results/user/${userId}/history?page=${page}&limit=${limit}&lang=${language}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch user result history:', error);
    throw error;
  }
};

export const compareResults = async (sessionId1, sessionId2, language = 'zh') => {
  try {
    const response = await api.get(`/api/results/compare/${sessionId1}/${sessionId2}?lang=${language}`);
    return response;
  } catch (error) {
    console.error('Failed to compare results:', error);
    throw error;
  }
};

// Articles API
export const getArticles = async (language = 'zh') => {
  try {
    const response = await api.get(`/api/articles?lang=${language}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    throw error;
  }
};

export const getArticleById = async (articleId, language = 'zh') => {
  try {
    const response = await api.get(`/api/articles/${articleId}?lang=${language}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch article:', error);
    throw error;
  }
};

export const getArticlesByType = async (mbtiType, language = 'zh') => {
  try {
    const response = await api.get(`/api/articles/type/${mbtiType}?lang=${language}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch articles by type:', error);
    throw error;
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// AI Analysis API
export const aiAnalysisApi = {
  // Get existing AI analysis
  getAnalysis: async (sessionId, mbtiType) => {
    try {
      const response = await api.get(`/api/ai-analysis/get-analysis/${sessionId}/${mbtiType}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get AI analysis:', error);
      throw error;
    }
  },

  // Create AI analysis package
  createAnalysisPackage: async (requestData) => {
    try {
      const response = await api.post('/api/ai-analysis/create-package', requestData);
      return response.data;
    } catch (error) {
      console.error('Failed to create AI analysis package:', error);
      throw error;
    }
  },

  // Unlock premium content
  unlockPremiumContent: async (sessionId, mbtiType) => {
    try {
      const response = await api.post(`/api/ai-analysis/unlock-premium`, {
        sessionId,
        mbtiType
      });
      return response.data;
    } catch (error) {
      console.error('Failed to unlock premium content:', error);
      throw error;
    }
  }
};

export default {
  // Admin API
  admin: adminApi,
  
  // AI Analysis API
  aiAnalysis: aiAnalysisApi,
  
  // Session management
  createSession,
  validateSession,
  
  // Questions
  getQuestions,
  getQuestionsSections,
  getQuestionsByCategory,
  getQuestionById,
  getQuestionStats,
  
  // Responses
  submitResponse,
  submitBulkResponses,
  getResponses,
  updateResponse,
  deleteResponse,
  
  // Results
  calculateResults,
  getResults,
  getSharedResults,
  shareResults,
  getResultsDistribution,
  getDetailedStats,
  getUserResultHistory,
  compareResults,
  
  // Articles
  getArticles,
  getArticleById,
  getArticlesByType,
  
  // Utility
  healthCheck,
  
  // Direct API access
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,
  patch: api.patch
}; 
