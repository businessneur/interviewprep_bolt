import axios from 'axios';
import { convertKeysToSnake, convertKeysToCamel } from '../utils/caseConversion';
import { InterviewConfig, AnalyticsData, InterviewResponse } from '../types';

const PYTHON_API_BASE = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000/api';
const API_BASE_URL = PYTHON_API_BASE;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to convert camelCase to snake_case
apiClient.interceptors.request.use((config) => {
  if (config.data) {
    config.data = convertKeysToSnake(config.data);
  }
  return config;
});

// Response interceptor to convert snake_case to camelCase
apiClient.interceptors.response.use((response) => {
  if (response.data) {
    response.data = convertKeysToCamel(response.data);
  }
  return response;
});

export interface QuestionGenerationRequest {
  config: InterviewConfig;
  previousQuestions?: string[];
  previousResponses?: InterviewResponse[];
  questionNumber?: number;
}

export interface FollowUpRequest {
  question: string;
  response: string;
  config: InterviewConfig;
}

export interface ResponseAnalysisRequest {
  question: string;
  response: string;
  config: InterviewConfig;
}

export interface AnalyticsRequest {
  responses: InterviewResponse[];
  config: InterviewConfig;
}

export class APIService {
  static async generateQuestion(request: QuestionGenerationRequest): Promise<string> {
    try {
      const response = await apiClient.post('/generate-question', request);
      return response.data.question;
    } catch (error) {
      console.error('Error generating question:', error);
      throw new Error('Failed to generate question. Please try again.');
    }
  }

  static async generateFollowUp(request: FollowUpRequest): Promise<string> {
    try {
      const response = await apiClient.post('/generate-followup', request);
      return response.data.followUp;
    } catch (error) {
      console.error('Error generating follow-up:', error);
      throw new Error('Failed to generate follow-up question.');
    }
  }

  static async analyzeResponse(request: ResponseAnalysisRequest): Promise<any> {
    try {
      const response = await apiClient.post('/analyze-response', request);
      return response.data.analysis;
    } catch (error) {
      console.error('Error analyzing response:', error);
      throw new Error('Failed to analyze response.');
    }
  }

  static async generateAnalytics(request: AnalyticsRequest): Promise<AnalyticsData> {
    try {
      const response = await apiClient.post('/generate-analytics', request);
      return response.data.analytics;
    } catch (error) {
      console.error('Error generating analytics:', error);
      throw new Error('Failed to generate analytics.');
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health');
      return response.data.status === 'OK' || response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // Python backend specific endpoints
  static async startInterview(config: InterviewConfig): Promise<any> {
    try {
      const response = await apiClient.post('/interview/start', { config });
      return response.data;
    } catch (error) {
      console.error('Error starting interview:', error);
      throw new Error('Failed to start interview.');
    }
  }

  static async submitAnswer(interviewId: string, questionId: string, answer: string): Promise<any> {
    try {
      const response = await apiClient.post('/interview/submit-answer', {
        interviewId,
        questionId,
        answer
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw new Error('Failed to submit answer.');
    }
  }

  static async getNextQuestion(interviewId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/interview/${interviewId}/next-question`);
      return response.data;
    } catch (error) {
      console.error('Error getting next question:', error);
      throw new Error('Failed to get next question.');
    }
  }

  static async endInterview(interviewId: string): Promise<any> {
    try {
      const response = await apiClient.post(`/interview/${interviewId}/end`);
      return response.data;
    } catch (error) {
      console.error('Error ending interview:', error);
      throw new Error('Failed to end interview.');
    }
  }

  static async getInterviewResults(interviewId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/interview/${interviewId}/results`);
      return response.data;
    } catch (error) {
      console.error('Error getting interview results:', error);
      throw new Error('Failed to get interview results.');
    }
  }

  // Generic HTTP methods
  static async get(url: string): Promise<any> {
    try {
      return await apiClient.get(url);
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  }

  static async post(url: string, data?: any): Promise<any> {
    try {
      console.log(`API POST ${url}`);
      console.log('API POST Data:', JSON.stringify(data, null, 2));
      return await apiClient.post(url, data);
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  }

  static async put(url: string, data?: any): Promise<any> {
    try {
      return await apiClient.put(url, data);
    } catch (error) {
      console.error(`PUT ${url} failed:`, error);
      throw error;
    }
  }

  static async delete(url: string): Promise<any> {
    try {
      return await apiClient.delete(url);
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error);
      throw error;
    }
  }
}