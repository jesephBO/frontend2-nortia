import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

// Usuario de demostración: se usa SOLO si el API Gateway de auth
// todavía no está desplegado, para que el resto del frontend
// (rutas protegidas, panel, etc.) se pueda demostrar de punta a
// punta. En cuanto auth-service responde, este camino nunca se usa.
function buildDemoSession(email, name, company) {
  return {
    accessToken: 'demo-access-token',
    refreshToken: 'demo-refresh-token',
    user: {
      id: 'demo-user',
      name: name || email?.split('@')[0] || 'Operador demo',
      company: company || 'Cuenta de demostración',
      email,
    },
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoSession, setIsDemoSession] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('nortia_access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    if (token === 'demo-access-token') {
      setUser(JSON.parse(localStorage.getItem('nortia_demo_user') || 'null'));
      setIsDemoSession(true);
      setLoading(false);
      return;
    }
    authService
      .me()
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem('nortia_access_token');
        localStorage.removeItem('nortia_refresh_token');
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('nortia_access_token', data.accessToken);
      localStorage.setItem('nortia_refresh_token', data.refreshToken);
      setIsDemoSession(false);
      setUser(data.user);
      return data.user;
    } catch (err) {
      // Sin conexión al API Gateway (auth-service no desplegado aún):
      // se entra en modo demo para poder mostrar el resto del frontend.
      if (!err?.response) {
        const data = buildDemoSession(credentials.email);
        localStorage.setItem('nortia_access_token', data.accessToken);
        localStorage.setItem('nortia_refresh_token', data.refreshToken);
        localStorage.setItem('nortia_demo_user', JSON.stringify(data.user));
        setIsDemoSession(true);
        setUser(data.user);
        return data.user;
      }
      throw err;
    }
  }

  async function register(payload) {
    try {
      const data = await authService.register(payload);
      localStorage.setItem('nortia_access_token', data.accessToken);
      localStorage.setItem('nortia_refresh_token', data.refreshToken);
      setIsDemoSession(false);
      setUser(data.user);
      return data.user;
    } catch (err) {
      if (!err?.response) {
        const data = buildDemoSession(payload.email, payload.name, payload.company);
        localStorage.setItem('nortia_access_token', data.accessToken);
        localStorage.setItem('nortia_refresh_token', data.refreshToken);
        localStorage.setItem('nortia_demo_user', JSON.stringify(data.user));
        setIsDemoSession(true);
        setUser(data.user);
        return data.user;
      }
      throw err;
    }
  }

  async function logout() {
    if (!isDemoSession) {
      await authService.logout();
    } else {
      localStorage.removeItem('nortia_access_token');
      localStorage.removeItem('nortia_refresh_token');
      localStorage.removeItem('nortia_demo_user');
    }
    setUser(null);
    setIsDemoSession(false);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, isDemoSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
