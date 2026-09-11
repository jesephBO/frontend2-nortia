import axios from 'axios';
import { GATEWAY_BASE_URL, ENDPOINTS, buildUrl } from '../config/apiGateway';

/**
 * Instancia única de axios que TODOS los servicios usan para hablar
 * con el API Gateway. Nunca se instancia axios directamente en un
 * componente ni en otro service: todo pasa por aquí para mantener
 * cabeceras, timeouts, refresco de token y manejo de errores
 * consistentes.
 */
const httpClient = axios.create({
  baseURL: GATEWAY_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Adjunta el token en cada request ----
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('nortia_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Manejo de 401 -> intenta refrescar token una vez ----
let isRefreshing = false;
let queue = [];

function processQueue(error, token = null) {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return httpClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('nortia_refresh_token');
        const { data } = await axios.post(buildUrl(ENDPOINTS.auth.refresh), {
          refreshToken,
        });

        localStorage.setItem('nortia_access_token', data.accessToken);
        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('nortia_access_token');
        localStorage.removeItem('nortia_refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
