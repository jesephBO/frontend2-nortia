import httpClient from './httpClient';
import { ENDPOINTS } from '../config/apiGateway';

export const authService = {
  async login({ email, password }) {
    const { data } = await httpClient.post(ENDPOINTS.auth.login, { email, password });
    return data; // { accessToken, refreshToken, user }
  },

  async register({ name, company, email, password }) {
    const { data } = await httpClient.post(ENDPOINTS.auth.register, {
      name,
      company,
      email,
      password,
    });
    return data;
  },

  async me() {
    const { data } = await httpClient.get(ENDPOINTS.auth.me);
    return data;
  },

  async logout() {
    try {
      await httpClient.post(ENDPOINTS.auth.logout);
    } finally {
      localStorage.removeItem('nortia_access_token');
      localStorage.removeItem('nortia_refresh_token');
    }
  },
};
