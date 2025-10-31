import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as api from '../services/api';

// Initial state
const initialState = {
  sessionId: null,
  userId: null,
  status: 'idle', // idle, active, completing, completed, error
  currentQuestionIndex: 0,
  totalQuestions: 0,
  responses: {},
  progress: 0,
  isLoading: false,
  error: null,
  lastActivity: null,
  demographics: null,
  language: 'zh',
  result: null // Add result property
};

// Action types
const ActionTypes = {
  START_SESSION: 'START_SESSION',
  SET_SESSION: 'SET_SESSION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TOTAL_QUESTIONS: 'SET_TOTAL_QUESTIONS',
  ADD_RESPONSE: 'ADD_RESPONSE',
  UPDATE_RESPONSE: 'UPDATE_RESPONSE',
  DELETE_RESPONSE: 'DELETE_RESPONSE',
  SET_PROGRESS: 'SET_PROGRESS',
  SET_DEMOGRAPHICS: 'SET_DEMOGRAPHICS',
  SET_LANGUAGE: 'SET_LANGUAGE',
  COMPLETE_SESSION: 'COMPLETE_SESSION',
  RESET_SESSION: 'RESET_SESSION',
  UPDATE_ACTIVITY: 'UPDATE_ACTIVITY',
  SET_RESULT: 'SET_RESULT' // Add SET_RESULT action type
};

// Reducer
const sessionReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.START_SESSION:
      return {
        ...state,
        sessionId: action.payload.sessionId,
        userId: action.payload.userId,
        status: 'active',
        isLoading: false,
        error: null,
        lastActivity: new Date().toISOString()
      };

    case ActionTypes.SET_SESSION:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: null
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ActionTypes.SET_TOTAL_QUESTIONS:
      return {
        ...state,
        totalQuestions: action.payload
      };

    case ActionTypes.ADD_RESPONSE:
      const newResponses = {
        ...state.responses,
        [action.payload.questionId]: action.payload
      };
      const responseCount = Object.keys(newResponses).length;
      return {
        ...state,
        responses: newResponses,
        progress: state.totalQuestions ? (responseCount / state.totalQuestions) * 100 : 0,
        currentQuestionIndex: responseCount,
        lastActivity: new Date().toISOString()
      };

    case ActionTypes.UPDATE_RESPONSE:
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.payload.questionId]: action.payload
        },
        lastActivity: new Date().toISOString()
      };

    case ActionTypes.DELETE_RESPONSE:
      const updatedResponses = { ...state.responses };
      delete updatedResponses[action.payload.questionId];
      const remainingCount = Object.keys(updatedResponses).length;
      return {
        ...state,
        responses: updatedResponses,
        progress: state.totalQuestions ? (remainingCount / state.totalQuestions) * 100 : 0,
        currentQuestionIndex: remainingCount,
        lastActivity: new Date().toISOString()
      };

    case ActionTypes.SET_PROGRESS:
      return {
        ...state,
        progress: action.payload
      };

    case ActionTypes.SET_DEMOGRAPHICS:
      return {
        ...state,
        demographics: action.payload,
        lastActivity: new Date().toISOString()
      };

    case ActionTypes.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };

    case ActionTypes.COMPLETE_SESSION:
      return {
        ...state,
        status: 'completed',
        lastActivity: new Date().toISOString()
      };

    case ActionTypes.RESET_SESSION:
      return {
        ...initialState,
        language: state.language // Preserve language preference
      };

    case ActionTypes.UPDATE_ACTIVITY:
      return {
        ...state,
        lastActivity: new Date().toISOString()
      };

    case ActionTypes.SET_RESULT:
      return {
        ...state,
        result: action.payload,
        lastActivity: new Date().toISOString()
      };

    default:
      return state;
  }
};

// Context
const SessionContext = createContext();

// Provider component
export const SessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  // Auto-save to localStorage
  useEffect(() => {
    if (state.sessionId) {
      localStorage.setItem('mbti_session', JSON.stringify({
        sessionId: state.sessionId,
        userId: state.userId,
        responses: state.responses,
        demographics: state.demographics,
        language: state.language,
        lastActivity: state.lastActivity
      }));
    }
  }, [state.sessionId, state.userId, state.responses, state.demographics, state.language, state.lastActivity]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('mbti_session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        // Check if session is not too old (24 hours)
        const lastActivity = new Date(sessionData.lastActivity);
        const now = new Date();
        const hoursDiff = (now - lastActivity) / (1000 * 60 * 60);
        
        if (hoursDiff < 24 && sessionData.sessionId) {
          dispatch({
            type: ActionTypes.SET_SESSION,
            payload: {
              sessionId: sessionData.sessionId,
              userId: sessionData.userId,
              responses: sessionData.responses || {},
              demographics: sessionData.demographics,
              language: sessionData.language || 'zh',
              status: 'active'
            }
          });
        } else {
          // Clear old session
          localStorage.removeItem('mbti_session');
        }
      } catch (error) {
        console.error('Failed to load saved session:', error);
        localStorage.removeItem('mbti_session');
      }
    }
  }, []);

  // Helper function to transform API result to component-expected format
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
    // These would normally come from demographic analysis of all users
    const mockPopulationStats = {
      totalPopulation: 3.4, // Mock percentage of total population
      maleRatio: 52.1,     // Mock male percentage for this type
      femaleRatio: 47.9    // Mock female percentage for this type
    };

    return {
      type: mbtiType,
      typeName: typeInfo.title,
      description: typeInfo.description,
      scores: transformedScores,
      celebrities: transformedCelebrities,
      recommendations,
      stats: mockPopulationStats,  // Maps to what Results.js expects
      statistics,                  // Keep original statistics
      compatibility,
      rawScores: scores.raw,
      normalizedScores: scores.normalized,
      dimensions: apiResult.dimensions,
      confidence: apiResult.confidence,
      typeStrength: apiResult.typeStrength,
      demographics: apiResult.demographics || {} // Include demographics data
    };
  };

  // Actions
  const actions = {
    async createSession(userData = {}) {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      try {
        const response = await api.createSession(userData);
        
        const sessionData = {
          sessionId: response.data.sessionId,
          userId: response.data.sessionId, // Use sessionId as userId for now
          status: 'active',
          responses: {},
          demographics: {},
          progress: 0,
          currentQuestionIndex: 0,
          totalQuestions: 0,
          language: state.language,
          result: null,
          error: null,
          lastActivity: new Date().toISOString()
        };
        
        dispatch({ type: ActionTypes.SET_SESSION, payload: sessionData });
        localStorage.setItem('mbti_session', JSON.stringify(sessionData));
        
        return { sessionId: response.data.sessionId, ...response.data };
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    // Set demographics data in local state
    setDemographics(demographics) {
      dispatch({ type: ActionTypes.SET_DEMOGRAPHICS, payload: demographics });
    },

    async calculateResults(overrideSessionId = null, userData = null) {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      try {
        // Use override sessionId if provided, otherwise use state sessionId
        const sessionIdToUse = overrideSessionId || state.sessionId;
        
        if (!sessionIdToUse) {
          throw new Error('No session ID available for calculating results');
        }
        
        // Use provided userData or fall back to state data
        const dataToSend = userData || {
          userId: state.userId,
          demographics: state.demographics,
          language: state.language
        };
        
        const response = await api.calculateResults(sessionIdToUse, dataToSend);
        
        // Transform the result data to match component expectations
        const transformedResult = transformResultData(response.data.result);
        
        // Store the transformed result data in state
        dispatch({ type: ActionTypes.SET_RESULT, payload: transformedResult });
        dispatch({ type: ActionTypes.COMPLETE_SESSION });
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        
        return response;
      } catch (error) {
        console.error('Failed to calculate results:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    async validateSession(sessionId) {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      try {
        const response = await api.validateSession(sessionId);
        dispatch({
          type: ActionTypes.SET_SESSION,
          payload: {
            sessionId: response.data.sessionId,
            userId: response.data.userId,
            status: response.data.status || 'active'
          }
        });
        return response.data;
      } catch (error) {
        console.error('Failed to validate session:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    async submitResponse(responseData, overrideSessionId = null) {
      try {
        // Use override sessionId if provided, otherwise use state sessionId
        const sessionIdToUse = overrideSessionId || state.sessionId;
        
        if (!sessionIdToUse) {
          throw new Error('No session ID available for submitting response');
        }

        // Add response time if not provided
        if (!responseData.responseTime && state.lastActivity) {
          const lastTime = new Date(state.lastActivity);
          const now = new Date();
          responseData.responseTime = now - lastTime;
        }

        const response = await api.submitResponse(sessionIdToUse, responseData);
        
        dispatch({
          type: ActionTypes.ADD_RESPONSE,
          payload: responseData
        });
        
        return response;
      } catch (error) {
        console.error('Failed to submit response:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    async submitAllResponses(allResponses, overrideSessionId = null, language = 'zh') {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      try {
        // Use override sessionId if provided, otherwise use state sessionId
        const sessionIdToUse = overrideSessionId || state.sessionId;
        
        if (!sessionIdToUse) {
          throw new Error('No session ID available for submitting responses');
        }

        // Prepare responses for bulk submission
        const responses = Object.values(allResponses);
        
        // Add default response time if not provided
        responses.forEach(responseData => {
          if (!responseData.responseTime) {
            responseData.responseTime = 2000; // Default 2 seconds per question
          }
        });

        // Submit all responses in a single bulk API call
        const result = await api.submitBulkResponses(sessionIdToUse, allResponses, language);
        
        // Add all responses to local state
        responses.forEach(responseData => {
          dispatch({
            type: ActionTypes.ADD_RESPONSE,
            payload: responseData
          });
        });
        
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        return result;
      } catch (error) {
        console.error('Failed to submit all responses:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        throw error;
      }
    },

    async updateResponse(questionId, responseData) {
      try {
        const response = await api.updateResponse(state.sessionId, questionId, responseData);
        
        dispatch({
          type: ActionTypes.UPDATE_RESPONSE,
          payload: { questionId, ...responseData }
        });
        
        return response;
      } catch (error) {
        console.error('Failed to update response:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    async deleteResponse(questionId) {
      try {
        const response = await api.deleteResponse(state.sessionId, questionId);
        
        dispatch({
          type: ActionTypes.DELETE_RESPONSE,
          payload: { questionId }
        });
        
        return response;
      } catch (error) {
        console.error('Failed to delete response:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    setTotalQuestions(total) {
      dispatch({
        type: ActionTypes.SET_TOTAL_QUESTIONS,
        payload: total
      });
    },

    setLanguage(language) {
      dispatch({
        type: ActionTypes.SET_LANGUAGE,
        payload: language
      });
    },

    resetSession() {
      localStorage.removeItem('mbti_session');
      // Also clear stored responses when resetting session
      if (state.sessionId) {
        try {
          localStorage.removeItem(`mbti_responses_${state.sessionId}`);
        } catch (error) {
          console.error('Failed to clear stored responses during reset:', error);
        }
      }
      dispatch({ type: ActionTypes.RESET_SESSION });
    },

    updateActivity() {
      dispatch({ type: ActionTypes.UPDATE_ACTIVITY });
    },

    clearError() {
      dispatch({ type: ActionTypes.SET_ERROR, payload: null });
    }
  };

  // Computed values
  const computedValues = {
    isSessionActive: state.status === 'active',
    isSessionCompleted: state.status === 'completed',
    hasResponses: Object.keys(state.responses).length > 0,
    responseCount: Object.keys(state.responses).length,
    isReadyToCalculate: state.totalQuestions > 0 && Object.keys(state.responses).length >= state.totalQuestions,
    progressPercentage: Math.round(state.progress),
    estimatedTimeRemaining: state.totalQuestions && state.responseCount ? 
      ((state.totalQuestions - state.responseCount) * 2) : null // Estimate 2 minutes per question
  };

  const value = {
    // State
    ...state,
    // Computed values
    ...computedValues,
    // Actions
    ...actions
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook to use session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

// Higher-order component for session protection
export const withSession = (Component) => {
  return function SessionProtectedComponent(props) {
    const session = useSession();
    
    if (!session.sessionId) {
      // Redirect to start page or show session creation
      window.location.href = '/';
      return null;
    }
    
    return <Component {...props} session={session} />;
  };
};

export default SessionContext; 
