import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

const api = axios.create({ baseURL: API_URL, timeout: 20000 });
api.interceptors.request.use(async (cfg) => {
  const token = await AsyncStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
export const errMsg = (e) =>
  e.response?.data?.message || (e.request ? 'Cannot reach the server. Check your connection.' : 'Something went wrong');
export default api;
