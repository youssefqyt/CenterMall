import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const BACKEND_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Storage helper with fallback for web/environments where SecureStore isn't native
export const tokenStorage = {
  async getToken() {
    try {
      if (Platform.OS === 'web') {
        return typeof localStorage !== 'undefined' ? localStorage.getItem('cm_token') : null;
      }
      return await SecureStore.getItemAsync('cm_token');
    } catch {
      return null;
    }
  },
  async setToken(token) {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') localStorage.setItem('cm_token', token);
      } else {
        await SecureStore.setItemAsync('cm_token', token);
      }
    } catch (err) {
      console.warn('Could not save token:', err);
    }
  },
  async removeToken() {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') localStorage.removeItem('cm_token');
      } else {
        await SecureStore.deleteItemAsync('cm_token');
      }
    } catch (err) {
      console.warn('Could not remove token:', err);
    }
  }
};

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

