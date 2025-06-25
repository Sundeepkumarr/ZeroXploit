import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const vulnerabilityAPI = {
  scanTarget: async (target: any) => {
    const response = await api.post('/scan/start', target);
    return response.data;
  },
  
  getScanResults: async (scanId: string) => {
    const response = await api.get(`/scan/${scanId}/results`);
    return response.data;
  },
  
  getAllScans: async () => {
    const response = await api.get('/scan/all');
    return response.data;
  },
  
  getVulnerabilities: async () => {
    const response = await api.get('/vulnerabilities');
    return response.data;
  },
  
  getLiveThreats: async () => {
    const response = await api.get('/threats/live');
    return response.data;
  },
  
  blockThreat: async (threatId: string) => {
    const response = await api.post(`/threats/${threatId}/block`);
    return response.data;
  },
  
  generateReport: async (reportData: any) => {
    const response = await api.post('/reports/generate', reportData);
    return response.data;
  },
  
  getSystemHealth: async () => {
    const response = await api.get('/system/health');
    return response.data;
  }
};

export default api;