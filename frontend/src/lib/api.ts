import axios from 'axios';
import { supabase } from '../context/AuthContext';

const baseURL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use(async (config) => {
  try {
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        config.headers = config.headers || {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }
  } catch {}
  return config;
});
